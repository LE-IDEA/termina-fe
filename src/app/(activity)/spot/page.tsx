"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
import HottestCard from "@/components/details/HottestCard";
import HotList from "@/components/details/MyTokens";
import HotRecent from "@/components/details/HotRecent";
import SearchAdd from "@/components/details/SearchAdd";
import BalanceCard from "@/components/details/BalanceCard";

const page = () => {
  return (
    <main className="">
      <div className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
        
        <h1 className="text-center mx-auto text-5xl mt-[15%]">
          Coming Soon!
        </h1>
      </div>
    </main>
  );
};

export default page;
