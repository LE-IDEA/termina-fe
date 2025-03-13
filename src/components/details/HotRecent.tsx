import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HotRecent = () => {
    const recent = [
        { imgURL: "/Trump.png", name: "dev.fun announcement", author: "devann", id: 1 },
        { imgURL: "/Trump.png", name: "dev.fun announcement", author: "devann", id: 2 },
        { imgURL: "/Trump.png", name: "dev.fun announcement", author: "devann", id: 3 },
        { imgURL: "/Trump.png", name: "dev.fun announcement", author: "devann", id: 4 },
    ]

    return (
        <div className="flex flex-col gap-[6px] pmd:w-[362px] xl:w-[412px]"> 

            <div className="flex flex-row justify-between pr-[6px] pl-[6px]">
                <div className="flex flex-row items-center gap-1 justify-between">
                    <h1 className={`${instrumentSerif.className}`}>Recent</h1>
                    <Image src="/Clock.svg" alt='prev' width={12} height={12} />
                </div>
                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50 my-auto`}>
                    see more
                </h1>
            </div>



            {/* 1st */}
            {recent.slice(0, 3).map((item) => {
                return (

                    <div key={item.id} className="p-[12px] rounded-[18px] bg-[#ebebeb] gap-[10px] flex flex-row  justify-between">
                        <div className="gap-[10px] flex flex-row">
                            <Image src={item.imgURL} alt='Add' width={32} height={32} className="w-[32px] h-[32px]" />
                            <div className="flex flex-col max-w-[162px]">
                                <h1 className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-[0%] text-black truncate`}>{item.name}</h1>
                                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>{item.author}</h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-row gap-[6px] items-center justify-end">
                                <Image src="/MCAP.svg" alt='prev' width={32} height={16} />
                                <h1 className={`${geologica.className} my-auto font-normal text-[20px] leading-[8px] tracking-[0%]`}>4.5m</h1>
                            </div>
                            <div className="gap-[12px] flex flex-row justify-between">
                                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>0.0008SOL</h1>
                                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#FF0004]`}>-20%</h1>
                            </div>
                        </div>


                    </div>
                )
            })}

        </div>
    )
}

export default HotRecent