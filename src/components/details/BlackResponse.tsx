import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState } from "react";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const BlackResponse = () => {
  return (
      <div className="flex flex-row h-[32px] justify-between p-[10px] rounded-br-[12px] rounded-bl-[12px] bg-black">
          <div className="flex flex-row gap-[4px] h-[12px]">
              <Image src="/circleDetail.svg" alt='Home' width={12} height={12} />
              <h1 className={`${geologica.className} text-white my-auto font-medium text-[8px] leading-[8px] tracking-normal`}>fee: 0.5% + ₦500</h1>
          </div>
          <h1 className={`${geologica.className} text-white font-medium text-[8px] leading-[8px] tracking-normal`}>Total: 400USDC ≈ ₦4,356</h1>

      </div>
  )
}

export default BlackResponse