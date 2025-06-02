"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Geologica, Instrument_Serif } from "next/font/google";
import { formatNumber } from "@/utils";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

interface Pool {
  id: string;
  baseAsset: {
    id: string;
    name: string;
    symbol: string;
    mcap: number;
    usdPrice: number;
    icon?: string;
    stats24h?: {
      priceChange: number;
    };
  };
}

export default function HotRecent() {
  const [trendingTokens, setTrendingTokens] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic states for simulated price and pnl changes
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, number>>({});
  const [dynamicChanges, setDynamicChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("https://datapi.jup.ag/v1/pools/toptrending/5m");
        const data = await response.json();

        // Take the first 20 items
        const fetchedTokens: Pool[] = data.pools.slice(0, 20);
        setTrendingTokens(fetchedTokens);

        // Initialize dynamic price & change maps
        const initialPrices: Record<string, number> = {};
        const initialChanges: Record<string, number> = {};

        fetchedTokens.forEach((token) => {
          initialPrices[token.id] = token.baseAsset.usdPrice;
          initialChanges[token.id] = token.baseAsset.stats24h?.priceChange ?? 0;
        });

        setDynamicPrices(initialPrices);
        setDynamicChanges(initialChanges);
      } catch (err) {
        console.error("Failed to fetch trending tokens:", err);
        setError("Failed to fetch trending tokens.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, []);

  // Simulate small random price/PnL fluctuations every few seconds
  useEffect(() => {
    if (isLoading || trendingTokens.length === 0) return;

    const interval = setInterval(() => {
      setDynamicPrices((prev) => {
        const newPrices = { ...prev };
        trendingTokens.forEach((token) => {
          // Random ±0.2% change
          const baseChange = (Math.random() - 0.5) * 0.004;
          newPrices[token.id] = newPrices[token.id] * (1 + baseChange);
        });
        return newPrices;
      });

      setDynamicChanges((prev) => {
        const newChanges = { ...prev };
        trendingTokens.forEach((token) => {
          // Random ±0.15% change to the displayed PnL%
          const pnlChange = (Math.random() - 0.5) * 0.15;
          const updated = (prev[token.id] ?? token.baseAsset.stats24h?.priceChange ?? 0) + pnlChange;
          newChanges[token.id] = Math.max(-20, Math.min(20, updated));
        });
        return newChanges;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading, trendingTokens]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between px-2">
        <div className="flex items-center gap-1">
          <h2 className={`${instrumentSerif.className} text-lg font-semibold`}>Recent</h2>
          <Image src="/Clock.svg" alt="Recent" width={16} height={16} />
        </div>
        <Link href="/activity/spot">
          <span className={`${geologica.className} text-xs text-gray-500 hover:opacity-75 cursor-pointer`}>
            See more
          </span>
        </Link>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Token Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {trendingTokens.map((token) => {
            const base = token.baseAsset;
            const price = dynamicPrices[token.id]?.toFixed(4) ?? base.usdPrice.toFixed(4);
            const change = (dynamicChanges[token.id] ?? base.stats24h?.priceChange ?? 0).toFixed(2);
            const changePositive = Number(change) >= 0;

            return (
              <Link key={token.id} href={`/${base.id}`} className="block">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Icon spans full width */}
                  <div className="bg-gray-900 h-36 w-full flex items-center justify-center">
                    {base.icon ? (
                      <img
                        src={base.icon}
                        alt={base.symbol}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-white text-xl">No Image</div>
                    )}
                  </div>

                  {/* Below: Name + MCap on left; Price + PnL on right */}
                  <div className="flex justify-between items-start p-4">
                    <div className="flex flex-col">
                      <span className={`${geologica.className} text-base font-medium truncate`}>
                        {base.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        MCAP&nbsp;${formatNumber(base.mcap)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`${geologica.className} text-base font-medium`}>
                        ${price}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          changePositive ? "text-green-500" : "text-red-600"
                        }`}
                      >
                        {changePositive ? "+" : ""}
                        {change}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
