"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const downNavLinks = [
    {
      imgURL: "/HomeSwap.svg",
      route: "/spot",
      id: 2,
      name: "Home"
    },
    {
      imgURL: "/SwapSwap.svg",
      route: "/swap",
      id: 3,
      name: "Swap" 
    },
    {
      imgURL: "/DiamondSwap.svg",
      route: "/spot",
      id: 4,
      name: "Spot"
    },
    {
      imgURL: "/WatchSwap.svg",
      route: "/",
      id: 5,
      name: "Watchlist"
    },
    {
      imgURL: "/UserFrame.svg",
      route: "/",
      id: 6,
      name: "Settings"
    }
  ];

  return (
    <div className='py-12 px-9 md:px-5 bg-[#ebebeb] flex flex-col  rounded-[36px] items-center xl:items-start gap-12 pb-60 xl:pr-12'>
      <Image src="/Terminapng.png" alt='Home' width={60} height={60} className="xl:hidden mx-auto " />
      <Image src="/Termina-logo.png" alt='Home' width={100} height={60} className="hidden xl:block xl:mx-auto" />

      {
        downNavLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
              <a href={item.route} key={item.id} className="  ">
                <div className="flex flex-row gap-3 items-center xl:items-start justify-between">
                  <Image src={item.imgURL} alt='Home' width={28} height={28} />
                  <h1 className="hidden xl:block xl:my-auto">{item.name}</h1>
                </div>
              </a>
          )
        })
      }
    </div>
  )
}

export default Sidebar