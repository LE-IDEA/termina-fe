"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import { useEffect, useState } from "react";
import HottestCard from "@/components/details/HottestCard";
import HotList from "@/components/details/MyTokens";
import HotRecent from "@/components/details/HotRecent";
import SearchAdd from "@/components/details/SearchAdd";
import BalanceCard from "@/components/details/BalanceCard";
import ConnectButton from "@/components/ConnectComponent";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import useFungibleTokens from "@/hooks/useFungibleTokes";
import { formatNumber } from "@/utils";
import { TrendingUpDown, Shuffle, Wallet, Shield } from "lucide-react";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

// Remove the logo from individual cards
const OnboardingCard = ({ title, description, icon, currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 h-full">
      {/* Removed logo from here */}
      
      {/* Feature content */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        <h2 className={`${instrumentSerif.className} text-2xl font-bold mb-4`}>{title}</h2>
        <p className={`${geologica.className} text-gray-600 mb-8 max-w-md`}>{description}</p>
      </div>
    </div>
  );
};

const FinalCard = ({ onConnect }) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 h-full">
      {/* Removed logo from here */}
      
      {/* Final content */}
      <div className="text-center mb-12">
        <h2 className={`${instrumentSerif.className} text-3xl font-bold mb-4`}>Get Started with Termina</h2>
        <p className={`${geologica.className} text-gray-600 mb-8 max-w-md`}>
          Connect your wallet to access all features and start managing your crypto assets.
        </p>
        {/* <button 
          onClick={onConnect}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Connect Wallet
        </button> */}
        <div className="w-full flex justify-center">
        <ConnectButton />
        </div>

      </div>
    </div>
  );
};

const Page = () => {
  const { isConnected, address } = useAppKitAccount();
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('terminaOnboardingComplete') === 'true';
    }
    return false;
  });
  const [currentStep, setCurrentStep] = useState(0);
  
  // Using your existing hook for real token data
  const { totalPrice, fungibleTokens, loading } = useFungibleTokens(isConnected ? address || "" : "");
  
  // State for dynamic price simulation
  const [dynamicPrice, setDynamicPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(20); // Starting with your default +20%
  const [priceDirection, setPriceDirection] = useState(1); // 1 for up, -1 for down

  
  // Onboarding content with larger icons (size=120) and spacing added via margin classes
  const onboardingFeatures = [
    {
      title: "Ramp System",
      description: "Access an unlimited supply of stablecoins and fiat from our trusted ramp partners, simplifying your financial transactions.",
      icon: <TrendingUpDown size={120} className="text-pink-500 m-4" />
    },
    {
      title: "Seamless Token Swaps",
      description: "Forget about managing gas fees and complex UIs. We handle the complexity so you can focus on trading and swap between any tokens with just a few clicks.",
      icon: <Shuffle size={120} className="text-blue-500 m-4" />
    },
    {
      title: "Beginner Friendly",
      description: "Designed specifically for newcomers to the crypto world. No jargon, just easy degening.",
      icon: <Wallet size={120} className="text-green-500 m-4" />
    },
    {
      title: "Enhanced Security",
      description: "Your assets remain secure with our non-custodial approach and security-first design.",
      icon: <Shield size={120} className="text-purple-500 m-4" />
    }
  ];



  // Initialize dynamic values once token data is loaded
  useEffect(() => {
    if (totalPrice && !loading) {
      setDynamicPrice(totalPrice);
    }
  }, [totalPrice, loading]);

  // Simulate price fluctuations
  useEffect(() => {
    if (!dynamicPrice || !isConnected) return;

    const interval = setInterval(() => {
      const randomChange = (Math.random() - 0.45) * 0.004;
      
      if (Math.random() > 0.7) {
        setPriceDirection(prev => prev * -1);
      }

      const newPrice = dynamicPrice * (1 + (randomChange * priceDirection));
      setDynamicPrice(newPrice);
      
      setPriceChange(prev => {
        const newChange = prev + randomChange * 100 * priceDirection;
        return Math.max(15, Math.min(25, newChange));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [dynamicPrice, isConnected, priceDirection]);

  // Fetch top tokens for Market Trends section
  const [topTokens, setTopTokens] = useState<any[]>([]);
  const [topTokensLoading, setTopTokensLoading] = useState(true);

  useEffect(() => {
    const fetchTopTokens = async () => {
      try {
        const response = await fetch("https://datapi.jup.ag/v1/pools/popular/24h");
        const data = await response.json();
        setTopTokens(data.pools.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch top tokens:", err);
      } finally {
        setTopTokensLoading(false);
      }
    };

    if (isConnected) {
      fetchTopTokens();
    }
  }, [isConnected]);

  const handleNext = () => {
    if (currentStep < onboardingFeatures.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminaOnboardingComplete', 'true');
    }
    setOnboardingComplete(true);
  };

  const handleFinishOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminaOnboardingComplete', 'true');
    }
    setOnboardingComplete(true);
  };

  // Render onboarding if not connected and onboarding not complete
  const showOnboarding = !isConnected && !onboardingComplete;

  return (
    <main className="min-h-screen flex flex-col">
      {showOnboarding ? (
        <div className="relative flex flex-col h-screen">
          {/* Logo at the top left */}
          <div className="absolute top-4 left-4 z-50">
            <Image src="/terminaMain.png" alt="Termina Logo" width={80} height={80} />
          </div>
          
          {/* Main onboarding content */}
          <div className="flex-grow flex items-center justify-center">
            {currentStep < onboardingFeatures.length ? (
              <OnboardingCard 
                {...onboardingFeatures[currentStep]} 
                currentStep={currentStep}
                totalSteps={onboardingFeatures.length + 1}
              />
            ) : (
              <FinalCard onConnect={handleFinishOnboarding} />
            )}
          </div>
          
          {/* Navigation buttons with progress dots inline */}
          
          <div className="py-8 px-8 flex justify-between items-center max-w-2xl mx-auto w-full mb-20"> {/* Added mb-20 to raise it up */}
            {currentStep < onboardingFeatures.length ? (
              <>
                <button 
                  onClick={currentStep === 0 ? handleSkip : handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  {currentStep === 0 ? "Skip" : "Back"}
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: onboardingFeatures.length + 1 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === currentStep ? "bg-black" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Next
                </button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <button 
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
          {isConnected && (
            <div className="flex w-full justify-between">
              <div className="flex items-center">
                <SearchAdd />
              </div>
              <ConnectButton />
            </div>
          )}

          {!isConnected ? (
            <div className="mt-[12.5vh] w-fit mx-auto">
              <span className="flex justify-center">
                <ConnectButton />
              </span>
            </div>
          ) : (
            <>
              <h1 className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%] md:hidden`}>
                Gm mate
              </h1>

              <div className="hidden md:flex w-full flex-row justify-between items-start mt-4 mb-6">
                <h1 className={`${instrumentSerif.className} font-bold text-[36px] leading-[36px] tracking-[0%]`}>
                  Gm mate
                </h1>
                
                <div className="flex flex-row h-[36px] p-[6px] rounded-xl bg-[#EBEBEB]">
                  <Image src="/glasses.svg" alt="watchout" width={24} height={24} />
                  <div className="p-[6px]">
                    <h1 className={`${geologica.className} text-center font-normal text-[12px] leading-[12px] tracking-[0%]`}>
                      Portfolio overview
                    </h1>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
                <BalanceCard />
                <HottestCard />
                <HotList />
                <HotRecent />
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
