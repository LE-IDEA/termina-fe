// app/layout.tsx
import '@/styles/globals.css'// or '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Termina – Simple DeFi with Gas Abstraction',
  description:
    'Onboard into the world of DeFi with our simple UX and gas abstraction technology.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
