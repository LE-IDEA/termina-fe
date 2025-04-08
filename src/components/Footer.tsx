
import React from 'react';
import { Twitter, MessageCircle, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <img 
              src="public\Termina-logo.png" 
              alt="Termina Logo" 
              className="w-16 h-16 object-contain"
            />
            
          </div>
          
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              Home
            </a>
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">
              How It Works
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              Privacy
            </a>
          </div>
          
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a 
              href="https://twitter.com/use_Termina"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://t.me/+EJaqYezHnQs3YjM0"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <MessageCircle size={20} />
            </a>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Termina. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Built with ❤️ for the DeFi community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;