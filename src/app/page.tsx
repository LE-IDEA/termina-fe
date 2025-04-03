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
import ConnectButton from "@/components/ConnectComponent";
import { useAppKitAccount } from "@reown/appkit/react";

const Page = () => {
  const { isConnected } = useAppKitAccount();

  return (
    <main className="">
      <div className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <SearchAdd />
          </div>
          <ConnectButton />
        </div>

        {!isConnected ? (
          <div className="mt-[12.5vh] w-fit mx-auto">
            <p className="text-gray-800  font-bold mb-8 mt-4">
              Please connect your wallet to continue.
            </p>
            <span className="flex justify-center">
            <ConnectButton/>
            </span>
          </div>
        ) : (
          <>
            <h1
              className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]  md:hidden`}
            >
              Gm mate
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
              <BalanceCard />
              <HottestCard />
              <HotList />
              <HotRecent />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
