import { useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from "@reown/appkit-adapter-solana/react";
import { VersionedTransaction } from "@solana/web3.js";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpDown, Settings2Icon } from "lucide-react";
import { Input } from "../ui/input";
import useTokens from "@/hooks/useTokens";
import { debounce } from "@/utils";
import TokenSearchModal from "./TokenModal";
import { formatBalance } from "@/utils/formattedbalances";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import toast from "react-hot-toast";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useJustInTimeSwap } from "@/hooks/useJustInTimeSwap";

export default function Swap() {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { tokens } = useTokens();
  const { balances, balancesLoading } = useTokenBalances();

  // Initialize with null and set after tokens are loaded
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(0.001); // Default fee estimate

  // Sol balance hook
  const { 
    solBalance, 
    fetchSolBalance, 
    needsJustInTimeSwap 
  } = useSolBalance({
    connection,
    publicKey: walletProvider?.publicKey || null
  });

  // Just-in-time swap hook
  const { 
    executeJustInTimeSwap, 
    isLoading: jitSwapLoading 
  } = useJustInTimeSwap({
    connection,
    publicKey: walletProvider?.publicKey || null,
    amount:Number(fromAmount),
    signTransaction: walletProvider?.signTransaction || null,
    fetchUserSolBalance: fetchSolBalance,
 
  });

  useEffect(() => {
    if (tokens && tokens.length >= 2 && !isInitialized) {
      setFromAsset(tokens[0]);
      setToAsset(tokens[1]);
      setIsInitialized(true);
    }
  }, [tokens, isInitialized]);

  const handleFromAssetChange = (token) => {
    if (token) {
      setFromAsset(token);
      setFromAmount("");
      setToAmount("");
    }
  };

  const handleToAssetChange = (token) => {
    if (token) {
      setToAsset(token);
      setFromAmount("");
      setToAmount("");
    }
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFromAmount(value);
    }
  };

  const debounceQuoteCall = useCallback(debounce(getQuote, 500), [
    fromAsset,
    toAsset,
  ]);

  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0) {
      debounceQuoteCall(Number(fromAmount));
    } else {
      setToAmount("");
    }
  }, [fromAmount, debounceQuoteCall]);

  // Function to estimate the transaction fee
  async function getEstimatedSwapFee(quote) {
    if (!quote || !connection || !walletProvider?.publicKey) {
      return 0.001; // Default fallback
    }

    try {
      const { swapTransaction, priorityFee, otherFees } = await fetch(
        "https://quote-api.jup.ag/v6/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse: quote,
            userPublicKey: walletProvider.publicKey.toString(),
            wrapAndUnwrapSol: true,
            computeUnitPriceMicroLamports: 100000,
          }),
        }
      ).then((res) => res.json());

      // Calculate total fee
      let totalFeeInSol = 0;
      
      // Base network fee
      const networkFee = 0.000005; 
      
      // Add priority fee if provided
      if (priorityFee) {
        totalFeeInSol += Number(priorityFee) / 10**9;
      }
      
      // Add other fees if provided
      if (otherFees && otherFees.signatureFee) {
        totalFeeInSol += Number(otherFees.signatureFee) / 10**9;
      }
      
      // Include network fee
      totalFeeInSol += networkFee;
      
      // Add buffer (20%)
      totalFeeInSol *= 1.2;
      
      return Math.max(totalFeeInSol, 0.001); // Minimum fee of 0.001 SOL
    } catch (error) {
      console.error("Error estimating swap fee:", error);
      return 0.001; // Default fallback
    }
  }

  async function getQuote(currentAmount: number) {
    if (!currentAmount || !fromAsset || !toAsset) {
      return;
    }

    try {
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          fromAsset.address
        }&outputMint=${toAsset.address}&amount=${
          currentAmount * Math.pow(10, fromAsset.decimals)
        }&slippage=0.5`
      );
      const quote = await response.json();

      if (quote && quote.outAmount) {
        const outAmountNumber =
          Number(quote.outAmount) / Math.pow(10, toAsset.decimals);
        setToAmount(outAmountNumber.toString());
        setQuoteResponse(quote);
        
        // Update fee estimate
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

  const handleSwapDirection = () => {
    const tempToken = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempToken);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  async function signAndSendTransaction() {
    if (!walletProvider || !connection || !quoteResponse) {
      console.error("Missing required dependencies for swap");
      toast.error("Missing required dependencies for swap");
      return;
    }

    try {
      setSwapping(true);
      
      // Check if user needs just-in-time swap for SOL
      const needsJit = needsJustInTimeSwap(estimatedFee);
      
      if (needsJit) {
        // toast.loading("You need SOL for transaction fees. Performing just-in-time swap...");
        
        // Execute JIT swap using the fromAsset token
        // We're assuming the from token isn't SOL itself
        if (fromAsset.address === "So11111111111111111111111111111111111111112") { // SOL mint address
          toast.error("Cannot use SOL as the source token for fee coverage");
          setSwapping(false);
          return;
        }
        
        const jitResult = await executeJustInTimeSwap(fromAsset.address, estimatedFee);
        
        if (!jitResult) {
          // toast.error("Failed to acquire SOL for transaction fees");
          setSwapping(false);
          return;
        }
      }

      toast.loading("Preparing swap transaction...");
      
      const { swapTransaction } = await fetch(
        "https://quote-api.jup.ag/v6/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: walletProvider.publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        }
      ).then((res) => res.json());

      toast.loading("Signing transaction...");
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await walletProvider.signTransaction(
        transaction
      );

      toast.loading("Sending transaction...");
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
      
      setSwapping(false);
      console.log(`https://solscan.io/tx/${txid}`);
      toast.success(
        `Swap transaction successful: https://solscan.io/tx/${txid} `
      );
      
      // Update SOL balance after the swap
      fetchSolBalance();
    } catch (error) {
      console.error("Error in swap transaction:", error);
      toast.error("Error in swap transaction");
      setSwapping(false);
    }
  }

  const isSwapDisabled =
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset?.address === fromAsset?.address ||
    swapping ||
    jitSwapLoading;

  // Format fee for display
  const formatFee = (fee) => {
    if (!fee) return "$0.00";
    
    // Convert SOL to approximate USD (you can use a real price feed in production)
    const solPriceInUsd = 20; // Example price, replace with actual price feed
    const feeInUsd = fee * solPriceInUsd;
    
    return `~$${feeInUsd.toFixed(2)}`;
  };

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-3">
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">You pay</label>
            <span className="text-sm text-gray-500">
              {formatBalance({
                token: fromAsset,
                balance: balances[fromAsset?.address],
                isLoading: balancesLoading,
                isWalletConnected: !!walletProvider?.publicKey,
              })}{" "}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleFromValueChange}
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <TokenSearchModal
              onSelect={handleFromAssetChange}
              defaultToken={fromAsset}
            />
          </div>
        </div>

        <div className="relative h-0">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-md"
              onClick={handleSwapDirection}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mt-2">
          <div className="flex justify-between mb-2">
            <label className="text-base text-gray-500">You receive</label>
            <span className="text-base text-gray-500">
              {formatBalance({
                token: toAsset,
                balance: balances[toAsset?.address],
                isLoading: balancesLoading,
                isWalletConnected: !!walletProvider?.publicKey,
              })}{" "}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <TokenSearchModal
              onSelect={handleToAssetChange}
              defaultToken={toAsset}
            />
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Price Impact</span>
            <span className="text-green-600">{"<0.01%"}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Network Fee</span>
            <span>{formatFee(estimatedFee)}</span>
          </div>
          
          {/* Display JIT swap notice if needed */}
          {needsJustInTimeSwap(estimatedFee) && (
            <div className="mt-2 p-2 bg-blue-900/40 rounded-lg text-xs">
              <p>You don't have enough SOL for network fees. A small amount of your tokens will be swapped for SOL automatically.</p>
            </div>
          )}
          
          <br className="my-4" />
          {fromAmount && toAmount && Number(fromAmount) > 0 && (
            <div className="flex justify-between font-medium">
              <span>Rate</span>
              <span>
                1 {fromAsset.name} ={" "}
                {(Number(toAmount) / Number(fromAmount)).toFixed(6)}{" "}
                {toAsset.name}
              </span>
            </div>
          )}
        </div>

        <Button
          className="w-full bg-blue-700 mt-4 px-6 py-6 text-white text-lg hover:text-gray-800 rounded-full"
          size="lg"
          onClick={signAndSendTransaction}
          disabled={isSwapDisabled}
        >
          {swapping || jitSwapLoading ? "Processing..." : needsJustInTimeSwap(estimatedFee) ? "Swap (includes fee coverage)" : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
}