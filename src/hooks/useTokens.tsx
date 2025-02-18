"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

const ITEMS_PER_PAGE = 40;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const SEARCH_DEBOUNCE_MS = 300; // Debounce search for better performance

interface UseTokensProps {
  search?: string;
}

interface Token {
  address?: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

// Create search index for faster lookups
const createSearchIndex = (tokens: Token[]) => {
  return tokens.reduce((acc, token, index) => {
    const searchableText = `${token.name.toLowerCase()} ${token.symbol.toLowerCase()}`;
    acc[searchableText] = index;
    return acc;
  }, {} as Record<string, number>);
};

const useTokens = ({ search = "" }: UseTokensProps = {}) => {
  const fetchTokensPage = useCallback(async ({ pageParam = 0 }) => {
    const cachedData = localStorage.getItem('tokens');
    const cachedTimestamp = localStorage.getItem('tokensTimestamp');
    const cachedIndex = localStorage.getItem('tokensSearchIndex');
    const now = Date.now();

    let allTokens: Token[];
    let searchIndex: Record<string, number>;

    // Check cache validity
    if (
      cachedData && 
      cachedTimestamp && 
      cachedIndex &&
      now - Number(cachedTimestamp) < CACHE_DURATION
    ) {
      allTokens = JSON.parse(cachedData);
      searchIndex = JSON.parse(cachedIndex);
    } else {
      const response = await fetch(`https://tokens.jup.ag/tokens?tags=verified`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      allTokens = await response.json();
      searchIndex = createSearchIndex(allTokens);
      
      // Update cache with both tokens and search index
      localStorage.setItem('tokens', JSON.stringify(allTokens));
      localStorage.setItem('tokensSearchIndex', JSON.stringify(searchIndex));
      localStorage.setItem('tokensTimestamp', now.toString());
    }

    // Optimize search using the index
    const filteredTokens = search.length > 0
      ? allTokens.filter((token, index) => {
          const searchableText = `${token.name.toLowerCase()} ${token.symbol.toLowerCase()}`;
          const searchTerms = search.toLowerCase().split(' ');
          
          // Match all search terms (AND operation)
          return searchTerms.every(term => searchableText.includes(term));
        })
      : allTokens;

    const start = pageParam * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const hasNextPage = end < filteredTokens.length;

    return {
      filteredTokens,
      paginatedTokens: filteredTokens.slice(start, end),
      nextPage: hasNextPage ? pageParam + 1 : undefined,
      totalTokens: filteredTokens.length,
    };
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['tokens', search],
    queryFn: fetchTokensPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: CACHE_DURATION,
  });

  const paginatedTokens = useMemo(
    () => data?.pages.flatMap((page) => page.paginatedTokens) ?? [],
    [data]
  );

  return {
    tokens: paginatedTokens,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    isError,
    error,
    totalTokens: data?.pages[0]?.totalTokens ?? 0,
  };
};

export default useTokens;