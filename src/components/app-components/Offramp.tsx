"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { useAppKitProvider } from "@reown/appkit/react";
import { type Provider } from "@reown/appkit-adapter-solana/react";
import toast from "react-hot-toast";

export default function OffRampCard() {
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState("");

  // The connected wallet address (public key)
  const address = walletProvider?.publicKey;

  // Fetch the exchange rate for converting USDC to NGN (offramp rate)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/exchangeRate");
        if (!res.ok) {
          throw new Error("Failed to fetch exchange rate");
        }
        const data = await res.json();
        // For offramp, use the rate_in_ngn from the 'offramp' object.
        setExchangeRate(data.data.offramp.rate_in_ngn);
      } catch (err) {
        console.error("Error fetching exchange rate", err);
      }
    };

    fetchRate();
  }, []);

  // Calculate the NGN amount received for the given USDC amount.
  // For each USDC, the user receives 'exchangeRate' NGN.
  const convertedAmount = exchangeRate
    ? (Number(amount) * exchangeRate).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Do not proceed if amount is below the minimum limit
    if (Number(amount) < 5) {
      setError("Your transaction minimum limit is $5");
      return;
    }
    setIsProcessing(true);
    setError("");
    setResponseData(null);

    try {
      const res = await fetch("/api/scalex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), address, email, type: "offramp" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        toast.success("Transaction initiated successfully!");
        console.log(data.data.link);
        window.open(data.data.link, "_blank");
      }
    } catch (err) {
      setError("Failed to initiate transaction");
      toast.error("Failed to initiate transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if amount is below the minimum required 5 USDC.
  const isBelowMinimum = amount && Number(amount) < 5;

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-3">
        {/* USDC Section: You pay */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mb-8">
          <div className="flex justify-between mb-2">
            <label className="text-base text-gray-500">You pay</label>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <div className="w-[150px] px-3 py-2 flex gap-5 items-center border bg-zinc-700 rounded-full hover:bg-zinc-600 text-white">
              <span className="flex items-center justify-center w-6 h-6 bg-color0 rounded-full">
                <Image
                  src="https://res.cloudinary.com/https-scalex-africa/image/upload/v1688934488/DigitalAssets/usd-coin-usdc-logo_pjvbgs.svg"
                  alt="USDC logo"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </span>
              <span className="text-sm text-center">USDC</span>
            </div>
          </div>
        </div>

        {/* NGN Section: You receive */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mt-2 mb-8">
          <div className="flex justify-between mb-2">
            <label className="text-base text-gray-500">You receive</label>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.0"
              value={convertedAmount}
              readOnly
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <div className="w-[150px] px-3 py-2 flex gap-5 items-center border bg-zinc-700 rounded-full hover:bg-zinc-600 text-white">
              <span className="flex items-center justify-center w-6 h-6 bg-color0 rounded-full">
                <Image
                  src="https://res.cloudinary.com/https-scalex-africa/image/upload/v1684323731/DigitalAssets/ngn_cttub1.svg"
                  alt="NGN logo"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </span>
              <span className="text-sm text-center">NGN</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent rounded-full my-8 py-6 border-gray-700"
            />
          </div>
          <div>
            <p className="text-sm text-gray-300 m-2">
              Exchange Rate: 1 USDC ={" "}
              {exchangeRate ? exchangeRate.toFixed(2) : "--"} NGN
            </p>
          </div>
          {isBelowMinimum && (
            <p className="text-sm text-red-500">
              Your transaction minimum limit is $5
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-700 mt-4 px-6 py-6 text-white text-lg hover:bg-blue-600 rounded-full"
            disabled={isProcessing || !amount || Number(amount) < 5}
          >
            {isProcessing ? "Processing..." : "Initiate Transaction"}
          </Button>
        </form>

        {responseData && (
          <div className="mt-4 p-2 bg-green-700 rounded">
            <p className="text-sm text-white">
              Transaction initiated successfully!
            </p>
            <pre className="text-xs text-white">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-700 rounded">
            <p className="text-sm text-white">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
