import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
import { Item } from "@radix-ui/react-select";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HottestCard = () => {
    const hottestCards = [
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
    ];

    return (
        <div className="overflow-hidden flex flex-col gap-[6px]  w-[362px] ssm:w-[460px] sm:w-[572px] md:w-[302px]  pmd:w-[362px] xl:w-[412px] md:h-[238px] "> 

            <div className='flex flex-row'>
                <h1 className={`font-normal text-[15px] leading-[15px] tracking-[0%] text-center ${instrumentSerif.className}`}>Hottest Daily</h1>
                <Image src="/bolt.svg" alt='hot' width={12} height={12} />
            </div>
            <div className="flex  flex-row gap-[6px] overflow-x-auto  hide-scrollbar rounded-xl">

                {
                    hottestCards.map((card, index) => (
                        // <div key={index} className="flex flex-col gap-[6px] w-[182px] p-[6px] rounded-[12px] bg-[#ebebeb] ">

                        //     <div className="flex flex-col gap-[6px]">
                        //         <Image src={card.imgURL} alt='prev' width={170} height={95} className="w-[170px] h-[95px]" />
                        //         <h1 className={`${geologica.className} font-medium text-[20px] leading-[100%] tracking-[0%] align-middle truncate`}>First Crypto President</h1>
                        //         <div className="flex flex-row justify-between">
                        //             <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] `}>FCP</h1>
                        //             <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] `}>0.0031 sol</h1>
                        //             <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] text-[#47B105]`}>+20%</h1>
                        //         </div>
                        //     </div>

                        //     <div className="flex flex-row gap-[10px] pt-10 space-x-4 md:overflow-auto hide-scrollbar">

                        //         <div className="flex flex-row ">
                        //             <Image src={card.mcapImg} alt='mcap' width={32} height={16} />
                        //             <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5M</h1>
                        //         </div>

                        //         <div className="flex flex-row">
                        //             <Image src={card.supImg} alt='sup' width={32} height={16} />
                        //             <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1>
                        //         </div>

                        //         <div className="flex  flex-row">
                        //             <Image src={card.liqImg} alt='liq' width={32} height={16} />
                        //             <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1>
                        //         </div>
                        //     </div>
                        // </div>

                        <div key={index} className="p-[6px] gap-[6px] rounded-[12px] bg-[#ebebeb] flex flex-col md:w-[112px] xl:w-[160px] pmd:gap-0 md:h-[217px] hide-overflow md:justify-between">
                            <div className="flex flex-col rounded-[12px] gap-[6px] w-[170px] md:w-full xl:w-full ">
                                <Image src={card.imgURL} alt='prev' width={170} height={95.38} />
                                <div className=" flex flex-col  gap-[6px]">
                                    <h1 className={`${geologica.className} truncate font-medium text-[20px] leading-[100%] tracking-[0%]`}>
                                        {card.name}
                                    </h1>
                                    <div className="gap-[6px] md:gap-0 md:justify-between flex flex-row justify-between">
                                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] opacity-50`}>{card.symbol}</h1>
                                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] opacity-50`}>{card.price}</h1>
                                        <h1 className={`${geologica.className} font-normal text-[10px] leading-[100%] tracking-[0%] text-[#47B105]`}>{card.change}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row md:w-full gap-[10px]  space-x-4 md:overflow-auto hide-scrollbar">

                                <div className="flex flex-row  md:gap-1">
                                     <Image src={card.mcapImg} alt='mcap' width={32} height={16} />
                                    <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5M</h1>
                                </div>

                                <div className="flex flex-row  md:gap-1">
                                    <Image src={card.supImg} alt='sup' width={32} height={16} />
                                    <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1>
                                </div>

                                <div className="flex  flex-row md:gap-1">
                                     <Image src={card.liqImg} alt='liq' width={32} height={16} />
                                    <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>

    )
}

export default HottestCard