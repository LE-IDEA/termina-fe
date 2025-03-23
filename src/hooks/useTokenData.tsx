import { useState, useEffect } from "react";
import axios from "axios";
import { Pool } from "@/types/jupTokens";

const useTokenData = (mintAddress: string) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<Pool>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //TODO: Add relevant types
  useEffect(() => {
    if (!mintAddress) return;

    const fetchTokenData = async () => {
      try {
        setLoading(true);

        // Fetch token details from Jupiter API
        const analyticsResponse = await axios.get(
          `https://datapi.jup.ag/v1/pools?assetIds=${mintAddress}`,
          { headers: { Accept: "application/json" } }
        );

        const jupiterResponse = await axios.get(
          `https://api.jup.ag/tokens/v1/token/${mintAddress}`,
          { headers: { Accept: "application/json" } }
        );


        const tokenDetails = await jupiterResponse.data;
        const analytics = await analyticsResponse.data?.pools[0];

        setTokenData(tokenDetails);
        setAnalyticsData(analytics);
        // setPairsData(pairs?.pairs[9]);
      } catch (err) {
        setError("Failed to fetch token data");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [mintAddress]);

  return { tokenData, analyticsData, loading, error };
};

export default useTokenData;
