// "use client";

// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useMemo } from 'react';

// // Define interfaces for type safety and clarity
// interface Token {
//   address?: string;
//   symbol: string;
//   name: string;
//   icon?: string;
// }

// interface UseTokensProps {
//   search?: string;
// }

// interface TokenSearchResponse {
//   tokens: Token[];
// }

// const useTokens = ({ search = "" }: UseTokensProps = {}) => {
//   // Centralize API endpoint for easier maintenance
//   const TOKEN_SEARCH_API = 'https://fe-api.jup.ag/api/v1/tokens/search';

//   // Efficient token fetching function with improved error handling
//   const fetchTokensPage = async ({ pageParam = 0 }) => {
//     try {
//       // Use URLSearchParams for proper URL encoding
//       const url = new URL(TOKEN_SEARCH_API);
//       url.searchParams.set('query', search);

//       const response = await fetch(url.toString());
      
//       if (!response.ok) {
//         throw new Error(`Token search failed: ${response.status}`);
//       }

//       const { tokens }: TokenSearchResponse = await response.json();

//       // Client-side filtering moved to this function for efficiency
//       const filteredTokens = search.length > 0
//         ? tokens.filter(token => 
//             token.name.toLowerCase().includes(search.toLowerCase()) ||
//             token.symbol.toLowerCase().includes(search.toLowerCase())
//           )
//         : tokens;

//       return {
//         filteredTokens,
//         nextPage: filteredTokens.length > 0 ? pageParam + 1 : undefined,
//         totalTokens: filteredTokens.length,
//       };
//     } catch (error) {
//       // Improved error logging and propagation
//       console.error('Token search error:', error);
//       throw error;
//     }
//   };

//   // Use React Query's useInfiniteQuery with optimized configuration
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//   } = useInfiniteQuery({
//     queryKey: ['tokens', search],
//     queryFn: fetchTokensPage,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     initialPageParam: 0,
//     // Remove local caching, rely on API and React Query's caching
//     staleTime: 0, 
//   });

//   // Memoized tokens list to prevent unnecessary re-renders
//   const tokens = useMemo(
//     () => data?.pages.flatMap(page => page.filteredTokens) ?? [],
//     [data]
//   );

//   return {
//     tokens,
//     loadMore: fetchNextPage,
//     hasMore: hasNextPage,
//     isLoadingMore: isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//     totalTokens: data?.pages[0]?.totalTokens ?? 0,
//   };
// };

// export default useTokens;


"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

// Constants for configuration
const ITEMS_PER_PAGE = 500;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_SEARCH_RESULTS = 1000; // Limit to prevent overwhelming the UI

// Enhanced Token interface with optional fields
interface Token {
  address?: string;
  mint?: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals?: number;
}

// Search configuration interface
interface UseTokensProps {
  search?: string;
  filters?: {
    minDecimals?: number;
    maxDecimals?: number;
  };
}

// Optimized search indexing mechanism
class TokenSearchIndex {
  private tokens: Token[];
  private symbolIndex: Map<string, Token[]>;
  private nameIndex: Map<string, Token[]>;
  private mintIndex: Map<string, Token>;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.symbolIndex = new Map();
    this.nameIndex = new Map();
    this.mintIndex = new Map();
    this.buildIndices();
  }

  private buildIndices() {
    // Create efficient lookup indices
    for (const token of this.tokens) {
      // Symbol index
      const symbolKey = token.symbol.toLowerCase();
      if (!this.symbolIndex.has(symbolKey)) {
        this.symbolIndex.set(symbolKey, []);
      }
      this.symbolIndex.get(symbolKey)!.push(token);

      // Name index
      const nameKey = token.name.toLowerCase();
      if (!this.nameIndex.has(nameKey)) {
        this.nameIndex.set(nameKey, []);
      }
      this.nameIndex.get(nameKey)!.push(token);

      // Mint index (if available)
      if (token.mint) {
        this.mintIndex.set(token.mint.toLowerCase(), token);
      }
    }
  }

  // Efficient search method with multiple lookup strategies
  search(query: string, maxResults: number = MAX_SEARCH_RESULTS): Token[] {
    const lowercaseQuery = query.toLowerCase();
    const results = new Set<Token>();

    // Mint exact match (highest priority)
    const mintMatch = this.mintIndex.get(lowercaseQuery);
    if (mintMatch) {
      results.add(mintMatch);
    }

    // Symbol prefix match
    const symbolMatches = Array.from(this.symbolIndex.entries())
      .filter(([symbol]) => symbol.startsWith(lowercaseQuery))
      .flatMap(([, tokens]) => tokens);
    symbolMatches.forEach(token => results.add(token));

    // Name contains match
    const nameMatches = Array.from(this.nameIndex.entries())
      .filter(([name]) => name.includes(lowercaseQuery))
      .flatMap(([, tokens]) => tokens);
    nameMatches.forEach(token => results.add(token));

    return Array.from(results).slice(0, maxResults);
  }
}

const useTokens = ({ search = "", filters }: UseTokensProps = {}) => {
  const fetchTokensPage = async ({ pageParam = 0 }) => {
    const cachedTokens = localStorage.getItem('tokens');
    const cachedTimestamp = localStorage.getItem('tokensTimestamp');
    const now = Date.now();

    let allTokens: Token[];

    // Efficient caching mechanism
    if (cachedTokens && cachedTimestamp && now - Number(cachedTimestamp) < CACHE_DURATION) {
      allTokens = JSON.parse(cachedTokens);
    } else {
      const response = await fetch(`https://api.jup.ag/tokens/v1/tagged/lst,verified,pump`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tokens');
      }
      allTokens = await response.json();
        
      // Optional: Filter tokens by decimals if specified
      if (filters?.minDecimals || filters?.maxDecimals) {
        allTokens = allTokens.filter(token => {
          const decimals = token.decimals || 0;
          return (!filters.minDecimals || decimals >= filters.minDecimals) &&
                 (!filters.maxDecimals || decimals <= filters.maxDecimals);
        });
      }

      localStorage.setItem('tokens', JSON.stringify(allTokens));
      localStorage.setItem('tokensTimestamp', now.toString());
    }

    // Use the optimized search index
    const searchIndex = new TokenSearchIndex(allTokens);
    const filteredTokens = search.length > 0 
      ? searchIndex.search(search)
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
    queryKey: ['tokens', search, JSON.stringify(filters)],
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