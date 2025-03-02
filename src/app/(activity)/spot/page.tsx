"use client"
import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
import HottestCard from "@/components/details/HottestCard";
import HotList from "@/components/details/HotList";
import HotRecent from "@/components/details/HotRecent";
import CurrencyChange from "@/components/details/CurrencyChange";
import { useState } from "react";
import Link from "next/link";



const page = () => {
  const [isCurr, setIsCurr] = useState(true);
  const changeCurr = () => {
    setIsCurr(!isCurr);
  }

  return (
    <div className="relative h-full gap-[24px] overflow-auto hide-scrollbar flex flex-col mb-[200px] px-4 sm:px-14 md:px-0">
      <div className="flex flex-row justify-between md:hidden">
        <div className='flex flex-row [36px] gap-[12px]'>
          <Image src="/SearchFrame.svg" alt='prev' width={36} height={36} />
          <Image src="/globeFrame.svg" alt='prev' width={36} height={36} />
        </div>
        <Image src="/UserFrame.svg" alt='prev' width={36} height={36} />
      </div>

      <h1 className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]  md:hidden`}>Gm mate </h1>

      {/* add&withdarw */}
      <div className="gap-[24px] flex flex-col md:flex-row lg:justify-between ">

        <div className='flex flex-col md:max-w-[350px] gap-[12px] md:min-w-[322px] md:justify-between md:gap-1 xl:min-w-[480px]'>
          <div className="flex flex-col bg-[#ebebeb] p-3 gap-[36px] sm:gap-16 rounded-[24px]">
            <div className='  gap-[4px] flex flex-col'>
              <div className="flex flex-row justify-between">
                <h1 className={` ${instrumentSerif.className} font-normal text-[36px] leading-[36px] tracking-[0] text-center text-black`}>$200.02</h1>
                <div className='flex flex-row [32px]'>
                  <button title='change coin' onClick={changeCurr}><Image src="/ArrowDown.svg" alt='prev' width={18} height={18} /></button>
                  <Image src="/Solana.svg" alt='prev' width={32} height={32} />
                </div>
              </div>
              <div className='flex  gap-1 '>
                <div className=' w-[8px] h-[8px] bg-[#47B105] rounded-full'></div>
                <h1 className={`${geologica.className} font-normal text-[10px] text-bg-[#47B105] leading-[10px] tracking-[0%]`}>+20%</h1>
              </div>
            </div>
            <div className=' flex justify-between'>
              <h1 className={` font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>
                F4aLc3iBr...3jOXwv53F7
              </h1>
              <Image src="/Copy.svg" alt='prev' width={18} height={18} />
            </div>
          </div>

          <div className="flex flex-row justify-between gap-[8px]">
            <Link href='/add'>
              <button title='Add' className="items-center justify-center flex flex-row py-[12px] px-10 sm:px-20 md:px-10 gap-2 bg-[#ebebeb] rounded-xl flex-1">
                <Image src="/Add.svg" alt='Add' width={24} height={24} />
                <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Add</h1>
              </button>
            </Link>

            <Link href='/withdraw'>
              <button title='Withdraw' className="items-center justify-center flex flex-row py-[12px] px-8 sm:px-16 md:px-8 gap-2 bg-[#ebebeb] rounded-xl flex-1">
                <Image src="/Withdraw.svg" alt='Withdraw' width={24} height={24} />
                <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Withdraw</h1>
              </button>
            </Link>

          </div>

        </div>

        {/* hottest daily */}
        <div className="flex flex-col gap-[6px] md:min-w-[322px]  xl:min-w-[480px]">
          <div className='flex flex-row'>
            <h1 className={`font-normal text-[15px] leading-[15px] tracking-[0%] text-center ${instrumentSerif.className}`}>Hottest Daily</h1>
            <Image src="/bolt.svg" alt='hot' width={12} height={12} />
          </div>

            <HottestCard />

        </div>
      </div>

      <div className="gap-[24px] flex flex-col md:flex-row md:items-center md:justify-between md:gap-1">

      <HotRecent />
      <HotList />
      </div>

      {!isCurr ? <CurrencyChange /> : null}

    </div>

  )
}

export default page