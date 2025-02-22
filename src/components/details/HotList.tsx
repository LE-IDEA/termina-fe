import Image from "next/image"
import { Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const HotList = () => {
    return (
        <div className=" flex flex-col w-[364px] h-[192px] gap-[6px]">
            {/* 1st */}
            <div className="w-[364px] h-[60px] p-[12px] gap-[10px] rounded-[18px] bg-[#ebebeb] flex flex-row">
                <Image src="/listing.png" alt='Add' width={32} height={32} />
                <div className="w-[182px] h-[30px] flex flex-col">
                    <h1 className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-[0%] text-black`}>dev.fun annt</h1>
                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>devann</h1>
                </div>
                <div className="flex flex-col w-[106px] h-[36px] justify-between">
                    <div className="flex flex-row gap-[6px] items-center justify-end"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[8px] tracking-[0%]`}>4.5m</h1>
                    </div>
                    <div className="w-[106px] h-[10px] gap-[12px] flex flex-row justify-between">
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.00SOL</h1>
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#FF0004]`}>-20%</h1>
                    </div>
                </div>

            </div>

            {/* 2nd */}
            <div className="w-[364px] h-[60px] p-[12px] gap-[10px] rounded-[18px] bg-[#ebebeb] flex flex-row">
                <Image src="/listing.png" alt='Add' width={32} height={32} />
                <div className="w-[182px] h-[30px] flex flex-col">
                    <h1 className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-[0%] text-black`}>dev.fun annt</h1>
                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>devann</h1>
                </div>
                <div className="flex flex-col w-[106px] h-[36px] justify-between">
                    <div className="flex flex-row gap-[6px] items-center justify-end"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[8px] tracking-[0%]`}>4.5m</h1>
                    </div>
                    <div className="w-[106px] h-[10px] gap-[12px] flex flex-row justify-between">
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.00SOL</h1>
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#FF0004]`}>-20%</h1>
                    </div>
                </div>

            </div>

            {/* 3rd */}
            <div className="w-[364px] h-[60px] p-[12px] gap-[10px] rounded-[18px] bg-[#ebebeb] flex flex-row">
                <Image src="/listing.png" alt='Add' width={32} height={32} />
                <div className="w-[182px] h-[30px] flex flex-col">
                    <h1 className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-[0%] text-black`}>dev.fun annt</h1>
                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>devann</h1>
                </div>
                <div className="flex flex-col w-[106px] h-[36px] justify-between">
                    <div className="flex flex-row gap-[6px] items-center justify-end"> <Image src="/MCAP.svg" alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[8px] tracking-[0%]`}>4.5m</h1>
                    </div>
                    <div className="w-[106px] h-[10px] gap-[12px] flex flex-row justify-between">
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.00SOL</h1>
                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#FF0004]`}>-20%</h1>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HotList