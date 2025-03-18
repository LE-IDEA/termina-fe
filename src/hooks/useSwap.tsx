import { useState, useCallback } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

export function useSwap({ connection, walletProvider }) {
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [estimatedFee, setEstimatedFee] = useState(0.001);
  const [swapping, setSwapping] = useState(false);
  const [toAmount, setToAmount] = useState("");

  // Use environment variable with fallback
  const SPONSOR_PUBLIC_KEY = process.env.NEXT_PUBLIC_SPONSOR_PUBLIC_KEY || "Gj1tcyr5858jdUNxcqYUMnWJJFy4YpRYsyqf9zLmMQa";

  async function getEstimatedSwapFee(quote) {
    if (!quote || !connection || !walletProvider?.publicKey) {
      return 0.001; // Fallback fee
    }
    
    try {
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: walletProvider.publicKey.toString(),
          wrapAndUnwrapSol: true,
          computeUnitPriceMicroLamports: 100000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to estimate swap fee: ${response.status}`);
      }
      
      const data = await response.json();

      // Calculate total fee including network and buffer
      let totalFeeInSol = 0;
      const networkFee = 0.000005; // Base network fee
      
      if (data.priorityFee) {
        totalFeeInSol += Number(data.priorityFee) / 10 ** 9;
      }
      
      if (data.otherFees && data.otherFees.signatureFee) {
        totalFeeInSol += Number(data.otherFees.signatureFee) / 10 ** 9;
      }
      
      totalFeeInSol += networkFee;
      totalFeeInSol *= 1.2; // Add a 20% buffer
      
      return Math.max(totalFeeInSol, 0.001); // Ensure minimum fee
    } catch (error) {
      console.error("Error estimating swap fee:", error);
      return 0.001; // Fallback to minimum fee on error
    }
  }

  // Get quote for a swap based on input parameters
  async function getQuote(currentAmount, fromAsset, toAsset) {
    if (!currentAmount || !fromAsset || !toAsset) {
      return;
    }
    try {
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset.address}&outputMint=${toAsset.address}&amount=${currentAmount * Math.pow(10, fromAsset.decimals)}&slippage=0.5`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quote: ${response.status}`);
      }
      
      const quote = await response.json();

      if (quote && quote.outAmount) {
        const outAmountNumber = Number(quote.outAmount) / Math.pow(10, toAsset.decimals);
        setToAmount(outAmountNumber.toString());
        setQuoteResponse(quote);
        
        // Update fee estimate based on quote
        const fee = await getEstimatedSwapFee(quote);
        setEstimatedFee(fee);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote");
      setToAmount("");
      setQuoteResponse(null);
    }
  }

  // Debounce the quote call for performance
  const debounceQuoteCall = useCallback(
    debounce((currentAmount, fromAsset, toAsset) => {
      getQuote(currentAmount, fromAsset, toAsset);
    }, 500),
    []
  );

  // Sign and send the swap transaction
  async function signAndSendTransaction() {
    if (!walletProvider || !connection || !quoteResponse) {
      toast.error("Missing required dependencies for swap");
      return null;
    }
  
    if (!SPONSOR_PUBLIC_KEY) {
      toast.error("Sponsor public key not found");
      return null;
    }
  
    // Create a toast ID for updating the same toast
    const toastId = toast.loading("Preparing swap transaction...");
    setSwapping(true);
  
    try {
      // 1. Request the swap transaction (with feeAccount set to the sponsor)
      const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: walletProvider.publicKey.toString(),
          wrapAndUnwrapSol: true,
          feeAccount: SPONSOR_PUBLIC_KEY,
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
                maxLamports: 10000000,
                global: false,
                priorityLevel: "veryHigh"
            }
        }
        }),
      });
  
      if (!swapResponse.ok) {
        throw new Error(`Failed to create swap transaction: ${swapResponse.status}`);
      }
      
      const swapData = await swapResponse.json();
      const swapTransaction = swapData.swapTransaction;
  
      if (!swapTransaction) {
        throw new Error("No swap transaction returned");
      }
  
      // 2. Get sponsor signature from backend
      toast.loading("Sponsoring transaction...", { id: toastId });
      const sponsorResponse = await fetch("https://octane-server-omega.vercel.app/api/sponsor-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction: swapTransaction }),
      });
  
      if (!sponsorResponse.ok) {
        throw new Error(`Failed to sponsor transaction: ${sponsorResponse.status}`);
      }
      
      const sponsoredData = await sponsorResponse.json();
  
      if (!sponsoredData.transaction) {
        throw new Error("No sponsored transaction returned");
      }
  
      // 3. Deserialize the sponsored transaction
      toast.loading("Processing transaction...", { id: toastId });
      const sponsoredTxBuffer = Buffer.from(sponsoredData.transaction, "base64");
      const transaction = VersionedTransaction.deserialize(sponsoredTxBuffer);
  
      // 4. Have the user sign the transaction
      toast.loading("Signing transaction...", { id: toastId });
      const signedTransaction = await walletProvider.signTransaction(transaction);
  
      // 5. Send the signed transaction
      toast.loading("Sending transaction...", { id: toastId });
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 3,
      });
  
      // 6. Confirm the transaction
      toast.loading("Confirming transaction...", { id: toastId });
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "finalized"
      );
  
      toast.success(`Swap successful: https://solscan.io/tx/${txid}`, { id: toastId });
      setSwapping(false);
      return txid;
    } catch (error) {
      console.error("Swap error:", error);
      toast.error(`Swap failed: ${error.message || "Unknown error"}`, { id: toastId });
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
    signAndSendTransaction 
  };
}