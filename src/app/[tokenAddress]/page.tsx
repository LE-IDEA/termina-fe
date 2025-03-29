"use client";

import BuySellSet from "@/components/details/BuySellSet";
import VolMarkers from "@/components/details/VolMarkers";
import Image from "next/image";
import { Geologica } from "next/font/google";
import FirstCrypto from "@/components/details/FirstCrypto";
import { useEffect, useRef } from "react";
import useTokenData from "@/hooks/useTokenData";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Pool } from "@/types/jupTokens";
import { formatNumber } from "@/utils";
import Swap from "@/components/app-components/Swap";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const page = () => {
  const params = useParams();
  const { analyticsData, loading, error } = useTokenData(
    (params?.tokenAddress as string) || ""
  );

  console.log(analyticsData);

  const PRICE_CHART_ID = "price-chart-widget-container";

  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadWidget = () => {
      // @ts-ignore
      if (typeof window?.createMyWidget === "function") {
        // @ts-ignore
        window?.createMyWidget(PRICE_CHART_ID, {
          autoSize: true,
          chainId: "solana",
          tokenAddress: `${params?.tokenAddress}`,
          defaultInterval: "1D",
          timeZone:
            Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Etc/UTC",
          theme: "moralis",
          locale: "en",
          backgroundColor: "#071321",
          gridColor: "#0d2035",
          textColor: "#68738D",
          candleUpColor: "#4CE666",
          candleDownColor: "#E64C4C",
          hideLeftToolbar: false,
          hideTopToolbar: false,
          hideBottomToolbar: false,
        });
      } else {
        console.error("createMyWidget function is not defined.");
      }
    };

    if (!document.getElementById("moralis-chart-widget")) {
      const script = document.createElement("script");
      script.id = "moralis-chart-widget";
      script.src = "https://moralis.com/static/embed/chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = loadWidget;
      script.onerror = () => {
        console.error("Failed to load the chart widget script.");
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
    }
  }, []);

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
          {/* dexgraph */}
          <div className="p-[1/1] h-full md:h-[400px] bg-[#EBEBEB] ">
            <div style={{ width: "100%", height: "100%" }}>
              <div
                id={PRICE_CHART_ID}
                ref={containerRef}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
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
              {/* <div className="px-[12px] flex-1 py-[6px] items-start rounded-xl bg-[#EBEBEB] md:my-auto md:py-3 md:w-[345px] lg:w-[395px] xl:">
                <h1
                  className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%] md:text-[16px]`}
                >
                  {analyticsData?.dex}
                </h1>
              </div> */}
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
                  className={`${geologica.className} font-normal text-[24px] leading-[24px] lg:leading-[1] lg:text-[32px] tracking-[0%]`}
                >
                  ${analyticsData?.baseAsset.usdPrice.toFixed(3)}
                </h1>
                <span
                  className={`${
                    (analyticsData?.baseAsset?.stats1h?.priceChange ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } text-sm`}
                >
                  {analyticsData?.baseAsset.stats1h?.priceChange?.toFixed(3)}%
                </span>
              </div>
              <div className="flex flex-row gap-[18px] md:gap-9">
                <div className="flex flex-row gap-[3px]">
                  <div className=" bg-black p-1 rounded-[6px]">
                    {/* text-[20px] font-normal md;leading-[1] uppercase tracking-[0] align-middle */}
                    <h1
                      className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}
                    >
                      MCAP
                    </h1>
                  </div>
                  <div className=" p-[2px] rounded-[6px]">
                    <h1
                      className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}
                    >
                      {formatNumber(analyticsData?.baseAsset?.mcap ?? 0)}
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