import { useState, useEffect, useCallback } from "react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitProvider } from "@reown/appkit/react";
import { VersionedTransaction } from "@solana/web3.js";
import useTokens from "@/hooks/useTokens";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { debounce } from "@/utils";
import toast from "react-hot-toast";

export function useSwap() {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider("solana");
  const { tokens } = useTokens();
  const { balances, balancesLoading } = useTokenBalances();

  // State management
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [swapping, setSwapping] = useState(false);

  // Initialize default tokens
  useEffect(() => {
    if (tokens && tokens.length >= 2 && !isInitialized) {
      setFromAsset(tokens[0]);
      setToAsset(tokens[1]);
      setIsInitialized(true);
    }
  }, [tokens, isInitialized]);

  // Token selection handlers
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

  // Swap token positions
  const handleSwapDirection = () => {
    const tempToken = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempToken);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Input change handler
  const handleFromValueChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFromAmount(value);
    }
  };

  // Quote fetching logic
  async function getQuote(currentAmount) {
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
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote");
      setToAmount("");
      setQuoteResponse(null);
    }
  }

  // Debounce the quote API call
  const debounceQuoteCall = useCallback(debounce(getQuote, 500), [
    fromAsset,
    toAsset,
  ]);

  // Effect to fetch quote when amount changes
  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0) {
      debounceQuoteCall(Number(fromAmount));
    } else {
      setToAmount("");
    }
  }, [fromAmount, debounceQuoteCall]);

  // Transaction execution
  async function executeSwap() {
    if (!walletProvider || !connection || !quoteResponse) {
      console.error("Missing required dependencies for swap");
      toast.error("Missing required dependencies for swap");
      return;
    }

    try {
      setSwapping(true);
      toast.loading("Swapping...");
      
      const { swapTransaction } = await fetch(
        "https://quote-api.jup.ag/v6/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: walletProvider.publicKey?.toString(),
            wrapAndUnwrapSol: true,
          }),
        }
      ).then((res) => res.json());

      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await walletProvider.signTransaction(
        transaction
      );

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
      toast.success(
        `Swap transaction successful: https://solscan.io/tx/${txid}`
      );
      return txid;
    } catch (error) {
      console.error("Error in swap transaction:", error);
      toast.error("Error in swap transaction");
      setSwapping(false);
      return null;
    }
  }

  // Computed values
  const isSwapDisabled =
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset?.address === fromAsset?.address ||
    swapping;

  const swapRate = fromAmount && toAmount && Number(fromAmount) > 0
    ? (Number(toAmount) / Number(fromAmount)).toFixed(6)
    : null;

  return {
    // State
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    swapping,
    balances,
    balancesLoading,
    
    // Handlers
    handleFromAssetChange,
    handleToAssetChange,
    handleFromValueChange,
    handleSwapDirection,
    executeSwap,
    
    // Computed
    isSwapDisabled,
    swapRate,
    hasWallet: !!walletProvider?.publicKey
  };
}