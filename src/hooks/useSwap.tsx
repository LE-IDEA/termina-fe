import { useState, useCallback } from "react";
import { VersionedTransaction, PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { debounce } from "@/utils";

interface SwapHookParams {
  connection: any;
  walletProvider: any;
}

interface SwapHookResult {
  quoteResponse: any;
  estimatedFee: number;
  swapping: boolean;
  toAmount: string;
  getQuote: (currentAmount: number, fromAsset: any, toAsset: any) => Promise<void>;
  debounceQuoteCall: (currentAmount: number, fromAsset: any, toAsset: any) => void;
  signAndSendTransaction: () => Promise<string | null>;
}

export function useSwap({ connection, walletProvider }: SwapHookParams): SwapHookResult {
  // State management
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [estimatedFee, setEstimatedFee] = useState<number>(0.001);
  const [swapping, setSwapping] = useState<boolean>(false);
  const [toAmount, setToAmount] = useState<string>("");

  // Fee sponsor address - the account that will pay for the transaction
  const SPONSOR_PUBLIC_KEY = process.env.NEXT_PUBLIC_SPONSOR_PUBLIC_KEY || "Gj1tcyr5858jdUNxcqYUMnWJJFy4YpRYsyqf9zLmMQa";
  
  // Sponsor server endpoint
  const SPONSOR_SERVER_URL = process.env.NEXT_PUBLIC_SPONSOR_SERVER_URL || "https://octane-server-omega.vercel.app/api/sponsor-transaction";

  /**
   * Estimates the fee for a swap transaction
   * @param {Object} quote - Quote response from Jupiter API
   * @returns {number} - Estimated fee in SOL
   */
  async function getEstimatedSwapFee(quote: any): Promise<number> {
    if (!quote || !connection || !walletProvider?.address) {
      return 0.001; // Default minimum fee
    }
    
    try {
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: walletProvider.address,
          wrapAndUnwrapSol: true,
          priorityLevel:"high"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to estimate swap fee: ${response.status}`);
      }
      
      const data = await response.json();

      // Calculate total fee with a buffer for safety
      let totalFeeInSol = 0;
      const networkFee = 0.000005; // Base network fee
      
      if (data.priorityFee) {
        totalFeeInSol += Number(data.priorityFee) / 10 ** 9;
      }
      
      if (data.otherFees?.signatureFee) {
        totalFeeInSol += Number(data.otherFees.signatureFee) / 10 ** 9;
      }
      
      totalFeeInSol += networkFee;
      totalFeeInSol *= 1.2; // Add a 20% buffer
      
      return Math.max(totalFeeInSol, 0.001); // Minimum fee of 0.001 SOL
    } catch (error) {
      console.error("Error estimating swap fee:", error);
      return 0.001; // Fallback to minimum fee on error
    }
  }

  /**
   * Fetches a swap quote from Jupiter API
   */
  async function getQuote(currentAmount: number, fromAsset: any, toAsset: any): Promise<void> {
    if (!currentAmount || !fromAsset || !toAsset || currentAmount <= 0) {
      setToAmount("");
      setQuoteResponse(null);
      return;
    }

    try {
      // Calculate input amount with proper decimals
      const inputAmount = currentAmount * Math.pow(10, fromAsset.decimals || 9);
      
      // Fetch quote from Jupiter API
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset.address}&outputMint=${toAsset.address}&amount=${inputAmount}&slippage=0.5`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quote: ${response.status}`);
      }
      
      const quote = await response.json();

      if (quote && quote.outAmount) {
        // Convert outAmount to human-readable format
        const outAmountNumber = Number(quote.outAmount) / Math.pow(10, toAsset.decimals || 9);
        setToAmount(outAmountNumber.toString());
        setQuoteResponse(quote);
        
        // Update fee estimate based on quote
        const fee = await getEstimatedSwapFee(quote);
        setEstimatedFee(fee);
      } else {
        throw new Error("Invalid quote response");
      }
    } catch (error: any) {
      console.error("Error fetching quote:", error);
      toast.error("Failed to get swap quote");
      setToAmount("");
      setQuoteResponse(null);
    }
  }

  // Debounce the quote call to prevent excessive API requests
  const debounceQuoteCall = useCallback(
    debounce((currentAmount: number, fromAsset: any, toAsset: any) => {
      getQuote(currentAmount, fromAsset, toAsset);
    }, 500),
    []
  );

  /**
   * Executes the swap transaction with fee sponsorship
   * @returns {string|null} - Transaction signature if successful, null otherwise
   */
  async function signAndSendTransaction(): Promise<string | null> {
    // Validate required dependencies
    if (!walletProvider || !connection || !quoteResponse) {
      toast.error("Missing required dependencies for swap");
      return null;
    }
  
    if (!walletProvider.address) {
      toast.error("Wallet not connected");
      return null;
    }
  
    if (!SPONSOR_PUBLIC_KEY) {
      toast.error("Sponsor public key not configured");
      return null;
    }
  
    // Create a toast ID for updating the same toast
    const toastId = toast.loading("Preparing swap transaction...");
    setSwapping(true);
  
    try {
      // 1. Request the swap transaction with the sponsor as fee account
      toast.loading("Building swap transaction...", { id: toastId });
      const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: walletProvider.address,
          wrapAndUnwrapSol: true,
          feeAccount: SPONSOR_PUBLIC_KEY,
          // Set priority for the transaction
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 10000000, // 0.01 SOL max priority fee
              global: false,
              priorityLevel: "veryHigh"
            }
          }
        }),
      });
  
      if (!swapResponse.ok) {
        const errorText = await swapResponse.text();
        throw new Error(`Failed to create swap transaction: ${swapResponse.status} - ${errorText}`);
      }
      
      const swapData = await swapResponse.json();
      const swapTransaction = swapData.swapTransaction;
  
      if (!swapTransaction) {
        throw new Error("No swap transaction returned from Jupiter");
      }
  
      // 2. Get sponsor signature from backend
      toast.loading("Getting transaction sponsorship...", { id: toastId });
      const sponsorResponse = await fetch(SPONSOR_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction: swapTransaction }),
      });
  
      if (!sponsorResponse.ok) {
        const errorText = await sponsorResponse.text();
        throw new Error(`Failed to sponsor transaction: ${sponsorResponse.status} - ${errorText}`);
      }
      
      const sponsoredData = await sponsorResponse.json();
  
      if (!sponsoredData.transaction) {
        throw new Error("No sponsored transaction returned from server");
      }
  
      // 3. Deserialize the sponsored transaction
      toast.loading("Processing transaction...", { id: toastId });
      const sponsoredTxBuffer = Buffer.from(sponsoredData.transaction, "base64");
      const transaction = VersionedTransaction.deserialize(sponsoredTxBuffer);
  
      // 4. Have the user sign the transaction
      toast.loading("Please sign the transaction...", { id: toastId });
      
      try {
        // For Privy's wallet provider we need to use their signAndSendTransaction API
        if (walletProvider.signAndSendTransaction) {
          // Use Privy's method
          const result = await walletProvider.signAndSendTransaction(transaction);
          const txid = result?.signature || transaction.signatures[0].toString();
          
          toast.success(`Swap transaction sent!`, { id: toastId });
          setSwapping(false);
          return txid;
        } else if (walletProvider.signTransaction) {
          // Fallback to traditional flow
          const signedTransaction = await walletProvider.signTransaction(transaction);
          const rawTransaction = signedTransaction.serialize();
          const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 3,
          });
          
          toast.success(`Swap transaction sent!`, { id: toastId });
          setSwapping(false);
          return txid;
        } else {
          throw new Error("Wallet doesn't support transaction signing");
        }
      } catch (error: any) {
        console.error("Error signing transaction:", error);
        toast.error(`Failed to sign transaction: ${error?.message || "Unknown error"}`, { id: toastId });
        setSwapping(false);
        return null;
      }
    } catch (error: any) {
      console.error("Swap error:", error);
      toast.error(`Swap failed: ${error?.message || "Unknown error"}`, { id: toastId });
      setSwapping(false);
      return null;
    }
  }

  return {
    quoteResponse,
    estimatedFee,
    swapping,
    toAmount,
    getQuote,
    debounceQuoteCall,
    signAndSendTransaction,
  };
}