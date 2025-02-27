import DownNav from "@/components/details/DownNav"
import Sidebar from "@/components/details/Sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <main className="relative h-screen px-[24px] py-6 lg:py-12 lg:pl-20 lg:px-30 xl:px-38">
      
      <div className="md:flex md:flex-row md:gap-4 mx-auto 2xl:ml-20">
          <div className='hidden md:block '>
            <Sidebar />
          </div>
          {children}
        
      </div>
      <DownNav />
    </main>
  )
}