import BuySellSet from "@/components/details/BuySellSet";
import VolMarkers from "@/components/details/VolMarkers";
import Image from "next/image";
import { Geologica } from "next/font/google";
import FirstCrypto from "@/components/details/FirstCrypto";
import TopHolds from "@/components/details/TopHolds";
// const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const page = () => {

    return (
        <div className="items-center justify-center p-[24px] w-[412px]">
            <div className="flex flex-col gap-[24px] w-[364px]">

                <div className="flex flex-row w-[364px] h-[36px] justify-between">
                    <Image
                        src="/prevCarret.svg"
                        alt='prev'
                        width={36}
                        height={36}
                    />
                    <div className="flex flex-row justify-between h-[36px] p-[6px] rounded-xl bg-[#EBEBEB]">
                        <Image
                            src="/glasses.svg"
                            alt='watchout'
                            width={24}
                            height={24}
                        />
                        <div className="p-[6px]">
                            <h1 className={`${geologica.className} text-center font-normal text-[12px] leading-[12px] tracking-[0%]`}>Add to watchlist</h1>
                        </div>

                    </div>
                </div>



                <div className="flex flex-col gap-[12px]">
                    {/* dexgraph */}
                    <div className="w-[364px] h-[171px] bg-[#EBEBEB] ">

                    </div>

                    <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>First Crypto President</h1>
                    <h1 className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%] opacity-50`}>$FCP</h1>

                    <div className="flex flex-row gap-[6px] w-[364px]">
                        <div className="py-[12px] pl-[2px] items-start rounded-xl h-[36px]  flex-1 bg-[#EBEBEB]">
                            <h1 className={`${geologica.className} text-center font-normal text-[12px] leading-[12px] tracking-[0%]`}>Raydium V1 - From Contract</h1>
                        </div>
                        <Image
                            src="/globeFrame.svg"
                            alt='internet'
                            width={36}
                            height={36}
                        />
                        <Image
                            src="/sendFrame.svg"
                            alt='send'
                            width={36}
                            height={36}
                        />
                        <Image
                            src="/twitterFrame.svg"
                            alt='twitter'
                            width={36}
                            height={36}
                        />

                    </div>

                    <div className=" flex flex-col h-[106px] w-[364px] p-[12px] gap-[24px] bg-[#ebebeb]">
                        <div className="w-[340px] h-[38px] gap-[4px] flex flex-col">
                            <h1 className={`${geologica.className} font-normal text-[24px] leading-[24px] tracking-[0%]`}>$1.98</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-green-500`}>+20%</h1>
                        </div>
                        <div className="flex flex-row w-[233px] gap-[18px]">
                            <div className="flex flex-row w-[83px] h-[20px] gap-[3px]">
                                <div className="w-[44px] bg-black p-[4px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[12px] leading-[12px] tracking-[0%] text-white`}>MCAP</h1>
                                </div>
                                <div className="w-[44px] p-[2px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%]`}>175k</h1>
                                </div>

                            </div>
                            <div className="flex flex-row w-[83px] h-[20px] gap-[3px]">
                                <div className="w-[44px] bg-black p-[4px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[12px] leading-[12px] tracking-[0%] text-white`}>SUP</h1>
                                </div>
                                <div className="w-[44px] p-[2px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%]`}>1B</h1>
                                </div>

                            </div>
                            <div className="flex flex-row w-[83px] h-[20px] gap-[3px]">
                                <div className="w-[44px] bg-black p-[4px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[12px] leading-[12px] tracking-[0%] text-white`}>LIQ</h1>
                                </div>
                                <div className="w-[44px] p-[2px] rounded-[6px]">
                                    <h1 className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%]`}>51k</h1>
                                </div>

                            </div>

                        </div>
                    </div>

                    <BuySellSet />

                    <VolMarkers />

                    <FirstCrypto />

                    <TopHolds />

                    <div className="w-[364px] flex flex-row h-[48px] p-3 gap-3 bg-[#ebebeb] rounded-[12px]">
                        <div className="w-[24px] h-[24px] gap-2.5">
                           <Image
                           src="/RiskFlag.svg" alt="risk" width={13.71} height={20}
                           /> 
                        </div>
                        <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>
                           Low Risk
                        </h1>

                    </div>


                    



                </div>


            </div>
        </div>

    )
}

export default page