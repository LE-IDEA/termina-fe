import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Token data type
export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

// Pool data type from Jupiter API
export interface Pool {
  id: string;
  name: string;
  tokenA: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  tokenB: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  tvl: number;
  volume24h: number;
  fee: number;
  price: number;
  priceChange24h: number;
  // Add other fields as needed
}

// Analytics data type
export interface AnalyticsData {
  volume: {
    [timeframe: string]: number;
  };
  transactions: {
    [timeframe: string]: number;
  };
  holders: number;
  topHolders: {
    address: string;
    balance: number;
    percentage: number;
  }[];
}

// Function to fetch token data from Jupiter API
const fetchTokenData = async (tokenAddress: string) => {
  try {
    const response = await axios.get(
      `https://api.jup.ag/tokens/v1/token/${tokenAddress}`,
      { headers: { Accept: 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching token data from Jupiter:', error);
    
    // Try fallback to our solanaTokenService if Jupiter fails
    try {
      const { getTokenMetadata } = await import('@/services/solanaTokenService');
      return getTokenMetadata(tokenAddress);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw new Error('Failed to fetch token data');
    }
  }
};

// Function to fetch pool analytics from Jupiter API
const fetchPoolAnalytics = async (tokenAddress: string): Promise<Pool | null> => {
  try {
    const response = await axios.get(
      `https://datapi.jup.ag/v1/pools?assetIds=${tokenAddress}`,
      { headers: { Accept: 'application/json' } }
    );
    
    if (response.data?.pools && response.data.pools.length > 0) {
      return response.data.pools[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching pool analytics:', error);
    throw new Error('Failed to fetch pool analytics');
  }
};

// Hook to fetch and manage token data
export default function useTokenData(tokenAddress: string) {
  // Fetch token data using React Query
  const {
    data: tokenData,
    isLoading: isTokenLoading,
    error: tokenError
  } = useQuery({
    queryKey: ['tokenData', tokenAddress],
    queryFn: () => fetchTokenData(tokenAddress),
    enabled: !!tokenAddress,
  });

  // Fetch pool analytics data using React Query
  const {
    data: poolData,
    isLoading: isPoolLoading,
    error: poolError
  } = useQuery({
    queryKey: ['poolData', tokenAddress],
    queryFn: () => fetchPoolAnalytics(tokenAddress),
    enabled: !!tokenAddress,
  });

  // Prepare analytics data from pool data
  const analyticsData: AnalyticsData | undefined = poolData ? {
    volume: {
      '1H': poolData.volume24h / 24, // Approximating hourly volume
      '1D': poolData.volume24h,
      '1W': poolData.volume24h * 7, // Approximating weekly volume
      '1M': poolData.volume24h * 30, // Approximating monthly volume
    },
    transactions: {
      '1H': Math.floor(poolData.volume24h / 24 / 1000), // Approximating hourly transactions
      '1D': Math.floor(poolData.volume24h / 1000), // Approximating daily transactions
      '1W': Math.floor(poolData.volume24h * 7 / 1000), // Approximating weekly transactions
      '1M': Math.floor(poolData.volume24h * 30 / 1000), // Approximating monthly transactions
    },
    holders: 0, // We don't have this data from Jupiter
    topHolders: [], // We don't have this data from Jupiter
  } : undefined;

  const loading = isTokenLoading || isPoolLoading;
  const error = tokenError || poolError;

  return {
    tokenData,
    analyticsData,
    poolData, // Adding poolData to the returned object for direct access
    loading,
    error,
  };
}