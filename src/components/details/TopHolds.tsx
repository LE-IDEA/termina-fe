import Image from "next/image";
import { Geologica } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

const TopHolds = () => {
    return (
        <div className="flex flex-col bg-[#ebebeb] w-[364px] h-[160px] p-3 gap-6 rounded-[12px]">
            <h1 className={`${geologica.className} font-bold text-[20px] leading-[20px] tracking-[0%]`}>
                Top Holds
            </h1>
            <div className="flex flex-col w-[340px] h-[56px] gap-2.5">
                <div className="flex flex-row w-[340px] h-[12px] gap-[4.5px] justify-between">
                    <h1 className="font-geologica font-medium text-[12px] leading-[12px] tracking-[0%]">
                        Creator
                    </h1>
                    <div className="flex flex-row w-[162px] h-[12px] gap-[12px]">
                        <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                            F4aLc3iBr...3jOXwv53F7
                        </h1>
                        <Image src="/Copy" alt="copy" width={12} height={12} />

                    </div>

                </div>
                <div className="flex flex-row w-[340px] h-[12px] gap-[4.5px] justify-between">
                    <h1 className="font-geologica font-medium text-[12px] leading-[12px] tracking-[0%]">
                        Creator
                    </h1>
                    <div className="flex flex-row w-[162px] h-[12px] gap-[12px]">
                        <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                            F4aLc3iBr...3jOXwv53F7
                        </h1>
                        <Image src="/Copy" alt="copy" width={12} height={12} />

                    </div>

                </div>
                <div className="flex flex-row w-[340px] h-[12px] gap-[4.5px] justify-between">
                    <h1 className="font-geologica font-medium text-[12px] leading-[12px] tracking-[0%]">
                        Creator
                    </h1>
                    <div className="flex flex-row w-[162px] h-[12px] gap-[12px]">
                        <h1 className={`${geologica.className} font-medium text-[12px] leading-[12px] tracking-[0%]`}>
                            F4aLc3iBr...3jOXwv53F7
                        </h1>
                        <Image src="/Copy" alt="copy" width={12} height={12} />

                    </div>

                </div>

            </div>

            <div className="w-[70px] h-[12px] gap-1 flex flex-row">
                <Image src="/MoreCircle" alt="see more" width={12} height={12} />
                <h1 className="font-geologica font-medium text-[12px] leading-[12px] tracking-[0%]">
                    See More
                </h1>
            </div>



        </div>
    )
}

export default TopHolds