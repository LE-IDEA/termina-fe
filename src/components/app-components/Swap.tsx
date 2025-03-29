"use client";
import { useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import { VersionedTransaction } from "@solana/web3.js";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "../ui/input";
import useTokens from "@/hooks/useTokens";
import { debounce } from "@/utils";
import TokenSearchModal from "./TokenModal";
import { formatBalance } from "@/utils/formattedbalances";

import toast from "react-hot-toast";
import { useTokenBalances } from "@/hooks/useTokenBalances";

interface Token {
  address?: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals?: number;
}

interface QuoteResponse {
  outAmount: string;
}

interface SwapProps {
  initialFromAsset?: Token;
  initialToAsset?: Token;
}

export default function Swap({ initialFromAsset, initialToAsset }: SwapProps) {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { tokens } = useTokens();
  const { balances, balancesLoading } = useTokenBalances();

  const [fromAsset, setFromAsset] = useState<Token | null>(initialFromAsset || null);
  const [toAsset, setToAsset] = useState<Token | null>(initialToAsset || null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    if (tokens && tokens.length >= 2 && !isInitialized) {
      if (!fromAsset) setFromAsset(tokens[0]);
      if (!toAsset) setToAsset(tokens[1]);
      setIsInitialized(true);
    }
  }, [tokens, isInitialized, fromAsset, toAsset]);

  // Update assets if props change
  useEffect(() => {
    if (initialFromAsset) {
      setFromAsset(initialFromAsset);
    }
    if (initialToAsset) {
      setToAsset(initialToAsset);
    }
  }, [initialFromAsset, initialToAsset]);

  const handleFromAssetChange = (token: Token) => {
    if (token) {
      setFromAsset(token);
      setFromAmount("");
      setToAmount("");
    }
  };

  const handleToAssetChange = (token: Token) => {
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

  async function getQuote(currentAmount: number) {
    if (!currentAmount || !fromAsset || !toAsset) {
      return;
    }

    try {
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          fromAsset.address
        }&outputMint=${toAsset.address}&amount=${
          currentAmount * Math.pow(10, fromAsset.decimals || 9)
        }&slippage=0.5`
      );
      const quote = await response.json();

      if (quote && quote.outAmount) {
        const outAmountNumber =
          Number(quote.outAmount) / Math.pow(10, toAsset.decimals || 9);
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
      if (swapping) {
        toast.loading("Swapping...");
      }
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
      console.log(`https://solscan.io/tx/${txid}`);
      toast.success(
        `Swap transaction successful: https://solscan.io/tx/${txid} `
      );
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
    (fromAsset && toAsset && toAsset.address === fromAsset.address) ||
    swapping;

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-3">
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">You pay</label>
            <span className="text-sm text-gray-500">
              {formatBalance({
                token: fromAsset,
                balance: fromAsset && fromAsset.address ? balances[fromAsset.address] : undefined,
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
              className="border-0 bg-transparent text-2xl text-white focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <TokenSearchModal
              onSelect={handleFromAssetChange}
              defaultToken={fromAsset || undefined}
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
                balance: toAsset && toAsset.address ? balances[toAsset.address] : undefined,
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
              className="border-0 bg-transparent text-white text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <TokenSearchModal
              onSelect={handleToAssetChange}
              defaultToken={toAsset || undefined}
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
            <span>~$1.50</span>
          </div>
          <br className="my-4" />
          {fromAmount && toAmount && Number(fromAmount) > 0 && fromAsset && toAsset && (
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
          className="w-full bg-blue-700 mt-4 px-6 py-6 text-white text-lg hover:text-gray-800 hover:text-white rounded-full"
          size="lg"
          onClick={signAndSendTransaction}
          disabled={isSwapDisabled}
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}