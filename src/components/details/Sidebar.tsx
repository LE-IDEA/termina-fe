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
    },
    {
      imgURL: "/SwapSwap.svg",
      route: "/swap",
      id: 3,
    },
    {
      imgURL: "/DiamondSwap.svg",
      route: "/",
      id: 4,
    },
    {
      imgURL: "/WatchSwap.svg",
      route: "/",
      id: 5,
    },
    {
      imgURL: "/UserFrame.svg",
      route: "/",
      id: 6,
    }
  ];

  return (
    <div className='py-12 px-9 md:px-6 bg-[#ebebeb] flex flex-col   rounded-[36px] items-start gap-12 pb-60'>
      <Image src="/Terminapng.png" alt='Home' width={60} height={60} className="mx-auto" />

      {
        downNavLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <div className="flex flex-col gap-12 mx-auto" >
              <a href={item.route} key={item.id} className="  ">
                <Image src={item.imgURL} alt='Home' width={28} height={28} />
              </a>
            </div>
          )
        })
      }
    </div>
  )
}

export default Sidebar