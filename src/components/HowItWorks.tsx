
import React from 'react';
import { ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Connect your crypto wallet with a single click. We support most popular wallets."
    },
    {
      number: "02",
      title: "Choose Tokens to Swap",
      description: "Select the tokens you want to swap from our extensive list of supported cryptocurrencies."
    },
    {
      number: "03",
      title: "Review and Confirm",
      description: "Check the exchange rate and preview of your transaction. Confirm when you're ready."
    },
    {
      number: "04",
      title: "Enjoy Seamless Swapping",
      description: "Your transaction is processed instantly with our gas abstraction technology."
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
