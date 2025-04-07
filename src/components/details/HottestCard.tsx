"use client";

import { Geologica, Instrument_Serif } from "next/font/google";
import { useState, useEffect } from "react";
import { Pool } from "@/types/jupTokens";
import Link from "next/link";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HottestCard = () => {
  const [tokens, setTokens] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track dynamic prices
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, number>>({});
  const [dynamicChanges, setDynamicChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://datapi.jup.ag/v1/pools/popular/1h"
        );
        const data = await response.json();
        const fetchedTokens = data.pools.slice(0, 5);
        
        setTokens(fetchedTokens);
        
        // Initialize dynamic prices
        const initialPrices: Record<string, number> = {};
        const initialChanges: Record<string, number> = {};
        
        fetchedTokens.forEach((token: Pool) => {
          initialPrices[token.id] = token.baseAsset.usdPrice;
          initialChanges[token.id] = token.baseAsset.stats1h?.priceChange || 0;
        });
        
        setDynamicPrices(initialPrices);
        setDynamicChanges(initialChanges);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);
  
  // Simulate price fluctuations similar to [tokenAddress]/page.tsx
  useEffect(() => {
    if (isLoading || tokens.length === 0) return;
    
    const interval = setInterval(() => {
      setDynamicPrices(prev => {
        const newPrices = { ...prev };
        
        tokens.forEach(token => {
          // Random percentage change between -0.3% and +0.3%
          const isPositive = token.baseAsset.stats1h?.priceChange >= 0;
          const randomChange = (Math.random() - (isPositive ? 0.4 : 0.6)) * 0.006;
          
          if (newPrices[token.id]) {
            // Calculate new price
            newPrices[token.id] = newPrices[token.id] * (1 + randomChange);
          }
        });
        
        return newPrices;
      });
      
      setDynamicChanges(prev => {
        const newChanges = { ...prev };
        
        tokens.forEach(token => {
          // Random change to percentage
          const isPositive = token.baseAsset.stats1h?.priceChange >= 0;
          const randomChange = (Math.random() - (isPositive ? 0.4 : 0.6)) * 0.2;
          
          if (newChanges[token.id] !== undefined) {
            // Update change percentage
            newChanges[token.id] = Math.max(-30, Math.min(30, newChanges[token.id] + randomChange));
          }
        });
        
        return newChanges;
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLoading, tokens]);

  return (
    <div className="overflow-hidden flex flex-col gap-2 cursor-pointer">
      <div className="flex flex-row items-center">
        <h1
          className={`font-normal text-[15px] leading-[15px] tracking-[0%] text-center ${instrumentSerif.className}`}
        >
          Hottest Daily
        </h1>
        <img src="/bolt.svg" alt="hot" width={12} height={12} />
      </div>

      <div className="flex flex-row gap-2 overflow-x-auto hide-scrollbar rounded-xl">
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
          </div>
        ) : (
          tokens.map((token, index) => (
            <Link key={token.id} href={`/${token.baseAsset.id}`}>
              <div
                className="gap-2 rounded-[12px] bg-[#ebebeb] flex flex-col hide-overflow md:justify-between hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col rounded-[12px] gap-2 w-[200px]">
                  <div className="w-full p-2 bg-zinc-800 h-[140px]">
                    {token.baseAsset.icon && (
                      <img
                        src={token.baseAsset.icon}
                        alt={token.baseAsset.symbol}
                        width={170}
                        height={95.38}
                        className="rounded w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <h1
                      className={`${geologica.className} truncate font-medium text-[16px] leading-[20px] tracking-[0%]`}
                    >
                      {token.baseAsset.name}
                    </h1>
                    <span className="text-[12px]">
                      {token?.baseAsset?.symbol}
                    </span>
                    <div className="gap-2 flex flex-row flex-wrap justify-between text-[12px]">
                      <span className="font-medium transition-all duration-500">
                        ${dynamicPrices[token.id]?.toFixed(4) || token.baseAsset?.usdPrice?.toFixed(4)}
                      </span>
                      <span
                        className={`
                        ${
                          (dynamicChanges[token.id] || token.baseAsset.stats1h?.priceChange) >= 0
                            ? "text-[#47B105]"
                            : "text-red-700"
                        }
                        font-bold transition-all duration-500"`}
                      >
                        {(dynamicChanges[token.id] || token.baseAsset.stats1h?.priceChange)?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default HottestCard;
