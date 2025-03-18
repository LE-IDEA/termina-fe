"use client";

import { useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from "@reown/appkit-adapter-solana/react";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "../ui/input";
import useTokens from "@/hooks/useTokens";
import TokenSearchModal from "./TokenModal";
import { formatBalance } from "@/utils/formattedbalances";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import toast from "react-hot-toast";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useSwap } from "@/hooks/useSwap";

export default function Swap() {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { tokens } = useTokens();
  const { balances, balancesLoading } = useTokenBalances();

  // Local state for token selection and amounts
  const [fromAsset, setFromAsset] = useState<any>(null);
  const [toAsset, setToAsset] = useState<any>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Sol balance hook to update balance post-swap
  const { fetchSolBalance } = useSolBalance({
    connection,
    publicKey: walletProvider?.publicKey || null,
  });

  // Use the useSwap hook
  const { 
    quoteResponse, 
    estimatedFee, 
    swapping, 
    toAmount, 
    getQuote, 
    debounceQuoteCall, 
    signAndSendTransaction 
  } = useSwap({
    connection,
    walletProvider
  });

  // Initialize tokens when available
  useEffect(() => {
    if (tokens && tokens.length >= 2 && !isInitialized) {
      setFromAsset(tokens[0]);
      setToAsset(tokens[1]);
      setIsInitialized(true);
    }
  }, [tokens, isInitialized]);

  const handleFromAssetChange = (token: any) => {
    if (token) {
      setFromAsset(token);
      setFromAmount("");
    }
  };

  const handleToAssetChange = (token: any) => {
    if (token) {
      setToAsset(token);
      setFromAmount("");
    }
  };

  const handleFromValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFromAmount(value);
    }
  };

  // Trigger quote fetch when amount changes
  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0 && fromAsset && toAsset) {
      debounceQuoteCall(Number(fromAmount), fromAsset, toAsset);
    }
  }, [fromAmount, fromAsset, toAsset, debounceQuoteCall]);

  // Swap asset direction (switch "from" and "to" tokens)
  const handleSwapDirection = () => {
    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    setFromAmount(toAmount || "");
  };

  // Execute swap using the signAndSendTransaction method from useSwap
  async function handleSwap() {
    if (!walletProvider || !connection || !quoteResponse) {
      toast.error("Missing required dependencies for swap");
      return;
    }
    
    try {
      const txid = await signAndSendTransaction();
      if (txid) {
        fetchSolBalance(); // Update SOL balance post-swap
      }
    } catch (error) {
      // Error is already handled inside signAndSendTransaction
      console.error("Swap execution error:", error);
    }
  }

  const isSwapDisabled =
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset?.address === fromAsset?.address ||
    swapping;

  // Simple fee formatter (assuming a fixed SOL/USD price for demo purposes)
  const formatFee = (fee: number) => {
    if (!fee) return "$0.00";
    const solPriceInUsd = 20; // Replace with live feed in production
    return `~$${(fee * solPriceInUsd).toFixed(2)}`;
  };

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-3">
        {/* From Token Section */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">You pay</label>
            <span className="text-sm text-gray-500">
              {formatBalance({
                token: fromAsset,
                balance: balances[fromAsset?.address],
                isLoading: balancesLoading,
                isWalletConnected: !!walletProvider?.publicKey,
              })}
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
            <TokenSearchModal onSelect={handleFromAssetChange} defaultToken={fromAsset} />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="relative h-0">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Button variant="secondary" size="icon" className="rounded-full shadow-md" onClick={handleSwapDirection}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* To Token Section */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mt-2">
          <div className="flex justify-between mb-2">
            <label className="text-base text-gray-500">You receive</label>
            <span className="text-base text-gray-500">
              {formatBalance({
                token: toAsset,
                balance: balances[toAsset?.address],
                isLoading: balancesLoading,
                isWalletConnected: !!walletProvider?.publicKey,
              })}
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
            <TokenSearchModal onSelect={handleToAssetChange} defaultToken={toAsset} />
          </div>
        </div>

        {/* Swap Info */}
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Price Impact</span>
            <span className="text-green-600">{"<0.01%"}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Network Fee</span>
            <span>{formatFee(estimatedFee)}</span>
          </div>
          <br className="my-4" />
          {fromAmount && toAmount && Number(fromAmount) > 0 && (
            <div className="flex justify-between font-medium">
              <span>Rate</span>
              <span>
                1 {fromAsset.name} = {(Number(toAmount) / Number(fromAmount)).toFixed(6)} {toAsset.name}
              </span>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <Button
          className="w-full bg-blue-700 mt-4 px-6 py-6 text-white text-lg hover:text-gray-800 rounded-full"
          size="lg"
          onClick={handleSwap}
          disabled={isSwapDisabled}
        >
          {swapping ? "Processing..." : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
}