import Image from "next/image";
import { Geologica } from "next/font/google";
import Link from "next/link";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col pt-[24px] px-[24px] pb-[92px]  h-full">
      <Link href="/">
        <div className="flex gap-2  ">
          <Image src="/carretLeft.svg" alt="Home" width={20} height={20} />
        </div>
      </Link>

      <div className="flex flex-col items-center justify-between gap-12 py-10 sm:py-16 md:py-28 ">
        {children}

        <div className="flex flex-row mx-auto gap-3">
          <Image src="/circleDetail.svg" alt="Home" width={12} height={12} />
          <h1
            className={`${geologica.className} font-medium text-[8px] leading-[8px] text-center my-auto tracking-[0%]`}
          >
            Limited to USDC(USDC) on the Solana(SOL) network
          </h1>
        </div>
      </div>
    </main>
  );
}
