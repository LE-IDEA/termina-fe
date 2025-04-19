'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-rainbow-gradient opacity-10"></div>
          
          <div className="relative p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Degening?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
              Be part of the users who are already enjoying simple, gas-free token swaps with Termina.
            </p>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 py-6 px-8"
              onClick={() => window.location.href = 'https://app.termina.fun'}
            >
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
