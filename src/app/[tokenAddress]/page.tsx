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

const page = () => {
  const params = useParams();
  const { analyticsData, loading, error } = useTokenData(
    (params?.tokenAddress as string) || ""
  );

  // State for dynamic price and market cap
  const [dynamicPrice, setDynamicPrice] = useState(0);
  const [dynamicMcap, setDynamicMcap] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceDirection, setPriceDirection] = useState(1); // 1 for up, -1 for down

  // Initialize dynamic values once analyticsData is loaded
  useEffect(() => {
    if (analyticsData?.baseAsset) {
      setDynamicPrice(analyticsData.baseAsset.usdPrice);
      setDynamicMcap(analyticsData.baseAsset.mcap || 0);
      setPriceChange(analyticsData.baseAsset.stats1h?.priceChange || 0);
    }
  }, [analyticsData]);

  // Simulate price fluctuations
  useEffect(() => {
    if (!dynamicPrice) return;

    const interval = setInterval(() => {
      // Random percentage change between -0.5% and +0.5%
      const randomChange = (Math.random() - 0.5) * 0.01;
      
      // Switch direction occasionally
      if (Math.random() > 0.7) {
        setPriceDirection(prev => prev * -1);
      }

      // Calculate new price with slight bias based on direction
      const newPrice = dynamicPrice * (1 + (randomChange * priceDirection));
      setDynamicPrice(newPrice);
      
      // Update market cap proportionally
      const mcapRatio = (analyticsData?.baseAsset?.mcap || 0) / (analyticsData?.baseAsset?.usdPrice || 1);
      setDynamicMcap(newPrice * mcapRatio);
      
      // Update price change percentage
      setPriceChange(prev => {
        const newChange = prev + randomChange * 100 * priceDirection;
        // Limit to a reasonable range
        return Math.max(-10, Math.min(10, newChange));
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [dynamicPrice, analyticsData, priceDirection]);

  console.log(analyticsData);

  return (
    <div className="items-center relative justify-center p-4 ssm:px-8 sm:px-16  md:px-4 mdd:px-8 mddd:px-16 lgg:px-24 ">
      <div className="flex flex-col gap-[24px] mx-auto md:max-w-[730px] mdd:max-w-[750px] lg:max-w-[852px] xl:max-w-[920px] 2xl:max-w-[980px]">
        <div className="flex flex-row h-[36px] justify-between">
          <Image src="/prevCarret.svg" className="cursor-pointer" alt="prev" width={36} height={36}
            onClick={() => window.history.back()}
          />
          <div className="flex flex-row justify-between h-[36px] p-[6px] rounded-xl bg-[#EBEBEB]">
            <Image src="/glasses.svg" alt="watchout" width={24} height={24} />
            <div className="p-[6px]">
              <h1
                className={`${geologica.className} text-center font-normal text-[12px] leading-[12px] tracking-[0%]`}
              >
                Add to watchlist
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          {/* Removed chart div */}
          <div className="flex flex-col gap-[12px] md:flex-row md:justify-between">
            <div className="flex flex-col gap-[12px]">
              <h1
                className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}
              >
                {analyticsData?.baseAsset?.name}
              </h1>
              <h1
                className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%] opacity-50`}
              >
                {analyticsData?.baseAsset?.symbol}
              </h1>
            </div>
            <div className="flex flex-row gap-[6px] md:gap-[6px] justify-between items-center">
              {analyticsData?.baseAsset.website && (
                <Link
                  href={`${analyticsData.baseAsset.website}`}
                  className="bg-[#EBEBEB] rounded-xl w-10 aspect-square flex justify-center items-center"
                >
                  <Image
                    src="/globeFrame.svg"
                    alt="internet"
                    width={16}
                    height={16}
                    className="p-[6px] w-9"
                  />
                </Link>
              )}

              {analyticsData?.baseAsset.twitter && (
                <Link
                  href={`${analyticsData.baseAsset.twitter}`}
                  className="bg-[#EBEBEB] rounded-xl w-10 aspect-square flex justify-center items-center"
                >
                  <Image
                    src="/twitterFrame.svg"
                    alt="twitter"
                    width={16}
                    height={16}
                    className="p-[6px] w-9"
                  />
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-[24px] md:gap-8 items-center mt-8 rounded-[18px]">
            <div className="w-full md:w-fit flex flex-col p-[12px] gap-[24px] bg-[#ebebeb] lg:p-[18px] rounded-[18px]">
              <div className=" h-[38px] gap-[4px] flex flex-col">
                <h1
                  className={`${geologica.className} font-normal text-[24px] leading-[24px] lg:leading-[1] lg:text-[32px] tracking-[0%] transition-all duration-500`}
                >
                  ${dynamicPrice.toFixed(3)}
                </h1>
                <span
                  className={`${
                    priceChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } text-sm transition-all duration-500`}
                >
                  {priceChange.toFixed(3)}%
                </span>
              </div>
              <div className="flex flex-row gap-[18px] md:gap-9">
                <div className="flex flex-row gap-[3px]">
                  <div className=" bg-black p-1 rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}
                    >
                      MCAP
                    </h1>
                  </div>
                  <div className=" p-[2px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%] transition-all duration-500`}
                    >
                      {formatNumber(dynamicMcap)}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row gap-[3px]">
                  <div className=" bg-black p-[4px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}
                    >
                      SUP
                    </h1>
                  </div>
                  <div className=" p-[2px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}
                    >
                      {formatNumber(analyticsData?.baseAsset?.totalSupply ?? 0)}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row gap-[3px]">
                  <div className=" bg-black p-[4px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}
                    >
                      LIQ
                    </h1>
                  </div>
                  <div className=" p-[2px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}
                    >
                      {formatNumber(analyticsData?.baseAsset?.liquidity ?? 0)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <BuySellSet analyticsData={analyticsData as Pool}/>
            {/* <Swap/> */}
          </div>
          <VolMarkers analyticsData={analyticsData as Pool} />

          <FirstCrypto analyticsData={analyticsData as Pool} />

          <div className="flex flex-row h-[48px] p-3 gap-3 bg-[#ebebeb] rounded-[12px]">
            <div className="w-[24px] h-[24px] gap-2.5">
              Tags:
            </div>

            {analyticsData?.baseAsset?.tags &&
              analyticsData.baseAsset.tags.length > 0 && (
                <div className="flex flex-row gap-2 ml-4">
                  {analyticsData.baseAsset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-[12px] font-medium bg-white rounded-lg"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;