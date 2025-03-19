"use client"
import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
import HottestCard from "@/components/details/HottestCard";
import HotList from "@/components/details/HotList";
import HotRecent from "@/components/details/HotRecent";
import SearchAdd from "@/components/details/SearchAdd";
import BalanceCard from "@/components/details/BalanceCard";
import Sidebar from "@/components/details/Sidebar";
import DownNav from "@/components/details/DownNav";


const page = () => {

  return (
    <div className="overflow-auto hide-scrollbar h-screen">   

      <div className=" flex flex-col md:flex-row md:gap-3 w-full lgg:gap-4 pmd:gap-6 xl:gap-3 pxl:gap-6 pmd:w-[904px] xl:w-[1100px] pxl:max-w-[1300px] px-3 py-6 md:px-2 mdd:px-9 pmd:px-0  mx-auto ">
        <Sidebar />

        <div className=" gap-[24px] flex flex-col xl:w-[850px] mb-[200px] md:px-0 mx-auto">
          <div className="hidden md:block">  <SearchAdd /> </div>

          <div className="flex flex-row justify-between md:hidden">
            <div className='flex flex-row [36px] gap-[12px]'>
              <Image src="/SearchFrame.svg" alt='prev' width={36} height={36} />
              <div className='bg-[#ebebeb] p-[4px] rounded-[24px]'>
                <Image src="/Plus.svg" alt='add' width={28} height={28} />
              </div>            </div>
            <Image src="/UserFrame.svg" alt='prev' width={36} height={36} />
          </div>

          <h1 className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]  md:hidden`}>Gm mate </h1>

          {/* add&withdarw */}
          <div className=" gap-[24px] flex flex-col md:flex-row xl:gap-0 lg:justify-between ">
            <BalanceCard />  
              <HottestCard />
          </div>

          <div className="gap-[24px] flex flex-col md:flex-row ">

            <HotList />
            <HotRecent />
          </div>

        </div>
      </div>
      <DownNav />
    </div>

  )
}

export default page