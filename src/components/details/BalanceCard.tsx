"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";
import CurrencyChange from "./CurrencyChange";
import { useAppKitAccount } from "@reown/appkit/react";
import toast from "react-hot-toast";
import useFungibleTokens from "@/hooks/useFungibleTokes";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const BalanceCard = () => {
  const [isCurr, setIsCurr] = useState(true);
  const { address } = useAppKitAccount();
  const { totalPrice, loading } = useFungibleTokens(address || "");
  
  // Dynamic price states
  const [dynamicPrice, setDynamicPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(20);
  const [priceDirection, setPriceDirection] = useState(1);
  
  // Initialize dynamic price when totalPrice loads
  useEffect(() => {
    if (totalPrice && !loading) {
      setDynamicPrice(totalPrice);
    }
  }, [totalPrice, loading]);
  
  // Simulate price fluctuations
  useEffect(() => {
    if (!dynamicPrice || loading) return;

    const interval = setInterval(() => {
      // Random percentage change between -0.15% and +0.15%
      const randomChange = (Math.random() - 0.45) * 0.003; // Slight positive bias
      
      // Switch direction occasionally
      if (Math.random() > 0.75) {
        setPriceDirection(prev => prev * -1);
      }

      // Calculate new price with slight bias based on direction
      const newPrice = dynamicPrice * (1 + (randomChange * priceDirection));
      setDynamicPrice(newPrice);
      
      // Update price change percentage
      setPriceChange(prev => {
        const newChange = prev + randomChange * 100 * priceDirection;
        // Limit to a reasonable range
        return Math.max(15, Math.min(25, newChange)); // Keep between 15-25%
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [dynamicPrice, loading, priceDirection]);
  
  const changeCurr = () => {
    setIsCurr(!isCurr);
  };

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(`${address}`);

      setTimeout(() => {
        toast.success("Address copied successfully!");
      }, 1000);

      return true;
    } catch (err) {
      toast.error("Failed to copy balance to clipboard:", err);
      console.error("Failed to copy balance to clipboard:", err);
      return false;
    }
  };
  
  return (
    <div className="flex flex-col gap-[12px] md:w-full md:justify-between pmd:h-[238px] ">
      <div className="flex flex-col bg-[#ebebeb] p-3 md:p-6 gap-[36px] sm:gap-16 pmd:gap-0 pmd:justify-between pmd:h-[178px] rounded-[24px]">
        <div className="gap-[4px] flex flex-col">
          <div className="flex flex-row justify-between">
            <h1
              className={` ${instrumentSerif.className} font-normal text-[36px] md:leading-1 tracking-[0] text-center text-black transition-all duration-500`}
            >
              ${loading ? "loading..." : dynamicPrice.toFixed(2)}
            </h1>
          <div className="flex flex-row">
              <button title="change coin">
                <Image src="/ArrowDown.svg" alt="prev" width={18} height={18} />
              </button>
              <Image src="/usdcLogo.svg" alt="prev" width={58} height={48} className=" aspect-square" quality={100} />
          </div>
          </div>
          <div className="flex gap-1">
            <div className={`w-[8px] h-[8px] ${priceChange >= 0 ? 'bg-[#47B105]' : 'bg-red-600'} rounded-full transition-all duration-300`}></div>
            <h1
              className={`${geologica.className} font-normal text-[10px] ${priceChange >= 0 ? 'text-[#47B105]' : 'text-red-600'} leading-[10px] tracking-[0%] transition-all duration-300`}
            >
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </h1>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <h1
            className={`font-normal text-[14px] leading-1 tracking-[0%] opacity-50`}
          >
            {String(address).substring(0, 8)}...
            {String(address).substring(
              String(address).length - 9,
              String(address).length - 1
            )}
          </h1>
          <Image
            src="/Copy.svg"
            className="cursor-pointer"
            alt="prev"
            width={20}
            height={20}
            onClick={copyToClipBoard}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/add" className="w-full">
          <button
            title="Add"
            className="w-full items-center justify-center flex flex-row py-[12px] px-10 sm:px-20 md:px-5 gap-2 md:gap-[10px] bg-[#ebebeb] rounded-xl flex-1 hover:bg-gray-200 transition-all"
          >
            <Image src="/Add.svg" alt="Add" width={24} height={24} />
            <h1
              className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}
            >
              Add
            </h1>
          </button>
        </Link>

        <Link href="/withdraw" className="w-full">
          <button
            title="Withdraw"
            className="w-full items-center justify-center flex flex-row py-[12px] px-8 sm:px-16 md:px-4 gap-2 md:gap-[10px] bg-[#ebebeb] rounded-xl flex-1 hover:bg-gray-200 transition-all"
          >
            <Image src="/Withdraw.svg" alt="Withdraw" width={24} height={24} />
            <h1
              className={`${geologica.className} my-auto font-normal text-[20px] leading-[20px] tracking-[0%] text-center text-black`}
            >
              Withdraw
            </h1>
          </button>
        </Link>
      </div>

      {!isCurr ? <CurrencyChange /> : null}
    </div>
  );
};

export default BalanceCard;
