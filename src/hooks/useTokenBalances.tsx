import { useEffect, useState } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const useUserTokenBalance = () => {
  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenBalancesUSD = async () => {
      if (!address || !connection) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get all token accounts owned by the user
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(address),
          { programId: TOKEN_PROGRAM_ID }
        );

        let totalUSDValue = 0;

        // Get SOL balance and convert to USD
        const solBalance = await connection.getBalance(new PublicKey(address));
        const solInSOL = solBalance / 1_000_000_000; // Convert lamports to SOL

        // Fetch SOL price in USD
        const solPriceResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const solPriceData = await solPriceResponse.json();
        const solPriceUSD = solPriceData.solana.usd;

        // Add SOL value in USD
        totalUSDValue += solInSOL * solPriceUSD;

        // Process other tokens
        const tokenMintAddresses = tokenAccounts.value.map(
          (account) => account.account.data.parsed.info.mint
        );

        // Skip empty accounts
        const activeTokenAccounts = tokenAccounts.value.filter(
          (account) => account.account.data.parsed.info.tokenAmount.uiAmount > 0
        );

        console.log(activeTokenAccounts);
        console.log(tokenMintAddresses);

        // Fetch token metadata for active accounts
        for (const account of tokenAccounts.value) {
          const parsedInfo = account.account.data.parsed.info;
          const mintAddress = parsedInfo.mint;
          const tokenAmount = parsedInfo.tokenAmount.uiAmount;

          try {
            // Try to get the token info from Solana token list
            const tokenInfoResponse = await fetch(
              `https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json`
            );
            const tokenList = await tokenInfoResponse.json();
            const tokenInfo = tokenList.tokens.find(
              (t) => t.address === mintAddress
            );

            if (tokenInfo) {
              const symbol = tokenInfo.symbol.toLowerCase();

              // Get token price from CoinGecko
              const priceResponse = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
              );
              const priceData = await priceResponse.json();
              console.log(priceData);
              

              if (priceData[symbol]) {
                const tokenPriceUSD = priceData[symbol].usd;
                totalUSDValue += tokenAmount * tokenPriceUSD;
              }
            }
          } catch (err) {
            console.warn(`Could not get price for token ${mintAddress}`, err);
            // Continue with other tokens
          }
        }

        setTotalBalanceUSD(totalUSDValue);
      } catch (err) {
        console.error("Error fetching token balances:", err);
        setError("Failed to fetch token balances in USD");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenBalancesUSD();
  }, [address, connection]);

  return { totalBalanceUSD, isLoading, error };
};
