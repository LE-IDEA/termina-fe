import DownNav from "@/components/details/DownNav"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <main className="relative items-center justify-center p-[24px] w-[412px]">
      {children}

      <DownNav />
    </main>
  )
}
// async function sleep(millis) {
//   setTimeout(() => {
//     console.log('big dog')
//   }, millis)
// }
// sleep(100);