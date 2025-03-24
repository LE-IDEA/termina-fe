import { useEffect, useState } from "react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export function useTokenBalances() {
  const { connection } = useAppKitConnection();
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [balancesLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    async function getBalances() {
      if (!address || !connection) {
        setBalances({});
        setIsLoading(false);
        return;
      }

      try {
        const accounts = await connection.getTokenAccountsByOwner(
          new PublicKey(address),
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        const balanceMap: Record<string, number> = {};

        accounts.value.forEach((account) => {
          const data = Buffer.from(account.account.data);

          const mint = new PublicKey(data.slice(0, 32)).toString();
          const amount = Number(data.readBigUInt64LE(64));

          balanceMap[mint] = amount;
        });

        // Get SOL balance
        const solBalance = await connection.getBalance(
          new PublicKey(address)
        );
        balanceMap["So11111111111111111111111111111111111111112"] = solBalance;

        setBalances(balanceMap);
      } catch (error) {
        console.error("Error fetching token balances:", error);
        setBalances({});
      } finally {
        setIsLoading(false);
      }
    }

    getBalances();

    if (isConnected && connection && address) {
      getBalances();
      connection.onAccountChange(
        new PublicKey(address),
        getBalances,
        "confirmed"
      );
    }
  }, [connection, address]);

  return { balances, balancesLoading };
}
