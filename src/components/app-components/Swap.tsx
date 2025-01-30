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
import { ArrowUpDown, Settings2Icon } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useTokens from "@/hooks/useTokens";
import { debounce } from "@/utils";
import Image from "next/image";
import TokenSearchModal from "./TokenModal";

export default function Swap() {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { tokens, loading, error } = useTokens();
  const [fromAsset, setFromAsset] = useState(tokens[0]);
  const [toAsset, setToAsset] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState(null);

  const assets = [
    {
      name: "SOL",
      mint: "So11111111111111111111111111111111111111112",
      decimals: 9,
    },
    {
      name: "USDC",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
    },
    {
      name: "BONK",
      mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      decimals: 5,
    },
    {
      name: "WIF",
      mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      decimals: 6,
    },
  ];

  useEffect(() => {
    if (tokens.length > 0) {
      setFromAsset(tokens[0]);
      setToAsset(tokens[1]);
    }
  }, [tokens]);

  const handleFromAssetChange = (value: string) => {
    const selectedAsset = tokens.find((token) => token.symbol === value);
    if (selectedAsset) {
      setFromAsset(selectedAsset);
    }
  };

  const handleToAssetChange = (value: string) => {
    const selectedAsset = tokens.find((token) => token.symbol === value);
    if (selectedAsset) {
      setToAsset(selectedAsset);
    }
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFromAmount(Number(event.target.value));
  };

  const debounceQuoteCall = useCallback(debounce(getQuote, 500), []);

  useEffect(() => {
    debounceQuoteCall(fromAmount);
  }, [fromAmount, debounceQuoteCall]);

  async function getQuote(currentAmount: number) {
    if (isNaN(currentAmount) || !fromAsset || !toAsset) {
      console.error(
        "Invalid fromAmount value or assets not set:",
        currentAmount
      );
      return;
    }

    const quote = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          fromAsset.address
        }&outputMint=${toAsset.address}&amount=${
          currentAmount * Math.pow(10, fromAsset.decimals)
        }&slippage=0.5`
      )
    ).json();

    if (quote && quote.outAmount) {
      const outAmountNumber =
        Number(quote.outAmount) / Math.pow(10, toAsset.decimals);
      setToAmount(outAmountNumber);
    }

    setQuoteResponse(quote);
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
      console.error(
        "Wallet is not connected or does not support signing transactions"
      );
      return;
    }

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: walletProvider.publicKey?.toString(),
          wrapAndUnwrapSol: true,
          // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
          // feeAccount: "fee_account_public_key"
        }),
      })
    ).json();

    try {
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

      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error("Error signing or sending the transaction:", error);
    }
  }

  if (!fromAsset || !toAsset) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Swap</h2>
          {/* <TokenSearchModal/> */}
          <Button variant="ghost" size="icon">
            <Settings2Icon className="h-5 w-5" />
          </Button>
        </div>

        {/* Input token */}
        <div className="rounded-2xl bg-gray-100 p-4 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">You pay</label>
            <span className="text-sm text-gray-500">
              Balance: 0.0 {fromAsset.name}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleFromValueChange}
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <Select
              value={fromAsset.symbol}
              onValueChange={handleFromAssetChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token?.address} value={token?.symbol}>
                    <div className="flex items-center gap-2">
                      <img
                        src={token?.logoURI}
                        alt={token.name}
                        className="w-5 h-5 rounded-full"
                      />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap direction button */}
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

        {/* Output token */}
        <div className="rounded-2xl bg-gray-100 p-4 mt-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">You receive</label>
            <span className="text-sm text-gray-500">
              Balance: 0.0 {toAsset.name}
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
            <Select value={toAsset.symbol} onValueChange={handleToAssetChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token?.address} value={token?.symbol}>
                    <div className="flex items-center gap-2">
                    <img
                          src={token?.logoURI}
                          alt={token.name}
                          className="w-5 h-5 rounded-full"
                        />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap details */}
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
          <div className="flex justify-between font-medium">
            <span>Rate</span>
            <span>
              1 {fromAsset.name} = {(toAmount / fromAmount).toFixed(2)}{" "}
              {toAsset.name}
            </span>
          </div>
        </div>

        {/* Swap button */}
        <Button
          className="w-full bg-zinc-700 mt-4 px-6 py-3 rounded-lg"
          size="lg"
          onClick={signAndSendTransaction}
          disabled={toAsset.address === fromAsset.address}
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}
