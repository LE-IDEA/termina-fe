import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const SwapSlippage = () => {
  return (
      <div className="flex flex-col gap-12 px-3 py-9 lg:px-6 xl:p-4 bg-[#ebebeb] rounded-[36px] max-w-[420px] ">
          <div className="flex flex-col gap-3 mx-auto">
              <h1 className={`${instrumentSerif.className}flex font-normal text-4xl leading-9 tracking-normal text-center`}>
                  Slippage Settings
              </h1>
              <h1 className={`${geologica.className} flex font-normal md:text-md  lg:leading-7 tracking-normal opacity-50 text-center`}>
                  Transaction is will not be completed if the price changes more than the slippage. Note: Very high slippage value may result to un favorable trade.
              </h1>
          </div>

          <div className="flex lg:flex-row gap-3 mx-auto md:flex-col">
              <h1 className={`${geologica.className} opacity-75 px-3 py-[10px] bg-white font-semibold text-sm leading-3 tracking-normal text-center text-black`}>
                  0.2%
              </h1>
              <h1 className={`${geologica.className} opacity-75 px-3 py-[10px] bg-white font-semibold text-sm leading-3 tracking-normal text-center text-black`}>
                  0.2%
              </h1>
              <h1 className={`${geologica.className} opacity-75 px-3 py-[10px] bg-white font-semibold text-sm leading-3 tracking-normal text-center text-black`}>
                  0.2%
              </h1>
              <h1 className={`${geologica.className} opacity-75 px-3 py-[10px] bg-white font-semibold text-sm leading-3 tracking-normal text-center text-black`}>
                  0.2%
              </h1>
              <h1 className={`${geologica.className} opacity-75 px-3 py-[10px] bg-white font-semibold text-sm leading-3 tracking-normal text-center text-black`}>
                  0.2%
              </h1>

          </div>
      </div>
  )
}

export default SwapSlippage