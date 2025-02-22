"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const downNavLinks = [
    {
        imgURL: "HomeSwap.svg",
        route: "/",
        id: 1,
    },
    {
        imgURL: "SwapSwap.svg",
        route: "/swap",
        id: 2,
    },
    {
        mgURL: "/DiamondSwap.svg",
        route: "/transaction-history",
        id: 3,
    },
    {
        imgURL: "/WatchSwap.svg",
        route: "/payment-transfer",
        id: 4,
    }
];
const DownNav = () => {
    const pathname = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 bg-[#ebebeb] w-[412px] h-[96px] flex justify-between rounded-tl-[60px] rounded-tr-[60px] pt-[36px] pr-[48px] pb-[36px] pl-[48px]">
            {
                downNavLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    return (
                        <a href={item.route} key={item.id} >
                            <Image src={item.imgURL} alt='Home' width={24} height={24} />
                        </a>
                    )
                })
            }


        </nav>
    )
}



export default DownNav