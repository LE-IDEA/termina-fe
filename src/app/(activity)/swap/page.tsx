"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import SwapSlippage from "@/components/details/SwapSlippage";
import { useState, useEffect } from "react";
import Sidebar from "@/components/details/Sidebar";
import DownNav from "@/components/details/DownNav";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitProvider } from "@reown/appkit/react";

import useTokens from "@/hooks/useTokens";
import TokenSearchModal from "@/components/app-components/TokenModal";
// import { useTokenBalances } from "@/hooks/useTokenBalances";
import toast from "react-hot-toast";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useSwap } from "@/hooks/useSwap";
import { Input } from "@/components/ui/input";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const SwapPage = () => {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider("solana");
  const { tokens } = useTokens();
//   const { balances, balancesLoading } = useTokenBalances();

  // Local state for token selection and amounts
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Sol balance hook to update balance post-swap
  const { fetchSolBalance } = useSolBalance({
    connection,
    publicKey: walletProvider?.publicKey || null,
  });

  // Use the useSwap hook
  const {
    quoteResponse,
    estimatedFee,
    swapping,
    toAmount,
    getQuote,
    debounceQuoteCall,
    signAndSendTransaction,
  } = useSwap({
    connection,
    walletProvider,
  });

  // Initialize tokens when available
  useEffect(() => {
    if (tokens && tokens.length >= 2 && !isInitialized) {
      setFromAsset(tokens[0]);
      setToAsset(tokens[1]);
      setIsInitialized(true);
    }
  }, [tokens, isInitialized]);

  const handleFromAssetChange = (token) => {
    if (token) {
      setFromAsset(token);
      setFromAmount("");
    }
  };

  const handleToAssetChange = (token) => {
    if (token) {
      setToAsset(token);
      setFromAmount("");
    }
  };

  const handleFromValueChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFromAmount(value);
    }
  };

  // Trigger quote fetch when amount changes
  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0 && fromAsset && toAsset) {
      debounceQuoteCall(Number(fromAmount), fromAsset, toAsset);
    }
  }, [fromAmount, fromAsset, toAsset, debounceQuoteCall]);

  // Swap asset direction (switch "from" and "to" tokens)
  const handleSwapDirection = () => {
    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    setFromAmount(toAmount || "");
  };

  // Execute swap using the signAndSendTransaction method from useSwap
  async function handleSwap() {
    if (!walletProvider || !connection || !quoteResponse) {
      toast.error("Missing required dependencies for swap");
      return;
    }

    try {
      const txid = await signAndSendTransaction();
      if (txid) {
        fetchSolBalance(); // Update SOL balance post-swap
      }
    } catch (error) {
      // Error is already handled inside signAndSendTransaction
      console.error("Swap execution error:", error);
    }
  }

  const isSwapDisabled =
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset?.address === fromAsset?.address ||
    swapping;

  // Simple fee formatter
  const formatFee = (fee) => {
    if (!fee) return "$0.00";
    const solPriceInUsd = 20; // Replace with live feed in production
    return `~$${(fee * solPriceInUsd).toFixed(2)}`;
  };

  // Calculate total with fee
  const calculateTotal = () => {
    if (!fromAmount || !estimatedFee) return "0.00";
    return `${(Number(fromAmount) + estimatedFee).toFixed(4)} ${
      fromAsset?.symbol || ""
    }`;
  };

  // Calculate swap rate
  const swapRate =
    quoteResponse && fromAmount && toAmount
      ? (Number(toAmount) / Number(fromAmount)).toFixed(6)
      : null;

  return (
    <main className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
      <div className="flex justify-end">
        {" "}
        <appkit-button />
      </div>
      <section className="md:flex md:flex-row md:gap-4 pxl:gap-6 mx-auto mt-8">
        <section className="gap-4 flex flex-col lgg:w-[444px] pxl:w-[604px]">
          {/* solanabox */}
          <section className="flex flex-col gap-[6px] rounded-[12px] p-[2px] bg-[#ebebeb] border-[#ebebeb] md:w-[320px] lgg:w-[444px] pxl:w-[604px]">
            {/* From token */}
            <div className="flex flex-col p-[10px] gap-4 rounded-[12px] bg-white pxl:w-[600px]">
              <div className="flex flex-row h-[48px] p-[6px] gap-[10px] justify-between my-auto">
                <div className="flex flex-row h-[48px] gap-[10px]">
                  <TokenSearchModal
                    onSelect={handleFromAssetChange}
                    defaultToken={fromAsset}
                  />
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
                  <TokenSearchModal
                    onSelect={handleToAssetChange}
                    defaultToken={toAsset}
                  />
                </div>
                <div
                  className={`${instrumentSerif.className} w-[130px] font-normal text-4xl leading-none tracking-normal text-right`}
                >
                  {toAmount || "0.0"}
                </div>
              </div>
            </div>

            <div className="flex flex-row h-[32px] p-[10px] justify-between rounded-br-[12px] rounded-bl-[12px] pxl:w-[604px]">
              <div className="flex flex-row items-center w-[56px] h-[12px] gap-[4px]">
                <Image
                  src="/circleDetail.svg"
                  alt="detail"
                  width={12}
                  height={12}
                />
                <div className="flex flex-row my-auto h-[8px] gap-[4px]">
                  <h1
                    className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}
                  >
                    fee:
                  </h1>
                  <h1
                    className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}
                  >
                    0.5%
                  </h1>
                </div>
              </div>
              <div className="flex flex-row h-[8px] gap-[4px] my-auto">
                <h1
                  className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}
                >
                  Total:
                </h1>
                <h1
                  className={`${geologica.className} font-medium text-xs leading-[8px] tracking-normal`}
                >
                  {calculateTotal()}
                </h1>
              </div>
            </div>
          </section>

          {/* confirm button */}
          <button
            className={`h-[55px] gap-[10px] rounded-[12px] pt-[18px] pr-[24px] pb-[18px] pl-[24px] bg-[#0077FF] ${
              isSwapDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Confirm Swap"
            onClick={handleSwap}
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
                <h1
                  className={`${geologica.className} text-black font-medium text-base leading-[22.5px] tracking-normal`}
                >
                  Rate: 1 {fromAsset?.name} = {swapRate} {toAsset?.name}
                </h1>
              </div>
            </div>
          )}

          {/* Network fee display */}
          <div className="flex flex-row h-[64px] gap-[10px] rounded-[18px] p-[12px] bg-[#ebebeb]">
            <Image src="/Devanin.svg" alt="Devanin" width={40} height={40} />
            <div className="h-[23px]">
              <h1
                className={`${geologica.className} text-black font-medium text-base leading-[22.5px] tracking-normal`}
              >
                Network Fee: {estimatedFee.toFixed(5)} SOL (
                {formatFee(estimatedFee)})
              </h1>
            </div>
          </div>
        </section>

        <SwapSlippage />
      </section>
    </main>
  );
};

export default SwapPage;
