import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface SolBalanceProps {
  connection: Connection | null;
  publicKey: PublicKey | null;
}

interface SolBalanceResult {
  solBalance: number;
  isLoading: boolean;
  fetchSolBalance: () => Promise<number>;
  needsJustInTimeSwap: (requiredSol: number) => boolean;
  error: Error | null;
}

export function useSolBalance({
  connection,
  publicKey,
}: SolBalanceProps): SolBalanceResult {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSolBalance = useCallback(async (): Promise<number> => {
    if (!connection || !publicKey) {
      return 0;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / 10**9;
      
      setSolBalance(balanceInSol);
      return balanceInSol;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching SOL balance');
      setError(error);
      console.error('Error fetching SOL balance:', error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  // Check if the user needs a just-in-time swap
  const needsJustInTimeSwap = useCallback((requiredSol: number): boolean => {
    // Add a small buffer to the required amount (5%)
    const requiredWithBuffer = requiredSol * 1.05;
    return solBalance < requiredWithBuffer;
  }, [solBalance]);

  // Fetch balance when the wallet connects
  useEffect(() => {
    if (publicKey) {
      fetchSolBalance();
    } else {
      setSolBalance(0);
    }
  }, []);

  return {
    solBalance,
    isLoading,
    fetchSolBalance,
    needsJustInTimeSwap,
    error,
  };
}