"use client"
import { Geologica } from "next/font/google"
import { useState } from "react";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const SlippageSettings = () => {
    const [profitButton, setProfitButton] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    const profitClick = (index) => {
        setProfitButton(index);
    };

    const handleClick = (index) => {
        setActiveButton(index);
    };
    return (
        <div className="hidden p-[18px] bg-[#ebebeb] md:flex md:flex-col gap-3 rounded-[12px] md:justify-between">
            <div className="flex flex-col gap-[12px]">
                <h1 className={`${geologica.className}font-normal text-[16px] leading-[1] tracking-[0%] `}>SELL  (take profit)</h1>
                <div className="flex flex-row gap-[6px]">
                    {["1.5X", "2X", "5X", "10X", "20X"].map((label, index) => (
                        <button
                            key={index}
                            onClick={() => profitClick(index)}
                            className={`p-1 rounded-[6px] ${profitButton === index ? "bg-blue-500" : "bg-black"
                                }`}
                        >
                            <h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] lg:leading-[1] tracking-[0%]`}>{label}</h1>
                        </button>
                    ))}


                    <div className="p-1 bg-white flex-1 w-[92px] 2xl:w-[188px]"><h1 className={`${geologica.className} text-[#ebebeb] font-normal text-[12px] leading-[12px] tracking-[0%]`}>CUSTOM</h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[12px]">
                <h1 className={`${geologica.className}font-normal text-[16px] leading-[1] tracking-[0%] `}>SELL  (stop loss)</h1>
                <div className="flex flex-row gap-[6px]">
                    {["1.5X", "2X", "5X", "10X", "20X"].map((label, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`p-1 rounded-[6px] ${activeButton === index ? "bg-blue-500" : "bg-black"
                                }`}
                        >
                            <h1 className={`${geologica.className} text-white font-normal text-[12px] leading-[12px] lg:leading-[1] tracking-[0%]`}>{label}</h1>
                        </button>
                    ))}


                    <div className="p-1 bg-white flex-1 w-[92px] 2xl:w-[188px]"><h1 className={`${geologica.className} text-[#ebebeb] font-normal text-[12px] leading-[12px] tracking-[0%]`}>CUSTOM</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SlippageSettings