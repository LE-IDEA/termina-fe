'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Twitter, MessageCircle, Menu, X } from "lucide-react";
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <img
            src="/images/Termina-logo.png" 
            alt="Termina Logo"
            className="h-7 w-auto object-contain"
          />
          </div>

          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-gray-600 transition-colors">
              How It Works
            </a>
            <div className="flex items-center space-x-3">
              <a 
                href="https://twitter.com/use_Termina" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://t.me/+EJaqYezHnQs3YjM0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
              <a href="https://app.termina.fun" target="_blank" rel="noopener noreferrer">
                <Button className="ml-2 bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </a>

            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a 
              href="#features" 
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://twitter.com/use_Termina" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://t.me/+EJaqYezHnQs3YjM0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
            <a href="https://app.termina.fun" target="_blank" rel="noopener noreferrer">
                <Button className="ml-2 bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;