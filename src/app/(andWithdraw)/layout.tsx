import Image from "next/image"
import { Geologica, Instrument_Serif } from "next/font/google";
const geologica = Geologica({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <main className="flex flex-col pt-[24px] px-[24px] pb-[92px]  w-[412px] h-screen">
      <div className="flex gap-2 w-[412px] h-[68px]">
        <Image src="/carretLeft.svg" alt='Home' width={20} height={20} />
      </div>

      <div className="flex flex-col items-start justify-between gap-12 w-[364px] " >
        {children}

        <div className="flex flex-row mx-auto w-[239px] h-[12px]">
          <Image src="/circleDetail.svg" alt='Home' width={12} height={12} />
          <h1 className={`${geologica.className} font-medium text-[8px] leading-[8px] tracking-[0%]`}>Limited to USDC(USDC) on the Solana(SOL) network</h1>
        </div>

      </div>



    </main>
  )
}
