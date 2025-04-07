"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Pool } from "@/types/jupTokens";

const useTokenData = (mintAddress: string) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<Pool | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mintAddress) return;

    const fetchTokenData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch token analytics from Jupiter Data API
        const analyticsResponse = await axios.get(
          `https://datapi.jup.ag/v1/pools?assetIds=${mintAddress}`,
          { headers: { Accept: "application/json" } }
        );

        // Fetch token details from Jupiter API
        const jupiterResponse = await axios.get(
          `https://api.jup.ag/tokens/v1/token/${mintAddress}`,
          { headers: { Accept: "application/json" } }
        );

        const tokenDetails = jupiterResponse.data;
        const analytics = analyticsResponse.data?.pools?.[0];

        setTokenData(tokenDetails);
        setAnalyticsData(analytics);
      } catch (err) {
        setError("Failed to fetch token data");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTokenData();

    // Set up polling to refetch data every 10 seconds.
    const interval = setInterval(() => {
      fetchTokenData();
    }, 10000);

    return () => clearInterval(interval);
  }, [mintAddress]);

  return { tokenData, analyticsData, loading, error };
};

export default useTokenData;
