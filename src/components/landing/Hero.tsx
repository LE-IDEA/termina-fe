"use client";

import { ArrowDownUp, ArrowRight, ChevronDown, Wallet } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Swap from "../app-components/Swap";
import OnrampModal from "../app-components/Onramp";
import OfframpModal from "../app-components/Offramp";

export default function CryptoDashboard() {
  return (
    <div className="w-11/12 md:max-w-6xl mx-auto bg-background my-4 p-4 md:p-6 md:my-6 lg:my-8">
      <div className="">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Balance
            </CardTitle>
            <CardDescription>Total value across all tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,345.67</div>
            <div className="mt-4 w-3/4 flex flex-col sm:flex-row gap-4">
              <OnrampModal /> <OfframpModal />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-3">
            <Swap />
          </div>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Trending Tokens</CardTitle>
              <CardDescription>Popular tokens in the last 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Solana",
                    symbol: "SOL",
                    price: "$102.45",
                    change: "+12.3%",
                    positive: true,
                  },
                  {
                    name: "Cardano",
                    symbol: "ADA",
                    price: "$0.89",
                    change: "+5.6%",
                    positive: true,
                  },
                  {
                    name: "Polkadot",
                    symbol: "DOT",
                    price: "$7.23",
                    change: "-2.1%",
                    positive: false,
                  },
                  {
                    name: "Avalanche",
                    symbol: "AVAX",
                    price: "$35.78",
                    change: "+8.9%",
                    positive: true,
                  },
                ].map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.price}</div>
                      <div
                        className={
                          token.positive ? "text-emerald-500" : "text-red-500"
                        }
                      >
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
