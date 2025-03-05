import { useCallback, useState } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { buildWhirlpoolsSwapTransaction, sendWhirlpoolsSwapTransaction } from '@/utils/octane';
import toast from 'react-hot-toast';

interface JustInTimeSwapProps {
  connection: Connection | null;
  publicKey: PublicKey | null;
  signTransaction: ((transaction: any) => Promise<any>) | null;
  fetchUserSolBalance: () => Promise<number>;
  amount: number;
}

interface JustInTimeSwapResult {
  isLoading: boolean;
  executeJustInTimeSwap: (
    tokenMint: string, 
    requiredSol: number,
  ) => Promise<string | null>;
  error: Error | null;
}

export function useJustInTimeSwap({
  connection,
  publicKey,
  signTransaction,
  fetchUserSolBalance,
  amount
}: JustInTimeSwapProps): JustInTimeSwapResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeJustInTimeSwap = useCallback(async (
    tokenMint: string,
    requiredSol: number // in SOL (not lamports)
  ): Promise<string | null> => {
    if (!connection || !publicKey || !signTransaction) {
      setError(new Error("Missing wallet connection details"));
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert SOL to lamports
      const requiredLamports = requiredSol * 10**9;
      
      // Get token public key
      const tokenPublicKey = new PublicKey(tokenMint);
      
    //   toast.loading("Calculating swap rate...");
      
      const { quote } = await buildWhirlpoolsSwapTransaction(
        publicKey, 
        tokenPublicKey, 
        amount
      );
      
      // Calculate the price ratio
      const pricePerLamportInTokenDecimals = (
        Number(quote.estimatedAmountIn) / 
        Number(quote.estimatedAmountOut)
      );

      // Get rent exemption amount
      const rentExemption = await connection.getMinimumBalanceForRentExemption(0);
      
      // Calculate required amount with buffer for slippage (2%)
      const requiredAmount = Math.floor(
        (requiredLamports + rentExemption) * 
        pricePerLamportInTokenDecimals * 
        1.02
      );
      
      // Add delay to avoid rate limiting
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      await sleep(1000);
      
      toast.loading("Swapping tokens for SOL to cover transaction fees...");
      
      // Build and execute the swap transaction
      const { transaction, messageToken } = await buildWhirlpoolsSwapTransaction(
        publicKey, 
        tokenPublicKey, 
        requiredAmount
      );
      
      const signedTransaction = await signTransaction(transaction);
      const txid = await sendWhirlpoolsSwapTransaction(signedTransaction, messageToken);
      
      toast.success("Successfully acquired SOL for transaction fees");
      
      // Update user's SOL balance
      await fetchUserSolBalance();
      
      return txid;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during just-in-time swap');
      setError(error);
      console.log(err);
      toast.error(`Failed to acquire SOL: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, signTransaction, fetchUserSolBalance]);

  return {
    isLoading,
    executeJustInTimeSwap,
    error,
  };
}