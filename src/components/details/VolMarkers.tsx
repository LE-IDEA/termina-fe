import React from 'react';
import { Geologica } from "next/font/google";
import { Pool } from '@/types/jupTokens';
import { formatNumber } from '@/utils';

const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const VolMarkers = ({ analyticsData }: { analyticsData: Pool }) => {
  if (!analyticsData) return <p>Loading...</p>;

  return (
    <section className="flex flex-col gap-[12px] bg-[#ebebeb] p-[12px] rounded-lg">
      {/* 24h Transaction Volume */}
      <div className="flex flex-row gap-[12px] items-center rounded-lg">
        <div className="h-[51px] p-[12px] bg-white rounded-lg">
          <h1 className={`${geologica.className} text-[10px]`}>24H TXNS</h1>
          <h1 className={`${geologica.className} opacity-50 text-[14px]`}>{formatNumber(analyticsData?.baseAsset?.stats24h?.numBuys + analyticsData?.baseAsset?.stats24h?.numSells)}</h1>
        </div>
        <div className="flex flex-col p-[12px] rounded-lg bg-white h-[51px] flex-1">
          <div className="flex flex-row justify-between text-[10px]">
            <h1 className={`${geologica.className} font-semibold`}>{formatNumber(analyticsData?.baseAsset?.stats24h?.numBuys)} Buys</h1>
            <h1 className={`${geologica.className} font-semibold`}>{formatNumber(analyticsData?.baseAsset?.stats24h?.numSells)} Sells</h1>
          </div>
          <div className="h-[4px] flex flex-row">
            <div className="h-[4px] bg-green-500" style={{ width: `${(analyticsData?.baseAsset?.stats24h?.numBuys / (analyticsData?.baseAsset?.stats24h?.numBuys + analyticsData?.baseAsset?.stats24h?.numSells)) * 100}%` }}></div>
            <div className="h-[4px] bg-red-500" style={{ width: `${(analyticsData?.baseAsset?.stats24h?.numSells / (analyticsData?.baseAsset?.stats24h?.numBuys + analyticsData?.baseAsset?.stats24h?.numSells)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Buy Volume & Sell Volume */}
      <div className="flex flex-row gap-[12px] items-center rounded-lg">
        <div className="h-[51px] p-[12px] bg-white rounded-lg">
          <h1 className={`${geologica.className} text-[10px]`}>24H VOLUME</h1>
          <h1 className={`${geologica.className} opacity-50 text-[14px]`}>${formatNumber(analyticsData?.volume24h)}</h1>
        </div>
        <div className="flex flex-col p-[12px] rounded-lg bg-white h-[51px] flex-1">
          <div className="flex flex-row justify-between text-[10px]">
            <h1 className={`${geologica.className} font-semibold`}>${formatNumber(analyticsData?.baseAsset?.stats24h?.buyVolume)} Buys</h1>
            <h1 className={`${geologica.className} font-semibold`}>${formatNumber(analyticsData?.baseAsset?.stats24h?.sellVolume)} Sells</h1>
          </div>
          <div className="h-[4px] flex flex-row">
            <div className="h-[4px] bg-green-500" style={{ width: `${(analyticsData?.baseAsset?.stats24h?.buyVolume / (analyticsData?.baseAsset?.stats24h?.buyVolume + analyticsData?.baseAsset?.stats24h?.sellVolume)) * 100}%` }}></div>
            <div className="h-[4px] bg-red-500" style={{ width: `${(analyticsData?.baseAsset?.stats24h?.sellVolume / (analyticsData?.baseAsset?.stats24h?.buyVolume + analyticsData?.baseAsset?.stats24h?.sellVolume)) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolMarkers;