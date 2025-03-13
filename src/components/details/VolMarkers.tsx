import React from 'react'
import { Instrument_Serif, Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const VolMarkers = () => {
  return (
      <section className="flex flex-col justify-between h-[201px] rounded-lg p-[12px] gap-[12px] bg-[#ebebeb]">

          <div className="flex flex-row h-[51px] gap-[12px] items-center rounded-lg ">
              <div className=" h-[51px] p-[12px] bg-white gap-[3px] rounded-lg">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-1 tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-1 tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-lg bg-white h-[51px] justify-between flex-1">
                  <div className="flex flex-row  h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className=" h-[4px] flex flex-row  ">
                      <div className="w-1/2 h-[4px] bg-green-500"></div>
                      <div className="w-1/2 h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>

          <div className="flex flex-row h-[51px] gap-[12px] items-center rounded-lg ">
              <div className=" h-[51px] p-[12px] bg-white gap-[3px] rounded-lg">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-1 tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-1 tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-lg bg-white h-[51px] justify-between flex-1">
                  <div className="flex flex-row  h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className=" h-[4px] flex flex-row  ">
                      <div className="w-1/2 h-[4px] bg-green-500"></div>
                      <div className="w-1/2 h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>

          <div className="flex flex-row h-[51px] gap-[12px] items-center rounded-lg ">
              <div className=" h-[51px] p-[12px] bg-white gap-[3px] rounded-lg">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-1 tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-1 tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-lg bg-white h-[51px] justify-between flex-1">
                  <div className="flex flex-row  h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-1 tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className=" h-[4px] flex flex-row  ">
                      <div className="w-1/2 h-[4px] bg-green-500"></div>
                      <div className="w-1/2 h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>
         

      </section>
  )
}

export default VolMarkers