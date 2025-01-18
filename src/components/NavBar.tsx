"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface NavBarProps {
  isHome?: boolean;
}

export default function NavBar({ isHome = true }: NavBarProps) {
  return (
    <div className=" md:max-w-6xl mx-auto">
      <nav className="flex items-center justify-between p-4 px-6 mt-4 md:mt-6 border rounded-[36px] shadow-md">
       
        <Image src="/Termina-logo.png"  alt="" width={120} height={100}/>

        <div className="flex items-center space-x-12">
          <Link
            href="/"
            className="font-medium cursor-pointer hover:text-blue-600"
          >
            About
          </Link>

          <Link
            href="/blog"
            className="hidden md:block hover:underline font-medium cursor-pointer hover:text-blue-600"
          >
            Features
          </Link>

          <Link
            href="/blog"
            className="hidden md:block hover:underline font-medium cursor-pointer hover:text-blue-600"
          >
            White Paper
          </Link>

          <Link
            href="https://github.com/leeftk/leeftk/blob/main/README.md"
            target="blank"
            className="hidden md:block"
          >
            <Button className="bg-blue-600 rounded-xl p-6 hover:bg-blue-800 hover:text-white">
              Create Wallet
            </Button>
          </Link>
        </div>

        {/* <MobileNav /> */}
      </nav>
    </div>
  );
}
