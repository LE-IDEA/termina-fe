"use client"
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState } from "react";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const SwapSlippage = () => {
    const [isIncClicked, setIsIncClicked] = useState<boolean>(false);
    const [isDecClicked, setDecClicked] = useState<boolean>(false);

    const [activeButton, setActiveButton] = useState(null);


    const [slippage, setSlippage] = useState<number>(1); // Default slippage value in percentage

    const handleIncrement = (): void => {
        setSlippage((prev) => Math.min(prev + 0.5, 10)); // Increment slippage by 1 up to a max of 10
        setIsIncClicked(true); // Temporarily set clicked state
        setTimeout(() => setIsIncClicked(false), 300);
    };

    const handleDecrement = (): void => {
        setSlippage((prev) => Math.max(Number((prev - 0.1).toFixed(1)), 0)); // Decrement slippage by 0.1 down to a min of 0
        setDecClicked(true); // Temporarily set clicked state
        setTimeout(() => setDecClicked(false), 300);
    };

    const handleClick = (index: number): void => {
        const predefinedSlippages: number[] = [0.2, 0.5, 1, 5, 10];
        setSlippage(predefinedSlippages[index]);
    };



    return (
        <section className="block md:hidden fixed bottom-0 left-0 bg-[#ebebeb] rounded-tl-[60px] rounded-tr-[60px] z-3">

            <div className="flex flex-col gap-6 py-4 px-12 ">
                <div className="flex flex-col gap-3 mx-auto">
                    <h1 className={`${instrumentSerif.className}flex font-normal leading-9 tracking-normal text-center`}>
                        Slippage Settings
                    </h1>
                    <h1 className={`${geologica.className} flex font-normal text-[12px] leading-[100%] tracking-normal opacity-50 text-center`}>
                        Transaction is will not be completed if the price changes more than the slippage. Note: Very high slippage value may result to un favorable trade.
                    </h1>
                </div>

                <div className="flex flex-row gap-3 mx-auto">
                    {["0.2%", "0.5%", "1%", "5%", "10%"].map((label, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`px-3 py-[10px] rounded-[12px] ${slippage === parseFloat(label) ? "bg-blue-500" : "bg-white"
                                }`}
                        >
                            <h1 className="opacity-75 font-semibold text-sm leading-3 tracking-normal text-center text-black">
                                {label}
                            </h1>
                        </button>
                    ))}
                </div>
                <div className="flex gap-4 mx-auto">
                    <button
                        onClick={handleDecrement}
                        className={`px-3 py-[10px] rounded-[12px] bg-white ${isDecClicked ? "bg-red-200" : "bg-white"}`}
                    >
                        <h1 className="opacity-75 font-semibold text-sm leading-3 tracking-normal text-center text-black">
                            -0.1%
                        </h1>
                    </button>
                    <h1 className="font-semibold">{slippage.toFixed(1)}%</h1>
                    <button
                        onClick={handleIncrement} 
                        className={`px-3 py-[10px] rounded-[12px] bg-white ${isIncClicked ? "bg-green-200" : "bg-white" }`}
                    >
                        <h1 className="opacity-75 font-semibold text-sm leading-3 tracking-normal text-center text-black">
                            +0.5%
                        </h1>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default SwapSlippage