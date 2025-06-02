import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAppConnection } from "@/providers/PrivyProvider";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export function useTokenBalances() {
  const { connection } = useConnection();
  const { user, connected } = useAppConnection();
  const address = user?.wallet?.address ?? "";

  const [balances, setBalances] = useState<Record<string, number>>({});
  const [balancesLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!connected || !connection || !address) {
      setBalances({});
      setIsLoading(false);
      return;
    }

    let unsub: (() => void) | null = null;

    const fetchBalances = async () => {
      setIsLoading(true);

      try {
        const ownerKey = new PublicKey(address);
        const tokenAccounts = await connection.getTokenAccountsByOwner(ownerKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        const balanceMap: Record<string, number> = {};
        for (const { account } of tokenAccounts.value) {
          const data = Buffer.from(account.data);
          const mint = new PublicKey(data.slice(0, 32)).toString();
          const amount = Number(data.readBigUInt64LE(64));
          balanceMap[mint] = amount;
        }

        // SOL balance
        const solBal = await connection.getBalance(ownerKey);
        balanceMap["So11111111111111111111111111111111111111112"] = solBal;

        setBalances(balanceMap);
      } catch (err) {
        console.error("Error fetching token balances:", err);
        setBalances({});
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchBalances();

    // Subscribe to SOL account changes
    unsub = connection.onAccountChange(
      new PublicKey(address),
      fetchBalances,
      "confirmed"
    );

    // Cleanup
    return () => {
      if (unsub) connection.removeAccountChangeListener(unsub);
    };
  }, [connected, connection, address]);

  return { balances, balancesLoading };
}
