import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HottestCard = () => {
    return (
        <div className="flex flex-row hide-scrollbar gap-[12px]">
            <div className="w-[182px] h-[177.38px] p-[6px] gap-[6px] rounded-[12px] bg-[#ebebeb] flex flex-col">
                <div className="w-[170px] h-[137.38px] gap-[6px] flex flex-col">
                    <Image src="/Trump.png" alt='prev' width={170} height={95.38} />
                    <div className="w-[170px] flex flex-col h-[36px] gap-[6px]">
                        <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>
                            First Crypto
                        </h1>
                        <div className="w-[170px] h-[10px] gap-[6px] flex flex-row justify-between">
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>FCP</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.031 SOL</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#47B105]`}>0+20%</h1>
                        </div>
                    </div>
                </div>


                <div className="flex flex-row w-[170px] h-[22px] gap-[10px] pt-[6px]">
                    <div className="flex flex-row items-center justify-between"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5m</h1></div>
                    <div className="flex flex-row items-center justify-between"> <Image src="/SUP.svg" alt='prev' width={25} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1></div>
                    <div className="flex items-center justify-between flex-row"> <Image src="/LIQ.svg" alt='prev' width={22} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1></div>
                </div>
            </div>

            <div className="w-[182px] h-[177.38px] p-[6px] gap-[6px] rounded-[12px] bg-[#ebebeb] flex flex-col">
                <div className="w-[170px] h-[137.38px] gap-[6px] flex flex-col">
                    <Image src="/Trump.png" alt='prev' width={170} height={95.38} />
                    <div className="w-[170px] flex flex-col h-[36px] gap-[6px]">
                        <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>
                            First Crypto
                        </h1>
                        <div className="w-[170px] h-[10px] gap-[6px] flex flex-row justify-between">
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>FCP</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.031 SOL</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#47B105]`}>0+20%</h1>
                        </div>
                    </div>
                </div>


                <div className="flex flex-row w-[170px] h-[22px] gap-[10px] pt-[6px]">
                    <div className="flex flex-row items-center justify-between"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5m</h1></div>
                    <div className="flex flex-row items-center justify-between"> <Image src="/SUP.svg" alt='prev' width={25} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1></div>
                    <div className="flex items-center justify-between flex-row"> <Image src="/LIQ.svg" alt='prev' width={22} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1></div>
                </div>
            </div>

            <div className="w-[182px] h-[177.38px] p-[6px] gap-[6px] rounded-[12px] bg-[#ebebeb] flex flex-col">
                <div className="w-[170px] h-[137.38px] gap-[6px] flex flex-col">
                    <Image src="/Trump.png" alt='prev' width={170} height={95.38} />
                    <div className="w-[170px] flex flex-col h-[36px] gap-[6px]">
                        <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>
                            First Crypto
                        </h1>
                        <div className="w-[170px] h-[10px] gap-[6px] flex flex-row justify-between">
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>FCP</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.031 SOL</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#47B105]`}>0+20%</h1>
                        </div>
                    </div>
                </div>


                <div className="flex flex-row w-[170px] h-[22px] gap-[10px] pt-[6px]">
                    <div className="flex flex-row items-center justify-between"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5m</h1></div>
                    <div className="flex flex-row items-center justify-between"> <Image src="/SUP.svg" alt='prev' width={25} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1></div>
                    <div className="flex items-center justify-between flex-row"> <Image src="/LIQ.svg" alt='prev' width={22} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1></div>
                </div>
            </div>
        </div>


    )
}

export default HottestCard