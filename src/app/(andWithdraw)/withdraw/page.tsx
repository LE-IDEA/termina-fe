"use client"
import Image from "next/image"
import { Geologica } from "next/font/google";
import { useState } from "react";
import BlackResponse from "@/components/details/BlackResponse";
import RedResponse from "@/components/details/RedResponse";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const page = () => {
    const [isAccount, setIsAccount] = useState(true);
    const [notAccount, setNotAccount] = useState(true);
    const [isInputActive, setIsInputActive] = useState(false);
    const [response, setResponse] = useState(false);
    const [blackResponse, redResponse] = useState(true);

    const bankOptions = [
        { name: "Access Bank" }, { name: "First Bank" }, { name: "GT Bank" }, { name: "Zenith Bank" }, { name: "UBA" }
    ]
    return (
        <div className="flex flex-col rounded-[24px] gap-3 md:w-[500px]">
            <input type="number" name="Account Number" id="acct" title="Enter account number" placeholder="10 digit account number" className={` p-[10px]  ${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%] border-[0.4px] border-solid  rounded-lg`} />
            <div className={`flex flex-col rounded-lg ${!isAccount ? 'bg-black' : !notAccount ? 'bg-[#ffcbcb]' : null}`}>
                <input type="number" name="Bank name" id="acct" title="Enter bank name" placeholder="10 digit account number" className={`p-[10px] ${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%] border-[0.4px] border-solid  rounded-lg ${!isAccount ? 'border-black' : !notAccount ? 'border-[#ffcbcb]' : null}`} />
                {
                    !isAccount ?
                        <div className="flex flex-col bg-black gap-[12px] rounded-br-[12px] rounded-bl-[12px] p-3" >
                            {bankOptions.slice(0, 3).map((bank, index) => (
                                <div key={index} className=" ">
                                    <h1 className={`${geologica.className} font-medium text-[8px] leading-[8px] tracking-[0% text-white`}>{bank.name}</h1>
                                </div>
                            ))}
                        </div>
                        : null
                }
                {
                    !notAccount ?
                        <div className="flex p-[10px] items-center rounded-br-[12px] rounded-bl-[12px] bg-[#ffcbcb] ">
                            <div className="flex flex-row items-center justify-center gap-[4px] mx-auto">
                                <Image src="/circleDetaill.svg" alt='warning' width={12} height={12} className="my-auto" />
                                <h1 className={`${geologica.className} font-medium text-[8px] my-auto leading-[8px] tracking-[0%] text-center text-[#AC1717]`}>Not in our registry</h1>
                            </div>
                        </div>
                        : null
                }
            </div>

            <div className={` rounded-[12px] ${response ? blackResponse ? 'bg-black' : 'bg-[#ffcbcb]' : null}`}>
                <div className={`flex flex-row gap-3 justify-between bg-white p-3 border-[1px] border-solid ${response ? blackResponse ? 'border-black' : 'border-[#ffcbcb]' : null}`}>
                    <div className="flex flex-col gap-1.5 ">
                        <div className="flex flex-col gap-1 ">
                            <label htmlFor="amount" className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>NGN</label>
                            <input id="amount" className={` h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal`} placeholder="0.00" title="Enter amount" onFocus={() => setIsInputActive(true)}
                                onBlur={() => setIsInputActive(false)}></input>
                        </div>

                        <div className=" border-[0.4px] border-solid border-[#444444] opacity-50 rounded-lg md:w-[450px]"></div>

                        <div className="flex flex-col gap-1 ">
                            <label htmlFor="amount" className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}>USDC</label>
                            <input id="amount" className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal`} placeholder="0.00" title="Enter amount"></input>
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
            {!isAccount ?
                <div className={`flex gap-2 px-6 py-3 rounded-[12px] bg-black`} >
                    <h1 className={`m-auto ${geologica.className}  font-normal text-[16px] leading-[19.2px] tracking-normal text-white text-center`}>John Idaku Ifechi</h1>
                </div> : null
            }

            {
                !notAccount ?
                    <div className={`flex flex-col gap-2 rounded-[12px] bg-[#ffcbcb] items-center `} >

                        <div className="flex flex-row  px-6 py-3 gap-[4px] m-auto">
                            <Image src="/circleDetaill.svg" alt='warning' width={12} height={12} />
                            <h1 className={`${geologica.className} font-medium text-[8px] leading-[8px] my-auto tracking-[0%] text-center text-[#AC1717]`}>account not found</h1>
                        </div>

                    </div>
                    : null
            }

            <button className={`flex gap-2 py-3 px-6 rounded-[12px] ${isInputActive ? 'bg-blue-500' : 'bg-[#444444]'}`} >
            <h1 className={`m-auto ${geologica.className}  font-normal text-[16px] leading-[19.2px] tracking-normal text-white text-center`}>Submit</h1>
        </button>
        </div >
    )
}

export default page