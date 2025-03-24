import { useState, useEffect } from "react";
import axios from "axios";

const useTokenData = (mintAddress: string) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [pairsData, setPairsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mintAddress) return;

    const fetchTokenData = async () => {
      try {
        setLoading(true);

        // Fetch token details from Jupiter API
        const jupiterResponse = await axios.get(
          `https://api.jup.ag/tokens/v1/token/${mintAddress}`,
          { headers: { Accept: "application/json" } }
        );

        // Fetch token analytics from Moralis API
        const analyticsResponse = await fetch(
          `https://deep-index.moralis.io/api/v2.2/tokens/${mintAddress}/analytics?chain=solana`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-API-Key":`${process.env.NEXT_PUBLIC_MORALIS_API}`,
            },
          }
        );

        // Fetch token pairs from Moralis API
        const pairsResponse = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/${mintAddress}/pairs`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-API-Key":`${process.env.NEXT_PUBLIC_MORALIS_API}`,
            },
          }
        );

        const tokenDetails = await jupiterResponse.data;
        const analytics = await analyticsResponse.json();
        const pairs = await pairsResponse.json();

        setTokenData(tokenDetails);
        setAnalyticsData(analytics);
        setPairsData(pairs);
      } catch (err) {
        setError("Failed to fetch token data");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [mintAddress]);

  return { tokenData, analyticsData, pairsData, loading, error };
};

export default useTokenData;
