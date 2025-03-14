"use client"
import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
import { useState } from "react";
import Link from "next/link";
import CurrencyChange from "./CurrencyChange";


const BalanceCard = () => {

    const [isCurr, setIsCurr] = useState(true);
    const changeCurr = () => {
        setIsCurr(!isCurr);
    }
  return (
      

      <div className='flex flex-col gap-[12px] md:w-full pmd:w-[362px] xl:w-[412px] md:justify-between pmd:h-[238px] '>
           {/* <div className='flex flex-col gap-[12px] md:w-full lgg:h-[400px] md:justify-between pmd:h-[238px] '> */}
          <div className="flex flex-col bg-[#ebebeb] p-3 md:p-6 gap-[36px] sm:gap-16 pmd:gap-0 pmd:justify-between pmd:h-[178px] rounded-[24px]">
                  <div className='gap-[4px] flex flex-col'>
                      <div className="flex flex-row justify-between">
                          <h1 className={` ${instrumentSerif.className} font-normal text-[36px] md:leading-1 tracking-[0] text-center text-black`}>$200.02</h1>
                          <div className='flex flex-row'>
                              <button title='change coin' onClick={changeCurr}><Image src="/ArrowDown.svg" alt='prev' width={18} height={18} /></button>
                              <Image src="/Solana.svg" alt='prev' width={32} height={32} />
                          </div>
                      </div>
                      <div className='flex  gap-1 '>
                          <div className=' w-[8px] h-[8px] bg-[#47B105] rounded-full'></div>
                          <h1 className={`${geologica.className} font-normal text-[10px] text-bg-[#47B105] leading-[10px] tracking-[0%]`}>+20%</h1>
                      </div>
                  </div>
                  <div className=' flex flex-row justify-between'>
                      <h1 className={`font-normal text-[10px] leading-1 tracking-[0%] opacity-50`}>
                          F4aLc3iBr...3jOXwv53F7
                      </h1>
                      <Image src="/Copy.svg" alt='prev' width={18} height={18} />
                  </div>
              </div>

          <div className="flex flex-row justify-between md:gap-3 ">
                  <Link href='/add'>
                      <button title='Add' className="items-center justify-center flex flex-row py-[12px] px-10 sm:px-20 md:px-5 gap-2 md:gap-[10px] bg-[#ebebeb] rounded-xl flex-1">
                          <Image src="/Add.svg" alt='Add' width={24} height={24} />
                          <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Add</h1>
                      </button>
                  </Link>

                  <Link href='/withdraw'>
                      <button title='Withdraw' className="items-center justify-center flex flex-row py-[12px] px-8 sm:px-16 md:px-4 gap-2 md:gap-[10px] bg-[#ebebeb] rounded-xl flex-1">
                          <Image src="/Withdraw.svg" alt='Withdraw' width={24} height={24} />
                          <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}>Withdraw</h1>
                      </button>
                  </Link>

              </div>

          {!isCurr ? <CurrencyChange /> : null}


          </div>

         
  )
}

export default BalanceCard