import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
import { Item } from "@radix-ui/react-select";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const HottestCard = () => {
    const hottestCards = [
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg:"/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
        { imgURL: "/Trump.png", name: "First Crypto", symbol: "FCP", price: "0.031 SOL", change: "0.20%", mcapImg: "/MCAP.svg", supImg: "/SUP.svg", liqImg: "/LIQ.svg", mcap: "15.5m", supply: "1B", liquidity: "265k" },
    ];

    return (
        <section className="flex flex-row gap-[12px] hide-scrollbar overflow-x-auto  rounded-xl">

            {
                hottestCards.map((card, index) => (
                    <div key={index} className="p-[6px] gap-[6px] rounded-[12px] bg-[#ebebeb] flex flex-col md:w-[112px] md:h-[200px] hide-overflow md:justify-between">
                        <div className="rounded-[12px] gap-[6px] flex flex-col w-[170px] md:w-[100px] md:h-[137px] ">
                            <Image src={card.imgURL} alt='prev' width={170} height={95.38} />
                            <div className=" flex flex-col  gap-[6px]">
                                <h1 className={`${geologica.className} truncate font-medium text-[20px] leading-[20px] tracking-[0%]`}>
                                    {card.name}
                                </h1>
                                <div className="gap-[6px] flex flex-row justify-between">
                                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>{card.symbol}</h1>
                                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>{card.price}</h1>
                                    <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] text-[#47B105]`}>{card.change}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row w-[170px] h-[22px] gap-[10px] pt-[6px] md:w-[100px] md:gap-3 md:overflow-auto hide-scrollbar">
                            <div className="flex flex-row "> <Image src={card.mcapImg} alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>15.5m</h1></div>
                            <div className="flex flex-row "> <Image src={card.supImg} alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>1B</h1></div>
                            <div className="flex  flex-row"> <Image src={card.liqImg} alt='prev' width={32} height={16} /> <h1 className={`${geologica.className} my-auto font-normal text-[10px] leading-[10px] tracking-[0%]`}>265k</h1></div>
                        </div>
                    </div> 
                    
                ))

            }
        </section>


    )
}

export default HottestCard