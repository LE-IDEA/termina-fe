"use client";
import { FC, } from "react";
import { Instrument_Serif, Geologica } from "next/font/google";
import Image from "next/image";
import Web3Icons from "../../../public/Web3icons.png"
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const WhyTermina: FC = () => {
  return (
    <>
      <section className={`container mx-auto mt-28 md:px-8 mb-8 `}>
        <div className="mx-auto">
          <h2 className={`${instrumentSerif.className} text-center text-4xl`}>
            Why Termina?
          </h2>

          <div className={`grid gap-6 lg:grid-cols-7 mt-12 px-4 md:px-0 ${geologica.className}`}>
            <div className="relative w-full lg:col-span-3 group">
            <div className="absolute flex-none -left-[20px] -top-[40px] w-[200px] h-auto hidden group-hover:block  -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
              <Image src={Web3Icons} alt="web3-icons" />
            </div>
            <div className="w-full border rounded-3xl p-6 transition-all duration-400 ease-in-out group-hover:bg-zinc-950 group-hover:border-zinc-800 group-hover:shadow-lg *:group-hover:text-white">
              <div className="mb-4">
                <Image src="/Logo-small.png" width={100} height={100} alt="" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold  mb-4">
                Integrated Tools
              </h2>
              <p className="text-gray-700 font-light text-base">
                Track prices, manage holdings, and securely send and receive
                assets - all in one app. Trade memecoins for SPL tokens easily
                with simple token swaps.
              </p>
            </div>
            </div>

            <div className="w-full border lg:col-span-2 rounded-3xl p-6 ">
              <div className="">
                <Image src="/dollar-icon.png" width={40} height={40} alt="" />
              </div>
              <h2 className="text-xl md:text-2xl mt-[60px] font-bold  mb-4">
                Pay Gas Fees with Stablecoins
              </h2>
              <p className="text-gray-700 font-light text-base">
                No more fluctuating gas fees - pay with stablecoins for
                predictable costs and smooth trading.
              </p>
            </div>

            <div className="w-full border lg:col-span-2 rounded-3xl p-6">
              <div className="">
                <Image src="/Card-Coin.png" width={40} height={40} alt="" />
              </div>
              <h2 className="text-xl md:text-2xl mt-[60px] font-bold  mb-4">
                Withdraw Earnings to Your Local Bank
              </h2>
              <p className="text-gray-700 font-light text-base">
                Trade, grow your portfolio, & withdraw to your bank. Swap tokens
                in your local currency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default WhyTermina;
