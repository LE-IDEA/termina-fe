import BuySellSet from "@/components/details/BuySellSet";
import VolMarkers from "@/components/details/VolMarkers";
import Image from "next/image";
import { Geologica } from "next/font/google";
import FirstCrypto from "@/components/details/FirstCrypto";
import TopHolds from "@/components/details/TopHolds";
import SlippageSettings from "@/components/details/SlippageSettings";
// const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const page = () => {
  
    return (
        <div className="items-center relative justify-center p-4 ssm:px-8 sm:px-16  md:px-4 mdd:px-8 mddd:px-16 lgg:px-24 ">
            <div className="flex flex-col gap-[24px] mx-auto md:max-w-[730px] mdd:max-w-[750px] lg:max-w-[852px] xl:max-w-[920px] 2xl:max-w-[980px]">

                <div className="flex flex-row h-[36px] justify-between">
                    <Image src="/prevCarret.svg" alt='prev' width={36} height={36} />
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
                    <div className="p-[1/1] h-[171px] md:h-[303px] bg-[#EBEBEB] ">

                    </div>
                    <div className="flex flex-col gap-[12px] md:flex-row md:justify-between">

                        <div className="flex flex-col gap-[12px]">
                            <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>First Crypto President</h1>
                            <h1 className={`${geologica.className} font-normal text-[16px] leading-[16px] tracking-[0%] opacity-50`}>$FCP</h1>
                        </div>
                        <div className="flex flex-row gap-[6px] md:gap-[6px] justify-between">
                            <div className="px-[12px] flex-1 py-[6px] items-start rounded-xl bg-[#EBEBEB] md:my-auto md:py-3 md:w-[345px] lg:w-[395px] xl:">
                                <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%] md:text-[16px]`}>Raydium V1 - From Contract</h1>
                            </div>
                            <Image src="/globeFrame.svg" alt='internet' width={24} height={24} className="p-[6px] bg-[#EBEBEB] rounded-xl md:w-[48px] md:h-[48px]" />
                            <Image src="/sendFrame.svg" alt='send' width={24} height={24} className="p-[6px] bg-[#EBEBEB] rounded-xl md:w-[48px] md:h-[48px]"/>
                            <Image src="/twitterFrame.svg" alt='twitter' width={24} height={24} className=" p-[6px] bg-[#EBEBEB] rounded-xl md:w-[48px] md:h-[48px]"/>

                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-[24px] md:gap-[4px] md:justify-between rounded-[18px]">
                        
                        <div className=" flex flex-col p-[12px] gap-[24px] bg-[#ebebeb] lg:p-[18px] rounded-[18px]">
                            <div className=" h-[38px] gap-[4px] flex flex-col">
                                <h1 className={`${geologica.className} font-normal text-[24px] leading-[24px] lg:leading-[1] lg:text-[32px] tracking-[0%]`}>$1.98</h1>
                                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-green-500`}>+20%</h1>
                            </div>
                            <div className="flex flex-row gap-[18px] md:gap-9">

                                <div className="flex flex-row gap-[3px]">
                                    <div className=" bg-black p-1 rounded-[6px]">
                                        {/* text-[20px] font-normal md;leading-[1] uppercase tracking-[0] align-middle */}
                                        <h1 className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}>MCAP</h1>
                                    </div>
                                    <div className=" p-[2px] rounded-[6px]">
                                        <h1 className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}>175k</h1>
                                    </div>

                                </div>
                                <div className="flex flex-row gap-[3px]">
                                    <div className=" bg-black p-[4px] rounded-[6px]">
                                        <h1 className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}>SUP</h1>
                                    </div>
                                    <div className=" p-[2px] rounded-[6px]">
                                        <h1 className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}>1B</h1>
                                    </div>

                                </div>
                                <div className="flex flex-row gap-[3px]">
                                    <div className=" bg-black p-[4px] rounded-[6px]">
                                        <h1 className={`${geologica.className} font-normal text-[12px] lg:text-[20px] leading-[12px] lg:leading-[1] tracking-[0%] text-white`}>LIQ</h1>
                                    </div>
                                    <div className=" p-[2px] rounded-[6px]">
                                        <h1 className={`${geologica.className} font-normal text-[16px] lg:text-[24px] lg:leading-[1] leading-[16px] tracking-[0%]`}>51k</h1>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <BuySellSet />
                        <SlippageSettings />
                    </div>
                    <VolMarkers />

                    <FirstCrypto />

                    <TopHolds />

                    <div className=" flex flex-row h-[48px] p-3 gap-3 bg-[#ebebeb] rounded-[12px]">
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