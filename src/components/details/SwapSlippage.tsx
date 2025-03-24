"use client";
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState } from "react";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const SwapSlippage = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (index) => {
    setActiveButton(index);
  };

  return (
    <section className="hidden md:block">
      <div className="flex flex-col gap-12 px-12 md:px-2 xl:px-12 py-9 bg-[#ebebeb] rounded-[36px] pmd:w-[412px] ">
        <div className="flex flex-col gap-3 mx-auto">
          <h1
            className={`${instrumentSerif.className}flex font-normal md:text-[28px] lg:text-[36px] leading-9 tracking-normal text-center`}
          >
            Slippage Settings
          </h1>
          <h1
            className={`${geologica.className} flex font-normal md:text-[10px]  md:leading-3 pmd:text-[12px] pmd:leading-1 tracking-normal opacity-50 text-center`}
          >
            Transaction is will not be completed if the price changes more than
            the slippage. Note: Very high slippage value may result to un
            favorable trade.
          </h1>
        </div>

        <div className="flex flex-row gap-3 mx-auto">
          {["0.2%", "0.5%", "1%", "5%", "10%"].map((label, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`px-3 py-[10px] rounded-[12px] ${
                activeButton === index ? "bg-blue-500" : "bg-white"
              }`}
            >
              <h1
                className={`${geologica.className} opacity-75 font-semibold text-sm leading-3 tracking-normal text-center text-black`}
              >
                {label}
              </h1>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwapSlippage;
