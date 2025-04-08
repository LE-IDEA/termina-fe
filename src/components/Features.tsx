
import React from 'react';
import { Wallet, TrendingUpDown, Shuffle, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Ramp System",
      description: "Access an unlimited supply of stablecoins and fiat from our trusted ramp partners, simplifying your financial transactions.",
      icon: <TrendingUpDown className="h-10 w-10 text-pink-500" />
    },
    {
      title: "Seamless Token Swaps",
      description: "Forget about managing gas fees and complex UIs. We handle the complexity so you can focus on trading and swap between any tokens with just a few clicks.",
      icon: <Shuffle className="h-10 w-10 text-blue-500" />
    },
    {
      title: "Beginner Friendly",
      description: "Designed specifically for newcomers to the crypto world. No jargon, just easy degening.",
      icon: <Wallet className="h-10 w-10 text-green-500" />
    },
    {
      title: "Enhanced Security",
      description: "Your assets remain secure with our non-custodial approach and security-first design.",
      icon: <Shield className="h-10 w-10 text-purple-500" />
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Degen Smarter, Not Harder</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform simplifies the DeFi experience with powerful features designed for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="gradient-border p-6 rounded-xl">
              <div className="mb-4 p-2 rounded-full bg-white w-16 h-16 flex items-center justify-center shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
