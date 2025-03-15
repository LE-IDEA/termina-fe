"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const ITEMS_PER_PAGE = 40;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseTokensProps {
  search?: string;
}

interface Token {
  address?: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

const useTokens = ({ search = "" }: UseTokensProps = {}) => {
  const fetchTokensPage = async ({ pageParam = 0 }) => {
    const cachedTokens = localStorage.getItem('tokens');
    const cachedTimestamp = localStorage.getItem('tokensTimestamp');
    const now = Date.now();

    let allTokens: Token[];

    if (cachedTokens && cachedTimestamp && now - Number(cachedTimestamp) < CACHE_DURATION) {
      allTokens = JSON.parse(cachedTokens);
    } else {
      const response = await fetch(`https://tokens.jup.ag/tokens?tags=verified`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tokens');
      }
      allTokens = await response.json();
      localStorage.setItem('tokens', JSON.stringify(allTokens));
      localStorage.setItem('tokensTimestamp', now.toString());
    }

    const filteredTokens = search.length > 0
      ? allTokens.filter(
          (token) =>
            token.name.toLowerCase().includes(search.toLowerCase()) ||
            token.symbol.toLowerCase().includes(search.toLowerCase())
        )
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
  };

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
    staleTime: 5 * 60 * 1000,
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