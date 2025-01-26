"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from 'lucide-react';
import { useState } from "react";

interface NavBarProps {
  isHome?: boolean;
}

export default function NavBar({ isHome = true }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-11/12 md:max-w-6xl mx-auto">
      <nav className={`flex items-center justify-between p-4 px-6 mt-4 md:mt-6 border ${isOpen? "rounded-t-[36px]": "rounded-[36px]"}  shadow-md`}>
       
        <Image src="/Termina-logo.png"  alt="" width={120} height={100}/>

        <div className="flex items-center space-x-12">
          <Link
            href="https://x.com/use_Termina/status/1883078030907908389"
            className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
          >
            About
          </Link>

          <Link
            href="#"
            className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
          >
            Features
          </Link>

          <Link
            href="#"
            className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
          >
            White Paper
          </Link>
{/* 
          <Link
            href="https://github.com/leeftk/leeftk/blob/main/README.md"
            target="blank"
            className="hidden md:block"
          >
            <Button className="bg-blue-600 rounded-xl p-6 hover:bg-blue-800 hover:text-white">
              Create Wallet
            </Button>
          </Link> */}
        </div>

        {/* <MobileNav /> */}
        <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute w-11/12 mx-auto top-[80px] left-0 right-0 bg-white border-b rounded-b-[36px] shadow-md p-4 space-y-4">
          <Link
            href="https://x.com/use_Termina/status/1883078030907908389"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          
          <Link
            href="#"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>

          <Link
            href="#"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            White Paper
          </Link>
        </div>
      )}
    </div>
      </nav>
    </div>
  );
}
