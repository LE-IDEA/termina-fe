import Image from "next/image";
import { Instrument_Serif, Geologica } from "next/font/google";
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const FirstCrypto = () => {
  return (
      <div className="flex flex-col bg-[#ebebeb]  h-[124px] p-3 gap-6 rounded-[12px]">
          <h1 className={`${geologica.className} font-bold text-[20px] leading-[20px] tracking-[0%]`}>
              First Crypto President
          </h1>
          <div className="flex flex-col  h-[56px] gap-2.5">
              <div className="flex flex-row  h-[12px] gap-[4.5px] justify-between">
                  <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                      Creator
                  </h1>
                  <div className="flex flex-row [162px] h-[12px] gap-[12px]">
                      <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                          F4aLc3iBr...3jOXwv53F7
                      </h1>
                      <Image src="/Copy" alt="copy" width={12} height={12} />

                  </div>

              </div>
              <div className="flex flex-row  h-[12px] gap-[4.5px] justify-between">
                  <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                      Creator
                  </h1>
                  <div className="flex flex-row [162px] h-[12px] gap-[12px]">
                      <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                          F4aLc3iBr...3jOXwv53F7
                      </h1>
                      <Image src="/Copy" alt="copy" width={12} height={12} />

                  </div>

              </div>
              <div className="flex flex-row  h-[12px] gap-[4.5px] justify-between">
                  <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                      Creator
                  </h1>
                  <div className="flex flex-row [162px] h-[12px] gap-[12px]">
                      <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                          F4aLc3iBr...3jOXwv53F7
                      </h1>
                      <Image src="/Copy" alt="copy" width={12} height={12} />

                  </div>

              </div>

          </div>


      </div>
  )
}

export default FirstCrypto