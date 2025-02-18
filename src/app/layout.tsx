import type { Metadata } from "next";
import "./globals.css";
import { ReownProvider } from "../providers/reownProvider";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "react-hot-toast";

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
      <body className={`dark bg-gray-950 antialiased`}>
        <QueryProvider>
          <ReownProvider>
            <div>
              {children}
              <Toaster />
            </div>
          </ReownProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
