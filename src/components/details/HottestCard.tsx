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

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://datapi.jup.ag/v1/pools/popular/1h"
        );
        const data = await response.json();

        setTokens(data.pools.slice(0, 5));
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

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
          <p>Loading...</p>
        ) : (
          tokens.map((token, index) => (
            <Link key={token.id} href={`/${token.baseAsset.id}`}>
            <div
              key={index}
              className=" gap-2 rounded-[12px] bg-[#ebebeb] flex flex-col hide-overflow md:justify-between"
            >
              <div className="flex flex-col  rounded-[12px] gap-2 w-[200px] ">
                <div className="w-full p-2 bg-zinc-800 h-[140px] ">
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
                    <span className="font-medium">
                      ${token.baseAsset?.usdPrice?.toFixed(4)}
                    </span>
                    <span
                      className={`
                      ${
                        token.baseAsset.stats1h.priceChange >= 0
                          ? "text-[#47B105]"
                          : "text-red-700"
                      }
                         font-bold" `}
                    >
                      {token.baseAsset.stats1h?.priceChange?.toFixed(2)}%
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
