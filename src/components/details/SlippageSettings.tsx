import { Geologica } from "next/font/google"
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const SlippageSettings = () => {
  return (
      <div className="hidden md:px-4 md:py-[8px] bg-[#ebebeb] md:flex md:flex-col  rounded-[12px] md:justify-between">
          <div className=" md:flex md:flex-col md:gap-[4px]">
              <h1 className={`${geologica.className}font-normal text-[16px] leading-[16px] tracking-[0%]`}>Sell  (take profit)</h1>
              <div className="flex flex-row gap-[6px]">
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-white"><h1 className={`${geologica.className} pr-4 lg:pr-10 text-[#ebebeb] font-normal text-[12px] leading-[12px] tracking-[0%]`}>CUSTOM</h1>
                  </div>
              </div>
          </div>
          <div className=" sm:flex sm:flex-col sm:gap-[4px]">
              <h1 className={`${geologica.className}font-normal text-[16px] leading-[16px] tracking-[0%]`}>Sell  (take profit)</h1>
              <div className="flex flex-row gap-[6px]">
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-black"><h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] tracking-[0%]`}>10X</h1>
                  </div>
                  <div className="p-1 bg-white"><h1 className={`${geologica.className} pr-4 lg:pr-10 text-[#ebebeb] font-normal text-[12px] leading-[12px] tracking-[0%]`}>CUSTOM</h1>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default SlippageSettings