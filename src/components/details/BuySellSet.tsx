import Image from "next/image"
import { Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });


const BuySellSet = () => {
  return (
   <div className="h-[48px] w-[364px] flex flex-row gap-[12px] ">
                           <div className="w-[146px] flex flex-row gap-[10px] p-[12px] rounded-2xl bg-[#ebebeb]">
                               <Image
                                   src="/carretDown.svg"
                                   alt='pay'
                                   width={24}
                                   height={24}
                               />
                               <h1 className={`${geologica.className} font-geologica font-medium text-[20px] leading-[20px] tracking-[0%]`}>Buy</h1>
                           </div>
                           <div className="w-[146px] flex flex-row gap-[10px] p-[12px] rounded-2xl bg-[#ebebeb]">
                               <Image
                                   src="/carretDown.svg"
                                   alt='pay'
                                   width={24}
                                   height={24}
                               />
                               <h1 className={`${geologica.className} font-geologica font-medium text-[20px] leading-[20px] tracking-[0%]`}>Buy</h1>
                           </div>
                           <Image
                               src="/blueSettings.svg"
                               alt='set it'
                               width={48}
                               height={48}
                           />
   
   
                       </div>
  )
}

export default BuySellSet