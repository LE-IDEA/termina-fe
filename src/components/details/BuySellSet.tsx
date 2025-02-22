"use client"
import Image from "next/image"
import { Geologica } from "next/font/google";
import Link from "next/link";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });


const BuySellSet = () => {
    return (
        <div className="h-[48px] w-[364px] flex flex-row gap-[12px] ">
            <Link href="/swap">
                <button className="w-[146px] flex flex-row gap-[10px] p-[12px] rounded-2xl bg-[#ebebeb]">
                    <Image
                        src="/carretDown.svg"
                        alt='pay'
                        width={24}
                        height={24}
                    />
                    <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>Buy</h1>
                </button>
            </Link>

            <Link href="/swap">
            <button className="w-[146px] flex flex-row gap-[10px] p-[12px] rounded-2xl bg-[#ebebeb]">
                <Image
                    src="/carretDown.svg"
                    alt='pay'
                    width={24}
                    height={24}
                />
                <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-[0%]`}>Buy</h1>
            </button>
            </Link>

            <button title="Settings">
                <Image
                    src="/blueSettings.svg"
                    alt='set it'
                    width={48}
                    height={48}
                />
            </button>


        </div>
    )
}

export default BuySellSet