import DownNav from "@/components/details/DownNav"
import Sidebar from "@/components/details/Sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <main className=" overflow-auto hide-scrollbar relative h-screen px-[24px] py-6 lg:py-12 lg:pl-20 md:px-5 lg:px-30 xl:px-38 2xl:ml-48">
      
      <div className="md:flex md:flex-row md:gap-4 mx-auto ">
          <div className='hidden md:block '>
            <Sidebar />
          </div>
          {children}
        
      </div>
      <DownNav />
    </main>
  )
}