import { useEffect, useState } from "react";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import useFungibleTokens from "@/hooks/useFungibleTokes";
import { useAppKitAccount } from "@reown/appkit/react";
import { formatNumber } from "@/utils";
import Link from "next/link";

const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HotList = () => {
    const { address } = useAppKitAccount();
  const { fungibleTokens, loading, error } = useFungibleTokens(address || "");
  console.log(fungibleTokens);
  

  return (
    <div className="flex flex-col gap-[6px] rounded-xl">
      {/* Header */}
      <div className="flex flex-row justify-between pr-[6px] pl-[6px]">
        <div className="flex flex-row items-center gap-1">
          <h1 className={`${instrumentSerif.className} text-[16px] font-semibold`}>My tokens</h1>
          <Image src="/WatchSwap.svg" alt="watchlist" width={12} height={12} />
        </div>
        <h1 className={`${geologica.className} font-normal text-[10px] opacity-50 my-auto`}>Edit</h1>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p>Loading tokens...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display User's Tokens */}
      {!loading &&
        !error &&
        fungibleTokens.slice(0, 5).map((token) => (
          <Link key={token.id} href={`/${token.id}`}>
          <div className="p-[12px] rounded-[18px] bg-[#ebebeb] flex flex-row justify-between">
            {/* Left Section: Token Icon & Details */}
            <div className="flex flex-row gap-[10px]">
              <img src={token.content?.links?.image} alt={token.content?.metadata.name} width={32} height={32} className="w-[32px] h-[32px]" />
              <div className="flex flex-col max-w-[162px]">
                <h1 className={`${geologica.className} font-medium text-[16px] truncate`}>
                  {token.content?.metadata.name || "Unknown Token"}
                </h1>
                <h1 className={`${geologica.className} font-normal text-[10px] opacity-50 uppercase`}>
                  {token.content?.metadata.symbol || "N/A"}
                </h1>
              </div>
            </div>

            {/* Right Section: Market Cap, Price & Change */}
            <div className="flex flex-col justify-between text-right">
              <div className="flex flex-row gap-[6px] items-center justify-end">
                <Image src="/MCAP.svg" alt="Market Cap" width={32} height={16} />
                <h1 className={`${geologica.className} font-medium text-[16px]`}>
                  ${token.token_info?.price_info?.total_price.toFixed(3)}
                </h1>
              </div>
              <div className="flex flex-row gap-[12px] justify-between">
                <h1 className={`${geologica.className} font-normal text-[10px] opacity-50`}>
                  {token.token_info?.price_info?.price_per_token.toFixed(3)} SOL
                </h1>
                {/* <h1 className={`${geologica.className} font-normal text-[10px] ${token.token_info?.price_info?.price_change_24h >= 0 ? "text-green-500" : "text-[#FF0004]"}`}>
                  {token.token_info?.price_info?.price_change_24h?.toFixed(2)}%
                </h1> */}
              </div>
            </div>
          </div>
          </Link>
        ))}
    </div>
  );
};

export default HotList;
