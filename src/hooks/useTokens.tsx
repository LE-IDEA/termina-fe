"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const ITEMS_PER_PAGE = 10;
const INITIAL_ITEMS = 30;

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
    let allTokens: Token[];

    if (cachedTokens) {
      allTokens = JSON.parse(cachedTokens);
    } else {

      const response = await fetch(`https://tokens.jup.ag/tokens?tags=verified`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      allTokens = await response.json();
      localStorage.setItem('tokens', JSON.stringify(allTokens));
    }

    const filteredTokens = search.length > 0
      ? allTokens.filter(
          (token) =>
            token.name.toLowerCase().includes(search.toLowerCase()) ||
            token.symbol.toLowerCase().includes(search.toLowerCase())
        )
      : allTokens;

   
    const start = pageParam * ITEMS_PER_PAGE;
    const end = pageParam === 0 ? INITIAL_ITEMS : start + ITEMS_PER_PAGE;
    const hasNextPage = end < filteredTokens.length;

    return {
      filteredTokens,
      paginatedTokens: allTokens.slice(start, end),
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
    refetch,
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

  const filteredTokens = useMemo(
    () => data?.pages[0]?.filteredTokens ?? [],
    [data]
  );

  return {
    tokens: paginatedTokens, 
    filteredTokens, //
    loadMore: fetchNextPage, // Function to load more tokens
    hasMore: hasNextPage, // Whether there are more tokens to load
    isLoadingMore: isFetchingNextPage, // Loading state for pagination
    isLoading, // Initial loading state
    isError, // Error state
    error, // Error object
    refetch, // Function to refetch data
    totalTokens: data?.pages[0]?.totalTokens ?? 0, // Total number of filtered tokens
  };
};

export default useTokens;