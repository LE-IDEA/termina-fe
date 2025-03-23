import { useEffect, useState } from "react";
import { FungibleToken } from "@/types/token";

const useFungibleTokens = (walletAddress: string) => {
  const [fungibleTokens, setFungibleTokens] = useState<FungibleToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchFungibleTokens = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`;

        if (!url) {
          throw new Error("NEXT_PUBLIC_HELIUS_RPC_URL is not set");
        }

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "searchAssets",
            params: {
              ownerAddress: walletAddress,
              tokenType: "fungible",
              displayOptions: {
                showNativeBalance: true,
                showInscription: true,
                showCollectionMetadata: true,
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch fungible tokens");
        }

        const data = await response.json();
        
        const items: FungibleToken[] = data.result.items.filter(
          (item: any) =>
            item.interface === "FungibleToken" || item.interface === "FungibleAsset" 
        );

        setFungibleTokens(items);


        const nativeBalancePrice = data.result.nativeBalance.total_price || 0;
        const total = items.reduce((sum, token) => {
          const tokenPrice = token.token_info?.price_info?.total_price || 0;
          return sum + tokenPrice;
        }, nativeBalancePrice);

        setTotalPrice(total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchFungibleTokens();
    }
  }, [walletAddress]);

  return { fungibleTokens, loading, error, totalPrice };
};

export default useFungibleTokens;
