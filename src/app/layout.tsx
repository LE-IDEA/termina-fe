import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/SideBar";
import DownNav from "@/components/details/DownNav";
import PrivyProviderWrapper from "@/providers/privy-provider";

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
      <body className={`bg-gray-50 antialiased`}>
        <QueryProvider>
          <PrivyProviderWrapper>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 lg:ml-[220px] md:ml-[80px]">
                {children}
              </main>
             
              <Toaster />
              <DownNav/>
            </div>
          </PrivyProviderWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
