"use client";
import Image from "next/image";
import { Geologica } from "next/font/google";
import Link from "next/link";
import { Pool } from "@/types/jupTokens";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const BuySellSet = ({ analyticsData }: { analyticsData: Pool }) => {
  return (
    <div className=" flex flex-row gap-[12px] md:flex-col md:gap-[18px]">
      <Link href={`/swap?action=buy&token=${analyticsData?.baseAsset.id}`}>
        <button className=" flex flex-row gap-[10px] p-[12px] px-8 ssm:px-12  md:px-4 mdd:px-6 mddd:px-8 lg:px-4 rounded-[18px] bg-[#ebebeb] md:bg-[#47B105]">
          <Image src="/carretDown.svg" alt="pay" width={24} height={24} />
          <h1
            className={`${geologica.className} font-medium text-[20px] leading-[20px] lg:text-[24px] lg:leading-[1] tracking-[0%] md:text-white`}
          >
            Buy
          </h1>
        </button>
      </Link>

      <Link href={`/swap?action=sell&token=${analyticsData?.baseAsset.id}`}>
        <button className=" flex flex-row gap-[10px] p-[12px] px-8 ssm:px-12 md:px-4 mdd:px-6 mddd:px-8 lg:px-4 rounded-[18px] bg-[#ebebeb] md:bg-[#AC1717]">
          <Image
            src="/carretDown.svg"
            className=" rotate-180"
            alt="pay"
            width={24}
            height={24}
          />
          <h1
            className={`${geologica.className} font-medium text-[20px] leading-[20px] lg:text-[24px] lg:leading-[1] tracking-[0%] md:text-white`}
          >
            Sell
          </h1>
        </button>
      </Link>

      <button title="Settings" className="md:hidden">
        <Image src="/blueSettings.svg" alt="set it" width={48} height={48} />
      </button>
    </div>
  );
};

export default BuySellSet;
