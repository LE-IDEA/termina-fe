"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import { formatNumber } from "@/utils";
import Link from "next/link";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HotRecent = () => {
  const [trendingTokens, setTrendingTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic states for price simulation
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, number>>({});
  const [dynamicChanges, setDynamicChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://datapi.jup.ag/v1/pools/toptrending/5m"
        );
        const data = await response.json();
        const fetchedTokens = data.pools.slice(0, 5);
        setTrendingTokens(fetchedTokens);
        
        // Initialize dynamic prices and changes
        const initialPrices: Record<string, number> = {};
        const initialChanges: Record<string, number> = {};
        
        fetchedTokens.forEach((token: any) => {
          initialPrices[token.id] = token.baseAsset.usdPrice;
          initialChanges[token.id] = token.baseAsset.stats24h?.priceChange || 0;
        });
        
        setDynamicPrices(initialPrices);
        setDynamicChanges(initialChanges);
      } catch (err) {
        setError("Failed to fetch trending tokens.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);
  
  // Simulate price fluctuations
  useEffect(() => {
    if (isLoading || trendingTokens.length === 0) return;
    
    const interval = setInterval(() => {
      setDynamicPrices(prev => {
        const newPrices = { ...prev };
        
        trendingTokens.forEach(token => {
          // Random percentage change between -0.2% and +0.2%
          const isPositive = token.baseAsset.stats24h?.priceChange >= 0;
          const randomChange = (Math.random() - (isPositive ? 0.4 : 0.6)) * 0.004;
          
          if (newPrices[token.id]) {
            // Calculate new price
            newPrices[token.id] = newPrices[token.id] * (1 + randomChange);
          }
        });
        
        return newPrices;
      });
      
      setDynamicChanges(prev => {
        const newChanges = { ...prev };
        
        trendingTokens.forEach(token => {
          // Random change to percentage
          const isPositive = token.baseAsset.stats24h?.priceChange >= 0;
          const randomChange = (Math.random() - (isPositive ? 0.4 : 0.6)) * 0.15;
          
          if (newChanges[token.id] !== undefined) {
            // Update change percentage
            newChanges[token.id] = Math.max(-20, Math.min(20, newChanges[token.id] + randomChange));
          }
        });
        
        return newChanges;
      });
    }, 3500);
    
    return () => clearInterval(interval);
  }, [isLoading, trendingTokens]);

  return (
    <div className="flex flex-col gap-[6px]">
      {/* Header */}
      <div className="flex flex-row justify-between pr-[6px] pl-[6px]">
        <div className="flex flex-row items-center gap-1">
          <h1
            className={`${instrumentSerif.className} text-[16px] font-semibold`}
          >
            Recent
          </h1>
          <Image src="/Clock.svg" alt="Recent" width={12} height={12} />
        </div>
        <Link href="/activity/spot">
          <h1
            className={`${geologica.className} font-normal text-[10px] opacity-50 my-auto hover:opacity-70 cursor-pointer`}
          >
            See more
          </h1>
        </Link>
      </div>

      {/* Loading & Error Handling */}
      {isLoading && (
        <div className="p-[12px] rounded-[18px] bg-[#ebebeb] flex items-center justify-center h-[120px]">
          <div className="w-6 h-6 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="p-[12px] rounded-[18px] bg-[#ebebeb] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Trending Tokens */}
      {!isLoading &&
        !error &&
        trendingTokens.map((token) => (
          <Link href={`/${token.baseAsset.id}`} key={token.id}>
            <div className="p-[12px] rounded-[18px] bg-[#ebebeb] flex flex-row justify-between hover:shadow-md transition-all duration-300">
              <div className="flex flex-row gap-[10px]">
                <img
                  src={token.baseAsset?.icon || "/default-token.svg"}
                  alt={token.baseAsset?.name}
                  width={32}
                  height={32}
                  className="w-[32px] h-[32px]"
                />
                <div className="flex flex-col max-w-[162px]">
                  <h1
                    className={`${geologica.className} font-medium text-[16px] truncate`}
                  >
                    {token.baseAsset?.name || "Unknown Token"}
                  </h1>
                  <h1
                    className={`${geologica.className} font-normal text-[10px] opacity-50`}
                  >
                    {token.baseAsset?.id
                      ? token.baseAsset.id.slice(0, 6) + "..."
                      : "Unknown ID"}
                  </h1>
                </div>
              </div>

              {/* Right Section: Market Cap, Price & Change */}
              <div className="flex flex-col justify-between text-right">
                <div className="flex flex-row gap-[6px] items-center justify-end">
                  <Image
                    src="/MCAP.svg"
                    alt="Market Cap"
                    width={32}
                    height={16}
                  />
                  <h1
                    className={`${geologica.className} font-medium text-[16px] transition-all duration-500`}
                  >
                    ${formatNumber(token.baseAsset?.mcap)}
                  </h1>
                </div>
                <div className="flex flex-row gap-[12px] justify-between">
                  <h1
                    className={`${geologica.className} font-normal text-[10px] opacity-50 transition-all duration-500`}
                  >
                    {formatNumber(dynamicPrices[token.id] || token.baseAsset?.usdPrice)} SOL
                  </h1>
                  <h1
                    className={`${
                      geologica.className
                    } font-normal text-[10px] ${
                      (dynamicChanges[token.id] || token.baseAsset?.stats24h?.priceChange) >= 0
                        ? "text-green-500"
                        : "text-[#FF0004]"
                    } transition-all duration-500`}
                  >
                    {(dynamicChanges[token.id] || token.baseAsset?.stats24h?.priceChange)?.toFixed(2)}%
                  </h1>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default HotRecent;
