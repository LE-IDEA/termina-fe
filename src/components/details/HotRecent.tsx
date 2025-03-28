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

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://datapi.jup.ag/v1/pools/toptrending/5m"
        );
        const data = await response.json();
        setTrendingTokens(data.pools.slice(0, 5)); // Get top 3 trending tokens
      } catch (err) {
        setError("Failed to fetch trending tokens.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

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
        <h1
          className={`${geologica.className} font-normal text-[10px] opacity-50 my-auto`}
        >
          See more
        </h1>
      </div>

      {/* Loading & Error Handling */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Trending Tokens */}
      {!isLoading &&
        !error &&
        trendingTokens.map((token) => (
          <Link href={`/${token.baseAsset.id}`} key={token.id}>
            <div className="p-[12px] rounded-[18px] bg-[#ebebeb] flex flex-row justify-between">
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
                    className={`${geologica.className} font-medium text-[16px]`}
                  >
                    ${formatNumber(token.baseAsset?.mcap)}
                  </h1>
                </div>
                <div className="flex flex-row gap-[12px] justify-between">
                  <h1
                    className={`${geologica.className} font-normal text-[10px] opacity-50`}
                  >
                    {formatNumber(token.baseAsset?.usdPrice)} SOL
                  </h1>
                  <h1
                    className={`${
                      geologica.className
                    } font-normal text-[10px] ${
                      token.baseAsset?.stats24h?.priceChange >= 0
                        ? "text-green-500"
                        : "text-[#FF0004]"
                    }`}
                  >
                    {token.baseAsset?.stats24h?.priceChange?.toFixed(2)}%
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
