import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HotRecent = () => {
    const recent = [
        { imgURL: "/listing.png", name: "dev.fun annt", author: "devann", id: 1 },
        { imgURL: "/listing.png", name: "dev.fun annt", author: "devann", id: 2 },
        { imgURL: "/listing.png", name: "dev.fun annt", author: "devann", id: 3 },
        { imgURL: "/listing.png", name: "dev.fun annt", author: "devann", id: 4 },
    ]

    return (
        <div className="w-[364px] flex flex-col h-[213px] gap-[6px] ">

            <div className=" flex flex-row w-[364px] h-[15px] justify-between pr-[6px] pl-[6px]">
                <div className="flex flex-row items-center justify-between  w-[50px] h-[15px]">
                    <h1 className={`${instrumentSerif.className}`}>Recent</h1>
                    <Image src="/Clock.svg" alt='prev' width={12} height={12} />
                </div>
                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>
                    see more
                </h1>
            </div>

            <div>

                {/* 1st */}
                {recent.slice(0, 3).map((item) => {
                    return (
                        <div key={item.id} className="w-[364px] h-[60px] p-[12px] gap-[10px] rounded-[18px] bg-[#ebebeb] flex flex-row">
                            <Image src={item.imgURL} alt='Add' width={32} height={32} />
                            <div className="w-[182px] h-[30px] flex flex-col">
                                <h1 className={`${geologica.className} font-normal text-[20px] leading-[20px] tracking-[0%] text-black`}>{item.name}</h1>
                                <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>{item.author}</h1>
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
                    )
                })}
            </div>
        </div>
    )
}

export default HotRecent