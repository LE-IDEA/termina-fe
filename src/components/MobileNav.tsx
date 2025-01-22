"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute w-11/12 mx-auto top-[90px] left-0 right-0 bg-white border-b rounded-b-[36px] shadow-md p-4 space-y-4">
          <Link
            href="/"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          
          <Link
            href="/blog"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>

          <Link
            href="/blog"
            className="block py-2 font-medium hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            White Paper
          </Link>

          <Link
            href="https://github.com/leeftk/leeftk/blob/main/README.md"
            target="blank"
            className="block"
            onClick={() => setIsOpen(false)}
          >
            <Button className="w-full bg-blue-600 rounded-xl p-6 hover:bg-blue-800 hover:text-white">
              Create Wallet
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileNav;