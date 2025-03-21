import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState } from "react";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const CurrencyChange = () => {

    const currency = [
        {     imgURL: "/Nigeria.png",     id: 1,     curName: "Nigerian Naira",     curCode: "NGN" },
        {     imgURL: "/UK.png",     id: 2,     curName: "British Pounds",     curCode: "GBP"},
        {     imgURL: "/Solana.svg",     id: 3,     curName: "Solana",     curCode: "SOL"},
        {     imgURL: "/USDC.png",     id: 4,     curName: "USDC",     curCode: "USDC"}
    ];
    const [isCurr, setIsCurr] = useState(true);
    const changeCurr = () => {
    setIsCurr(!isCurr);
  }
    return (
        <>
        {
          isCurr ? (  
        <section onClick={changeCurr} className="fixed w-screen py-32 z-10 top-[0px] left-0 overflow-hidden h-screen bg-black items-center cursor-pointer bg-opacity-50">



        <div className="bg-[#ffff] flex m-auto flex-col items-center justify-between w-[292px]  p-[12px] gap-[24px] rounded-[12px]">
            {currency.map((item) => {
                return (
                    <div key={item.id} className="flex flex-row w-[268px] p-3 gap-[6px] hover:bg-[#ebebeb] rounded-[12px] ">
                        <Image src={item.imgURL} alt='Home' width={32} height={32} />
                        <div className="flex flex-col w-[230px] h-[32px] justify-between">
                            <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>{item.curName}</h1>
                            <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%] opacity-50`}>{item.curCode}</h1>
                        </div>
                    </div>
                )
            }
            )
            }
            </div>

        </section> ) : null
        }

        </>

    )
}

export default CurrencyChange