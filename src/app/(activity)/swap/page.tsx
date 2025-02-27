import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
import SwapSlippage from "@/components/details/SwapSlippage";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });



const page = () => {
    return (
        <section className=" md:flex md:flex-row md:gap-4 xl:mx-">
            <div className="  gap-[24px] flex flex-col p-2 sm:px-7 md:px-22 xl:w-[600px]">
                <div className="flex flex-row  h-[36px] justify-between md:hidden">
                    <Image
                        src="/prevCarret.svg"
                        alt='prev'
                        width={36}
                        height={36}
                    />

                    <Image
                        src="/Settings.svg"
                        alt='watchout'
                        width={36}
                        height={36}
                    />
                </div>

                {/* solanabox */}
                <div className=" h-[178px] gap-[6px] rounded-[12px] border-[1px] bg-[#ebebeb]">
                    {/* $$ */}
                    <div className="flex flex-col  h-[140px] p-[10px] rounded-[12px] bg-white border-[3px]">
                        {/* solana */}
                        <div className="flex flex-row justify-between h-[48px] p-[6px] gap-[10px]">
                            <div className="flex flex-row  h-[48px] gap-[10px]">
                                <Image src="/Solana.svg" alt='token image' width={32} height={32} className="my-auto" />
                                <div className="flex flex-col h-[36px] gap-[6px] my-auto">
                                    <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-normal`}>Solana</h1>
                                    <h1 className={` ${geologica.className} font-normal text-[10px] leading-[10px] tracking-normal opacity-50`}>Sol</h1>
                                </div>
                            </div>
                            <div className="">
                                <h1 className={`${instrumentSerif.className} font-normal text-4xl leading-none tracking-normal text-right`}>2</h1>
                            </div>
                        </div>
                        {/* interswap */}
                        <button className="items-center justify-center" title="Interswap">
                            <Image src="/Interswap.svg" alt='Interchnage' width={24} height={24} className="mx-auto" />
                        </button>
                        {/* justchill */}
                        <div className="flex flex-row justify-between h-[48px] p-[6px] gap-[10px]">
                            <div className="flex flex-row  h-[48px] gap-[10px]">
                                <Image src="/Solana.svg" alt='token image' width={32} height={32} className="my-auto" />
                                <div className="flex flex-col h-[36px] gap-[6px] my-auto">
                                    <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-normal`}>Solana</h1>
                                    <h1 className={` ${geologica.className} font-normal text-[10px] leading-[10px] tracking-normal opacity-50`}>Sol</h1>
                                </div>
                            </div>
                            <div className="">
                                <h1 className={`${instrumentSerif.className} font-normal text-4xl leading-none tracking-normal text-right`}>2</h1>
                            </div>
                        </div>
                    </div>

                    <div className=" flex flex-row  h-[32px] p-[10px] justify-between rounded-br-[12px] rounded-bl-[12px]">
                        <div className=" flex flex-row items-center w-[56px] h-[12px] gap-[4px]">
                            <Image src="/circleDetail.svg" alt='detail' width={12} height={12} />
                            <div className="flex flex-row my-auto h-[8px] gap-[4px]">
                                <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>fee:</h1>
                                <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>0.5%</h1>
                            </div>
                        </div>
                        <div className="flex flex-row h-[8px] gap-[4px] my-auto">
                            <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>Total:</h1>
                            <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>1.95sol ≈ ₦400,356</h1>
                        </div>
                    </div>

                </div>

                {/* confirm button  */}
                <button className=" h-[55px] gap-[10px] rounded-[12px] pt-[18px] pr-[24px] pb-[18px] pl-[24px] bg-[#0077FF]" title="Confirm Swap">
                    <h1 className={`${geologica.className} text-white`}>Confirm</h1>
                </button>

                {/* view cards */}
                <div className="flex flex-row h-[64px] gap-[10px] rounded-[18px] p-[12px] bg-[#ebebeb]">
                    <Image src="/Devanin.svg" alt='Interchnage' width={40} height={40} className="" />
                    <div className="w-[290px] h-[23px]"> <h1 className={`${geologica.className} text-black font-medium text-custom-size leading-[22.5px] tracking-normal`}>Devanin </h1> </div>
                </div>
                <div className="flex flex-row  h-[64px] gap-[10px] rounded-[18px] p-[12px] bg-[#ebebeb]">
                    <Image src="/Devanin.svg" alt='Interchnage' width={40} height={40} className="" />
                    <div className="w-[290px] h-[23px]"> <h1 className={`${geologica.className} text-black font-medium text-custom-size leading-[22.5px] tracking-normal`}>Devanin </h1> </div>
                </div>



            </div>
            <div className="hidden md:block">
                <SwapSlippage />
            </div>
        </section>
    )
}

export default page