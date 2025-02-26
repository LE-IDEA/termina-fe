"use client"
import Image from "next/image"
import { Geologica } from "next/font/google";
import Link from "next/link";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });


const BuySellSet = () => {
    return (
        <div className=" flex flex-row gap-[12px] justify-between  md:flex-col md:gap-[18px]">
            <Link href="/swap">
                <button className=" flex flex-row gap-[10px] p-[12px] sm:px-5 md:px-4 rounded-2xl bg-[#ebebeb] md:bg-[#47B105]">
                    <Image src="/carretDown.svg" alt='pay' width={24} height={24}      />
                    <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>Buy</h1>
                </button>
            </Link>

            <Link href="/swap">
                <button className=" flex flex-row gap-[10px] p-[12px] sm:px-5 md:px-4  rounded-2xl bg-[#ebebeb] md:bg-[#AC1717]">
                <Image  src="/carretDown.svg"  alt='pay'  width={24}  height={24} />
                <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>Sell</h1>
            </button>
            </Link>

            <button title="Settings" className="md:hidden">
                <Image src="/blueSettings.svg" alt='set it' width={48} height={48} />
            </button>


        </div>
    )
}

export default BuySellSet