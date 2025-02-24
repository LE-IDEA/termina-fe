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
    <div className="relative w-[364px] h-full overflow-auto hide-scrollbar gap-[24px]  flex flex-col mb-[200px]">
      <div className="flex flex-row w-[364px] h-[36px] justify-between">
        <div className='flex flex-row w-[84px] h-[36px] gap-[12px]'>
          <Image src="/SearchFrame.svg" alt='prev' width={36} height={36} />
          <Image src="/globeFrame.svg" alt='prev' width={36} height={36} />
        </div>
        <Image src="/UserFrame.svg" alt='prev' width={36} height={36} />
      </div>

      <h1 className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]`}>Gm mate </h1>

      {/* add&withdarw */}
      <div className='flex flex-col w-[364px] h-[188px] gap-[12px]'>
        <div className="flex flex-col bg-[#ebebeb] w-[364px] h-[128px] p-3 gap-[36px] rounded-[24px]">
          <div className='w-[340px] h-[50px] gap-[4px] flex flex-col'>
            <div className="w-[340px] h-[36px] flex flex-row justify-between">
              <h1 className={` ${instrumentSerif.className} font-normal text-[36px] leading-[36px] tracking-[0] text-center text-black`}>$200.02</h1>
              <div className='flex flex-row w-[50px] h-[32px]'>
                <button title='change coin' onClick={changeCurr}><Image src="/ArrowDown.svg" alt='prev' width={18} height={18} /></button>
                <Image src="/Solana.svg" alt='prev' width={32} height={32} />
              </div>
            </div>
            <div className='flex w-42 h-10 gap-4'>
              <div className='w-[8px] h-[8px] rounded-full bg-[#47B105]'></div>
              <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>+20%</h1>
            </div>
          </div>
          <div className='w-[340px] h-[18px] flex justify-between'>
            <h1 className={` font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>
              F4aLc3iBr...3jOXwv53F7
            </h1>
            <Image src="/Copy.svg" alt='prev' width={18} height={18} />
          </div>
        </div>

        <div className="flex flex-row  w-[364px] h-[48px] gap-[12px]">
          <Link href='/add'>
            <button title='Add' className="items-center justify-center flex flex-row w-[176px] h-[48px] p-[12px] gap-[10px] bg-[#ebebeb] rounded-md">
              <Image src="/Add.svg" alt='Add' width={24} height={24} />
              <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Add</h1>
            </button>
          </Link>

          <Link href='/withdraw'>
            <button title='Withdraw' className="items-center justify-center flex flex-row w-[176px] h-[48px] p-[12px] gap-[10px] bg-[#ebebeb] rounded-md">
              <Image src="/Withdraw.svg" alt='Withdraw' width={24} height={24} />
              <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Withdraw</h1>
            </button>
          </Link>

        </div>

      </div>

      {/* hottest daily */}
      <div className="w-[364px] h-[198.37939453125px] flex flex-col gap-[6px]">
        <div className='w-[93px] h-[15px] flex flex-row'>
          <h1 className={`font-normal text-[15px] leading-[15px] tracking-[0%] text-center ${instrumentSerif.className}`}>Hottest Daily</h1>
          <Image src="/bolt.svg" alt='hot' width={12} height={12} />
        </div>

        <div className=" overflow-x-auto hide-scrollbar">
          <HottestCard />
        </div>
      </div>

      <HotList />
      <HotRecent />

      {!isCurr ? <CurrencyChange /> : null}

    </div>

  )
}

export default page