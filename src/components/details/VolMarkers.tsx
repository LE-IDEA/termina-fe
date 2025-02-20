import React from 'react'
import { Instrument_Serif, Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const VolMarkers = () => {
  return (
      <div className="flex flex-col h-[201px] rounded-lg p-[12px] gap-[12px] bg-[#ebebeb]">
          <div className="flex flex-row h-[51px] gap-[12px] rounded-lg">
              <div className="w-[72px] h-[51px] p-[12px] bg-white gap-[3px] rounded-md">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-[14px] tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-md bg-white w-[256px] h-[51px] justify-between">
                  <div className="flex flex-row w-[232px] h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className="w-[232px] h-[4px] flex flex-row ">
                      <div className="w-[114px] h-[4px] bg-green-500"></div>
                      <div className="w-[114px] h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>
          <div className="flex flex-row h-[51px] gap-[12px] rounded-lg">
              <div className="w-[72px] h-[51px] p-[12px] bg-white gap-[3px] rounded-md">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-[14px] tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-md bg-white w-[256px] h-[51px] justify-between">
                  <div className="flex flex-row w-[232px] h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className="w-[232px] h-[4px] flex flex-row ">
                      <div className="w-[114px] h-[4px] bg-green-500"></div>
                      <div className="w-[114px] h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>
          <div className="flex flex-row h-[51px] gap-[12px] rounded-lg">
              <div className="w-[72px] h-[51px] p-[12px] bg-white gap-[3px] rounded-md">
                  <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>TXNS</h1>
                  <h1 className={`${geologica.className} opacity-50 font-normal text-[14px] leading-[14px] tracking-[0%]`}>175k</h1>
              </div>
              <div className="flex flex-col p-[12px] rounded-md bg-white w-[256px] h-[51px] justify-between">
                  <div className="flex flex-row w-[232px] h-[10px]  gap-18 justify-between">
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Buys</h1>
                      <h1 className={`${geologica.className} font-semibold text-[10px] leading-[10px] tracking-[0%]`}>144,434 Sells</h1>
                  </div>
                  <div className="w-[232px] h-[4px] flex flex-row ">
                      <div className="w-[114px] h-[4px] bg-green-500"></div>
                      <div className="w-[114px] h-[4px] bg-red-500"></div>
                  </div>

              </div>
          </div>


      </div>
  )
}

export default VolMarkers