
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient -z-10 opacity-60"></div>
      
      <div className="container px-6 mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 relative mb-8 animate-float">
            <img 
              src="/85df3af3-77a7-4b41-a270-485dc7e2c07f.png" 
              alt="Termina Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600">
            Easy Trading Of Memecoins <br /> let's get started with abstraction
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          Trade memecoins on Solana effortlessly. Swap meme tokens with SPL for gas in a few clicks no hassle, just safe, secure, and intuitive.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://app.termina.fun" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 py-6 px-8">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
