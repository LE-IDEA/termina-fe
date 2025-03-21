"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const downNavLinks = [ 
    { imgURL: "/HomeSwap.svg", route: "/spot", id: 2, name: "Home"},
    { imgURL: "/SwapSwap.svg", route: "/swap", id: 3, name: "Swap" },
    { imgURL: "/DiamondSwap.svg", route: "/spot", id: 4, name: "Spot"},
    { imgURL: "/WatchSwap.svg", route: "/waitlist", id: 5, name: "Watchlist"},
    { imgURL: "/UserFrame.svg", route: "/", id: 6, name: "Settings"}
  ];

  return (
      <nav className='hidden mx-auto md:py-12 md:px-7 pmd:px-9 lgg:p-8 xl:pr-16 bg-[#ebebeb] md:flex md:flex-col rounded-[36px] items-center xl:items-start  gap-12 h-[620px]'>
      <Image src="/Terminapng.png" alt='Home' width={60} height={60} className="xl:hidden" />
      <Image src="/Termina-logo.png" alt='Home' width={100} height={60} className="hidden xl:block" /> 

      {
        downNavLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
              <a href={item.route} key={item.id} className="  ">
                <div className="flex flex-row gap-3  justify-between">
                  <Image src={item.imgURL} alt='Home' width={28} height={28} />
                <h1 className={`hidden xl:block`}> {item.name}</h1>
                </div>
              </a>
          )
        })
      }
      </nav>
  )
}

export default Sidebar