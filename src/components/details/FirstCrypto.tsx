import Image from "next/image";
import { Instrument_Serif, Geologica } from "next/font/google";
import { Pool } from "@/types/jupTokens";
import { formatNumber } from "@/utils";

const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const FirstCrypto = ({ analyticsData }: { analyticsData: Pool }) => {
  if (!analyticsData) return <p>Loading analytics...</p>;

  return (
    <div className="flex flex-col bg-[#ebebeb] h-auto p-3 gap-6 rounded-[12px]">
      {/* Token Name & Icon */}
      <div className="flex items-center gap-2">
        <img src={analyticsData?.baseAsset?.icon} alt="Token Icon" width={24} height={24} />
        <h1 className={`${geologica.className} font-bold text-[20px]`}>{analyticsData?.baseAsset?.name ?? "Unknown Token"}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {/* Creator Address */}
        <div className="flex flex-row justify-between">
          <h1 className={`${geologica.className} text-[12px] opacity-50`}>Creator</h1>
          <div className="flex flex-row gap-2">
            <h1 className={`${geologica.className} text-[12px] truncate`}>{analyticsData?.baseAsset?.dev ?? "N/A"}</h1>
            <Image src="/Copy.svg" alt="copy" width={12} height={12} />
          </div>
        </div>

        {/* Mint Authority */}
        <div className="flex flex-row justify-between">
          <h1 className={`${geologica.className} text-[12px] opacity-50`}>Mint Authority</h1>
          <div className="flex flex-row gap-2">
            <h1 className={`${geologica.className} text-[12px]`}>{analyticsData?.audit?.mintAuthorityDisabled ? "Disabled" : "Enabled"}</h1>
            <Image src="/Copy.svg" alt="copy" width={12} height={12} />
          </div>
        </div>

        {/* LP Locked */}
        <div className="flex flex-row justify-between">
          <h1 className={`${geologica.className} text-[12px] opacity-50`}>LP Locked</h1>
          <h1 className={`${geologica.className} text-[12px]`}>{formatNumber(analyticsData?.liquidity)}</h1>
        </div>

        {/* Holders */}
        <div className="flex flex-row justify-between">
          <h1 className={`${geologica.className} text-[12px] opacity-50`}>Total Holders</h1>
          <h1 className={`${geologica.className} text-[12px]`}>{formatNumber(analyticsData?.baseAsset?.holderCount)}</h1>
        </div>

        {/* Top Holders Percentage */}
        <div className="flex flex-row justify-between">
          <h1 className={`${geologica.className} text-[12px] opacity-50`}>Top Holders %</h1>
          <h1 className={`${geologica.className} text-[12px]`}>{analyticsData?.baseAsset?.audit?.topHoldersPercentage?.toFixed(2)}%</h1>
        </div>
      </div>
    </div>
  );
};

export default FirstCrypto;
