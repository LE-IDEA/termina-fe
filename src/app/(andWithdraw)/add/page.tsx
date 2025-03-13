"use client"
import Image from "next/image"
import { Geologica } from "next/font/google";
import { useState } from "react";
import BlackResponse from "@/components/details/BlackResponse";
import RedResponse from "@/components/details/RedResponse";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const page = () => {
    const [isActive, setIsActive] = useState(false);
    const [isInputActive, setIsInputActive] = useState(false);
    const [response, setResponse] = useState(false);
    const [blackResponse, redResponse] = useState(true);

    const [naira, setNaira] = useState("");
    const [dollar, setDollar] = useState("");
    const [isNairaFirst, setIsNairaFirst] = useState(true);

    // Conversion rate example (adjust accordingly)
    const conversionRate = 1450; // 1 Dollar = 750 Naira

    const handleNairaChange = (e) => {
        const nairaValue = e.target.value;
        setNaira(nairaValue);
        setDollar((nairaValue / conversionRate).toFixed(2)); // Convert to Dollar
    };

    const handleDollarChange = (e) => {
        const dollarValue = e.target.value;
        setDollar(dollarValue);
        setNaira((dollarValue * conversionRate).toFixed(2)); // Convert to Naira
    };

    const handleSwitch = () => {
        // Switch the input order and clear the values
        setIsNairaFirst(!isNairaFirst);
        // setNaira("");
        // setDollar("");
    };

    return (
        <div className="flex flex-col gap-3  h-[191px] rounded-[24px] md:w-[500px] sm:w-[400px] ">
            <div className="flex flex-row justify-between p-2 rounded-[12px] border-[1px] border-solid">
                <input 
                    id="Solana address" className={` ${geologica.className} font-normal text-[16px] leading-1 tracking-normal outline-none`} placeholder="Paste a Solana wallet address" title="Enter amount">
                </input>
                <Image src="/AddressCopy.svg" alt='Home' width={20} height={20} className="my-auto" />

            </div>
            <div className={`h-[136px] rounded-[12px] ${response ? blackResponse ? 'bg-black' : 'bg-[#ffcbcb]' : null}`}>

                <div className={`flex flex-row gap-3 justify-between h-[104px] bg-white p-3 border-[1px] border-solid rounded-[12px] ${response ? blackResponse ? 'border-black' : 'border-[#ffcbcb]' : null} `}>

                    <div className="flex flex-col gap-1.5  h-[80px]">
                        <div className="flex flex-col gap-1  h-[34px]">
                            <label htmlFor={isNairaFirst ? "naira" : "dollar"} className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>{isNairaFirst ? "NGN" : "USDC"}</label>
                            <input

                                value={isNairaFirst ? naira : dollar} onChange={isNairaFirst ? handleNairaChange : handleDollarChange}
                                id={isNairaFirst ? "naira" : "dollar"} className={`h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal outline-none`} placeholder="0.00" title="Enter amount" onFocus={() => setIsInputActive(true)}
                                onBlur={() => setIsInputActive(false)}></input>
                        </div>

                        <div className="border-[0.4px] border-solid border-[#444444] opacity-50 rounded-lg md:w-[450px] sm:w-[350px]"></div>

                        <div className="flex flex-col gap-1 h-[34px]">
                            <label htmlFor={isNairaFirst ? "dollar" : "naira"} className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>{isNairaFirst ? "USDC" : "NGN"} </label>
                            <input
                                value={isNairaFirst ? dollar : naira} onChange={isNairaFirst ? handleDollarChange : handleNairaChange}
                                id={isNairaFirst ? "dollar" : "naira"} className={`h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal outline-none`} placeholder="0.00" title="Enter amount"></input>
                        </div>

                    </div>
                    <Image onClick={handleSwitch} src="/refresh.svg" alt='Home' width={20} height={20} className="my-auto" />
                </div>

                {response ? blackResponse ? <BlackResponse /> : <RedResponse /> : null}

            </div>

            <button className={`flex gap-2 h-[43px] pt-3 pr-6 pb-3 pl-6 rounded-[12px] ${isInputActive ? 'bg-blue-500' : 'bg-[#444444]'}`} >
                <h1 className={`m-auto ${geologica.className}  font-normal text-[16px] leading-[19.2px] tracking-normal text-center`}>Submit</h1>
            </button>
        </div >
    )
}

export default page