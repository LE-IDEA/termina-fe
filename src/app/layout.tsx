import type { Metadata } from "next";
import "./globals.css";
import { ReownProvider } from '../providers/reownProvider';



export const metadata: Metadata = {
  title: "Termina",
  description: "Gas abstraction with improved UI for degening experience.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
          <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  );
}
