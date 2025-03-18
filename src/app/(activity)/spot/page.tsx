"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
import HottestCard from "@/components/details/HottestCard";
import HotList from "@/components/details/HotList";
import HotRecent from "@/components/details/HotRecent";
import SearchAdd from "@/components/details/SearchAdd";
import BalanceCard from "@/components/details/BalanceCard";

const page = () => {
  return (
    <main className="">
      <div className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
        <div className="flex justify-between">
          {" "}
          <SearchAdd /> <appkit-button />
        </div>

        <div className="flex flex-row justify-between md:hidden">
          <div className="flex flex-row [36px] gap-[12px]">
            <Image src="/SearchFrame.svg" alt="prev" width={36} height={36} />
            <div className="bg-[#ebebeb] p-[4px] rounded-[24px]">
              <Image src="/Plus.svg" alt="add" width={28} height={28} />
            </div>{" "}
          </div>
          <Image src="/UserFrame.svg" alt="prev" width={36} height={36} />
        </div>

        <h1
          className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]  md:hidden`}
        >
          Gm mate{" "}
        </h1>

        {/* add&withdarw */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
          <BalanceCard />
          <HottestCard />
          <HotList />
          <HotRecent />
        </div>
      </div>
    </main>
  );
};

export default page;
