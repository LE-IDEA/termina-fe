
import React from 'react';
import { ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Getting started with a Wallet",
      description: "When you sign up with Termina, you automatically receive a wallet as part of your account, no extra steps needed. It's a non-custodial wallet, meaning you have full control over your assets at all times."
    },
    {
      number: "02",
      title: "Choose Tokens to Swap",
      description: " Select your tokens, catch the alpha, and swap effortlessly with Termina’s fast, clean UI. Memecoin swaps feel like a breeze, with transactions processed instantly thanks to our gas abstraction technology."
    },
    {
      number: "03",
      title: "Review and Confirm",
      description: "Check the exchange rate and preview of your transaction. Confirm when you're ready and track your PnL."
    },
    {
      number: "04",
      title: "Convert Your Earnings to fiat",
      description: "Convert your earnings to fiat quickly and easily on termina's fast, secure solution for seamless crypto-to-fiat transactions."
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Degening made simple in just a few steps
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border border-black flex items-center justify-center text-black font-bold text-xl">
                {step.number}
              </div>

              
              <div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block ml-8 text-gray-300">
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
