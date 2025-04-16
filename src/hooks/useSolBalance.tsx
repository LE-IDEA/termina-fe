import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface SolBalanceProps {
  connection: Connection | null;
  publicKey: PublicKey | null | string;
}

interface SolBalanceResult {
  solBalance: number;
  isLoading: boolean;
  fetchSolBalance: () => Promise<number>;
  needsJustInTimeSwap: (requiredSol: number) => boolean;
  error: Error | null;
}

// Helper function to safely convert string to PublicKey
function safePublicKey(value: PublicKey | string | null): PublicKey | null {
  if (!value) return null;
  if (value instanceof PublicKey) return value;
  
  try {
    return new PublicKey(value);
  } catch (error) {
    console.error("Invalid Solana address format:", error);
    return null;
  }
}

export function useSolBalance({
  connection,
  publicKey: inputPublicKey,
}: SolBalanceProps): SolBalanceResult {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Safely convert to PublicKey
  const publicKey = safePublicKey(inputPublicKey);

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
  }, [publicKey, fetchSolBalance]);

  return {
    solBalance,
    isLoading,
    fetchSolBalance,
    needsJustInTimeSwap,
    error,
  };
}