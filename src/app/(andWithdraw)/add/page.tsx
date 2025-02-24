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
    return (
        <div className="flex flex-col gap-3 w-[364px] h-[191px] rounded-[24px] ">
            <div className={`w-[364px] h-[136px] rounded-[12px] ${response ? blackResponse ? 'bg-black' : 'bg-[#ffcbcb]' : null
                }`}>
                <div className={`flex flex-row gap-3 w-[364px] h-[104px] bg-white p-3 border-[1px] border-solid ${response ? blackResponse ? 'border-black' : 'border-[#ffcbcb]' : null} `}>
                    <div className="flex flex-col gap-1.5 w-[308px] h-[80px]">
                        <div className="flex flex-col gap-1 w-[308px] h-[34px]">
                            <label htmlFor="amount" className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>NGN</label>
                            <input id="amount" className={`w-[308px] h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal`} placeholder="0.00" title="Enter amount" onFocus={() => setIsInputActive(true)}
                                onBlur={() => setIsInputActive(false)}></input>
                        </div>

                        <div className="w-[308px] border-[0.4px] border-solid border-[#444444]
 opacity-50 rounded-lg"></div>

                        <div className="flex flex-col gap-1 w-[308px] h-[34px]">
                            <label htmlFor="amount" className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>USDC</label>
                            <input id="amount" className={`w-[308px] h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal`} placeholder="0.00" title="Enter amount"></input>
                        </div>


                    </div>
                    <Image src="/refresh.svg" alt='Home' width={20} height={20} className="my-auto" />
                </div>

                {response ?
                    blackResponse ? <BlackResponse /> : <RedResponse />
                    :
                    null
                }



            </div>

            <button
                className={`flex gap-2 w-[364px] h-[43px] pt-3 pr-6 pb-3 pl-6 rounded-[12px] ${isInputActive ? 'bg-blue-500' : 'bg-[#444444]'
                    }`}
            >
            <h1 className={`m-auto ${geologica.className}  font-normal text-[16px] leading-[19.2px] tracking-normal text-center`}>Submit</h1>
        </button>
        </div >
    )
}

export default page