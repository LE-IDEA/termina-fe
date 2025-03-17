"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import SwapSlippage from "@/components/details/SwapSlippage";
import { useState, useEffect } from "react";
import Sidebar from "@/components/details/Sidebar";
import DownNav from "@/components/details/DownNav";
import { useSwap } from "@/hooks/useSwap"; // Import our custom hook

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const SwapPage = () => {
  // Use our custom hook for swap functionality
  const {
    // State
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    swapping,
    
    // Handlers
    handleFromAssetChange,
    handleToAssetChange,
    handleFromValueChange,
    handleSwapDirection,
    executeSwap,
    
    // Computed
    isSwapDisabled,
    swapRate
  } = useSwap();

  // Local state for simple UI controls
  const [showSettings, setShowSettings] = useState(false);

  // Calculate estimated total with fee (example calculation)
  const calculateTotal = () => {
    if (!fromAmount || !fromAsset) return "0";
    const feeRate = 0.005; // 0.5% fee
    const fee = Number(fromAmount) * feeRate;
    const total = Number(fromAmount) + fee;
    
    // Format as "1.95sol ≈ ₦400,356" (example)
    return `${total.toFixed(2)}${fromAsset?.symbol || "sol"} ≈ ₦${(total * 1450).toLocaleString()}`;
  };

  // UI helper to display asset info
  const renderAssetInfo = (asset) => {
    if (!asset) return { name: "Loading...", symbol: "..." };
    return {
      name: asset.name || "Loading...",
      symbol: asset.symbol || "...",
      image: asset.name === "Solana" ? "/Solana.svg" : "/Chill.png" // Example image selection
    };
  };

  const fromAssetInfo = renderAssetInfo(fromAsset);
  const toAssetInfo = renderAssetInfo(toAsset);

  return (
    <main className="overflow-auto hide-scrollbar relative h-screen p-4 md:px-2 pmd:p-12 pxl:px-18">
      <div className="md:flex md:flex-row md:gap-3 lgg:gap-4 pmd:gap-6 pmd:min-w-[904px] lgg:max-w-[1100px] pxl:max-w-[1300px] md:px-2 mdd:px-9 pmd:px-0 xl:px-0 pxl:gap-6 mx-auto">
        <Sidebar />

        <section className="md:flex md:flex-row md:gap-4 pxl:gap-6 mx-auto">
          <section className="gap-4 flex flex-col lgg:w-[444px] pxl:w-[604px]">
            <div className="flex flex-row h-[36px] justify-between md:hidden">
              <Image src="/prevCarret.svg" alt="prev" width={36} height={36} />
              <Image 
                src="/Settings.svg" 
                alt="settings" 
                width={36} 
                height={36} 
                onClick={() => setShowSettings(!showSettings)}
              />
            </div>

            {/* solanabox */}
            <section className="flex flex-col gap-[6px] rounded-[12px] p-[2px] bg-[#ebebeb] border-[#ebebeb] md:w-[320px] lgg:w-[444px] pxl:w-[604px]">
              {/* From token */}
              <div className="flex flex-col p-[10px] gap-4 rounded-[12px] bg-white pxl:w-[600px]">
                <div className="flex flex-row h-[48px] p-[6px] gap-[10px] justify-between my-auto">
                  <div className="flex flex-row h-[48px] gap-[10px]">
                    <Image 
                      src={fromAssetInfo.image} 
                      alt="token image" 
                      width={32} 
                      height={32} 
                      className="my-auto" 
                    />
                    <div className="flex flex-col w-[90px] h-[36px] gap-[6px] my-auto">
                      <h1 className={`${geologica.className} font-medium text-[20px] leading-1 tracking-normal`}>
                        {fromAssetInfo.name}
                      </h1>
                      <h1 className={`${geologica.className} font-normal text-[10px] leading-1 tracking-normal opacity-50`}>
                        {fromAssetInfo.symbol}
                      </h1>
                    </div>
                  </div>
                  <input
                    className={`${instrumentSerif.className} w-[130px] font-normal text-4xl leading-none tracking-normal text-right outline-none`}
                    placeholder="0.0"
                    title="Enter amount"
                    value={fromAmount}
                    onChange={handleFromValueChange}
                  />
                </div>

                {/* interswap */}
                <button 
                  className="items-center justify-center" 
                  title="Swap direction" 
                  onClick={handleSwapDirection}
                >
                  <Image 
                    src="/Interswap.svg" 
                    alt="Interchange" 
                    width={24} 
                    height={24} 
                    className="mx-auto" 
                  />
                </button>

                {/* To token */}
                <div className="flex flex-row h-[48px] p-[6px] gap-[10px] justify-between">
                  <div className="flex flex-row h-[48px] gap-[10px]">
                    <Image 
                      src={toAssetInfo.image} 
                      alt="token image" 
                      width={32} 
                      height={32} 
                      className="my-auto" 
                    />
                    <div className="flex flex-col w-[90px] h-[36px] gap-[6px] my-auto">
                      <h1 className={`${geologica.className} font-medium text-[20px] leading-[20px] tracking-normal`}>
                        {toAssetInfo.name}
                      </h1>
                      <h1 className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-normal opacity-50`}>
                        {toAssetInfo.symbol}
                      </h1>
                    </div>
                  </div>
                  <input
                    className={`${instrumentSerif.className} w-[130px] md:w-[70px] lgg:w-[130px] font-normal text-4xl leading-none tracking-normal text-right outline-none`}
                    placeholder="0.0"
                    title="You receive"
                    value={toAmount}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-row h-[32px] p-[10px] justify-between rounded-br-[12px] rounded-bl-[12px] pxl:w-[604px]">
                <div className="flex flex-row items-center w-[56px] h-[12px] gap-[4px]">
                  <Image src="/circleDetail.svg" alt="detail" width={12} height={12} />
                  <div className="flex flex-row my-auto h-[8px] gap-[4px]">
                    <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>fee:</h1>
                    <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>0.5%</h1>
                  </div>
                </div>
                <div className="flex flex-row h-[8px] gap-[4px] my-auto">
                  <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>Total:</h1>
                  <h1 className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}>
                    {calculateTotal()}
                  </h1>
                </div>
              </div>
            </section>

            {/* confirm button */}
            <button 
              className="h-[55px] gap-[10px] rounded-[12px] pt-[18px] pr-[24px] pb-[18px] pl-[24px] bg-[#0077FF]"
              title="Confirm Swap"
              onClick={executeSwap}
              disabled={isSwapDisabled || swapping}
            >
              <h1 className={`${geologica.className} text-white`}>
                {swapping ? "Swapping..." : "Confirm"}
              </h1>
            </button>

            {/* Rate display when available */}
            {swapRate && (
              <div className="flex flex-row h-[64px] gap-[10px] rounded-[18px] p-[12px] bg-[#ebebeb]">
                <Image src="/Devanin.svg" alt="Rate" width={40} height={40} />
                <div className="h-[23px]">
                  <h1 className={`${geologica.className} text-black font-medium text-custom-size leading-[22.5px] tracking-normal`}>
                    Rate: 1 {fromAssetInfo.name} = {swapRate} {toAssetInfo.name}
                  </h1>
                </div>
              </div>
            )}

            {/* Additional info card */}
            <div className="flex flex-row h-[64px] gap-[10px] rounded-[18px] p-[12px] bg-[#ebebeb]">
              <Image src="/Devanin.svg" alt="Devanin" width={40} height={40} />
              <div className="h-[23px]">
                <h1 className={`${geologica.className} text-black font-medium text-custom-size leading-[22.5px] tracking-normal`}>
                  Devanin
                </h1>
              </div>
            </div>
          </section>

          <SwapSlippage />
        </section>
      </div>
      <DownNav />
    </main>
  );
};

export default SwapPage;