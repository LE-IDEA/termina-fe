"use client";

import BuySellSet from "@/components/details/BuySellSet";
import VolMarkers from "@/components/details/VolMarkers";
import Image from "next/image";
import { Geologica } from "next/font/google";
import FirstCrypto from "@/components/details/FirstCrypto";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Pool } from "@/types/jupTokens";
import { formatNumber } from "@/utils";
import useTokenData from "@/hooks/useTokenData";
import { useEffect, useState } from "react";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const Page = () => {
  const params = useParams();
  const tokenAddress = (params?.tokenAddress as string) || "";
  const { analyticsData, loading, error } = useTokenData(tokenAddress);

  if (loading || !analyticsData) {
    return <div className="p-4">Loading token data...</div>;
  }

  const price = analyticsData?.baseAsset?.usdPrice || 0;
  const mcap = analyticsData?.baseAsset?.mcap || 0;
  const priceChange = analyticsData?.baseAsset?.stats1h?.priceChange || 0;

  return (
    <div className="items-center relative justify-center p-4 ssm:px-8 sm:px-16 md:px-4 mdd:px-8 mddd:px-16 lgg:px-24 ">
      <div className="flex flex-col gap-[24px] mx-auto md:max-w-[730px] mdd:max-w-[750px] lg:max-w-[852px] xl:max-w-[920px] 2xl:max-w-[980px]">
        <div className="flex flex-row h-[36px] justify-between">
          <Image
            src="/prevCarret.svg"
            className="cursor-pointer"
            alt="prev"
            width={36}
            height={36}
            onClick={() => window.history.back()}
          />
          <div className="flex flex-row justify-between h-[36px] p-[6px] rounded-xl bg-[#EBEBEB]">
            <Image src="/glasses.svg" alt="watchout" width={24} height={24} />
            <div className="p-[6px]">
              <h1 className={`${geologica.className} text-center font-normal text-[12px]`}>
                Add to watchlist
              </h1>
            </div>
          </div>
        </div>

        {/* Chart widget omitted for brevity */}

        <div className="flex flex-col gap-[12px] md:flex-row md:justify-between">
          <div className="flex flex-col gap-[12px]">
            <h1 className={`${geologica.className} font-medium text-[20px]`}>
              {analyticsData?.baseAsset?.name}
            </h1>
            <h1 className={`${geologica.className} font-normal text-[16px] opacity-50`}>
              {analyticsData?.baseAsset?.symbol}
            </h1>
          </div>
          <div className="flex flex-row gap-[6px] md:gap-[6px] items-center">
            {analyticsData?.baseAsset.website && (
              <Link
                href={analyticsData.baseAsset.website}
                className="bg-[#EBEBEB] rounded-xl w-10 aspect-square flex justify-center items-center"
              >
                <Image src="/globeFrame.svg" alt="internet" width={16} height={16} className="p-[6px] w-9" />
              </Link>
            )}

            {analyticsData?.baseAsset.twitter && (
              <Link
                href={analyticsData.baseAsset.twitter}
                className="bg-[#EBEBEB] rounded-xl w-10 aspect-square flex justify-center items-center"
              >
                <Image src="/twitterFrame.svg" alt="twitter" width={16} height={16} className="p-[6px] w-9" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-[24px] md:gap-8 items-center mt-8 rounded-[18px]">
          <div className="w-full md:w-fit flex flex-col p-[12px] gap-[24px] bg-[#ebebeb] lg:p-[18px] rounded-[18px]">
            <div className="h-[38px] gap-[4px] flex flex-col">
              <h1 className={`${geologica.className} font-normal text-[24px] lg:text-[32px]`}>
                ${price.toFixed(3)}
              </h1>
              <span className={`${priceChange >= 0 ? "text-green-500" : "text-red-500"} text-sm`}>
                {priceChange.toFixed(3)}%
              </span>
            </div>
            <div className="flex flex-row gap-[18px] md:gap-9">
              <Metric title="MCAP" value={formatNumber(mcap)} />
              <Metric title="SUP" value={formatNumber(analyticsData?.baseAsset?.totalSupply ?? 0)} />
              <Metric title="LIQ" value={formatNumber(analyticsData?.baseAsset?.liquidity ?? 0)} />
            </div>
          </div>
          {/* Other components such as BuySellSet */}
        </div>

        {/* Tags */}
        <div className="flex flex-row h-[48px] p-3 gap-3 bg-[#ebebeb] rounded-[12px]">
          <div className="w-[24px] h-[24px]">Tags:</div>
          {analyticsData?.baseAsset?.tags?.length > 0 && (
            <div className="flex flex-row gap-2 ml-4">
              {analyticsData.baseAsset.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-[12px] font-medium bg-white rounded-lg">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Metric = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-row gap-[3px]">
    <div className="bg-black p-[4px] rounded-[6px]">
      <h1 className="text-white text-[12px] lg:text-[20px]">{title}</h1>
    </div>
    <div className="p-[2px] rounded-[6px]">
      <h1 className="text-[16px] lg:text-[24px]">{value}</h1>
    </div>
  </div>
);

export default Page;
