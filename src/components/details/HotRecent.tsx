// src/components/details/HotRecent.tsx
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

interface ForestPool {
  id: string;
  baseAsset: {
    id: string;
    name: string;
    symbol: string;
    icon?: string;
    usdPrice: number;
    mcap: number;
    stats24h?: {
      priceChange: number;
    };
  };
}

export default function HotRecent() {
  const [trendingTokens, setTrendingTokens] = useState<ForestPool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For dynamic price / holding simulation
  const [dynamicHoldings, setDynamicHoldings] = useState<Record<string, number>>({});
  const [dynamicChanges, setDynamicChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch("https://datapi.jup.ag/v1/pools/toptrending/5m");
        const data = await res.json();
        // Take top 20
        const fetched: ForestPool[] = data.pools.slice(0, 20);
        setTrendingTokens(fetched);

        // Initialize placeholder values
        const initialHold: Record<string, number> = {};
        const initialChg: Record<string, number> = {};
        fetched.forEach((tk) => {
          initialHold[tk.id] = 0; // replace with actual user balance later
          initialChg[tk.id] = tk.baseAsset.stats24h?.priceChange || 0;
        });
        setDynamicHoldings(initialHold);
        setDynamicChanges(initialChg);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch trending tokens.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTokens();
  }, []);

  // Simulate “holding” changes – replace with real hook in production
  useEffect(() => {
    if (isLoading || trendingTokens.length === 0) return;
    const iv = setInterval(() => {
      setDynamicHoldings((prev) => {
        const next = { ...prev };
        trendingTokens.forEach((tk) => {
          const delta = (Math.random() - 0.5) * 0.1;
          next[tk.id] = Math.max(0, (next[tk.id] || 0) + delta);
        });
        return next;
      });
      setDynamicChanges((prev) => {
        const next = { ...prev };
        trendingTokens.forEach((tk) => {
          const delta = (Math.random() - 0.5) * 0.2;
          next[tk.id] = Math.max(-50, Math.min(50, (next[tk.id] || 0) + delta));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, [isLoading, trendingTokens]);

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h2 className={`text-lg font-semibold ${instrumentSerif.className}`}>
            Recent
          </h2>
          <Image src="/Clock.svg" alt="Recent" width={16} height={16} />
        </div>
        <Link href="/activity/spot">
          <h3
            className={`${geologica.className} text-xs text-gray-500 hover:opacity-70 cursor-pointer`}
          >
            See more
          </h3>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="w-6 h-6 border-t-2 border-b-2 border-black rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        // ← Add `space-y-4` here to guarantee vertical spacing between cards
        <div className="space-y-4">
          {trendingTokens.map((tk) => {
            const holdingAmount = dynamicHoldings[tk.id] || 0;
            const pctChange = 
              dynamicChanges[tk.id] ?? tk.baseAsset.stats24h?.priceChange ?? 0;
            const mcap = tk.baseAsset.mcap || 0;

            return (
              <Link key={tk.id} href={`/${tk.baseAsset.id}`}>
                <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow w-full">
                  {/* 1) Full‐width icon */}
                  <div className="w-full h-32 bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {tk.baseAsset.icon ? (
                      <img
                        src={tk.baseAsset.icon}
                        alt={tk.baseAsset.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-white">No Icon</div>
                    )}
                  </div>

                  {/* 2) Two rows under image */}
                  <div className="p-4 space-y-2">
                    {/* Row 1: Token Name (left) / User holding (right) */}
                    <div className="flex justify-between items-center">
                      <h3 className={`text-base font-medium ${geologica.className}`}>
                        {tk.baseAsset.name}
                      </h3>
                      <p className={`text-base font-semibold ${geologica.className}`}>
                        ${holdingAmount.toFixed(4)}
                      </p>
                    </div>

                    {/* Row 2: Market Cap (left) / 24h % change (right) */}
                    <div className="flex justify-between items-center">
                      <p className={`text-sm text-gray-500 ${geologica.className}`}>
                        MCAP ${formatNumber(mcap)}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          pctChange >= 0 ? "text-green-600" : "text-red-600"
                        } ${geologica.className}`}
                      >
                        {pctChange.toFixed(2)}%
                      </p>
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
