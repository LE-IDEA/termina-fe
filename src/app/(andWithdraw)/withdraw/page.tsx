"use client";
import Image from "next/image";
import { Geologica } from "next/font/google";
import { useEffect, useState } from "react";
import BlackResponse from "@/components/details/BlackResponse";
import RedResponse from "@/components/details/RedResponse";
import { useAppKitProvider } from "@reown/appkit/react";
import { type Provider } from "@reown/appkit-adapter-solana/react";
import { toast } from "react-hot-toast";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const ScalexConverterPage = () => {
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const userAddress = walletProvider?.publicKey?.toString();
  const [address, setAddress] = useState(userAddress);

  const [isInputActive, setIsInputActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [blackResponse, setBlackResponse] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [isNairaFirst, setIsNairaFirst] = useState(false);
  const [naira, setNaira] = useState("");
  const [dollar, setDollar] = useState("");

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/exchangeRate");
        if (!res.ok) {
          throw new Error("Failed to fetch exchange rate");
        }
        const data = await res.json();
        if (isNairaFirst) {
          setExchangeRate(data.data.offramp.rate_in_ngn);
        } else {
          setExchangeRate(data.data.onramp.rate_in_ngn);
        }
      } catch (err) {
        console.error("Error fetching exchange rate", err);
        setError("Could not fetch exchange rate");
      }
    };

    fetchRate();
  }, []);

  // Input handlers
  const handleNairaChange = (e) => {
    const nairaValue = e.target.value;
    setNaira(nairaValue);
    // Use dynamic exchange rate instead of hardcoded value
    if (exchangeRate) {
      setDollar((nairaValue / exchangeRate).toFixed(2));
    }
  };

  const handleDollarChange = (e) => {
    const dollarValue = e.target.value;
    setDollar(dollarValue);
    if (exchangeRate) {
      setNaira((dollarValue * exchangeRate).toFixed(2));
    }
  };

  const handleSwitch = () => {
    setIsNairaFirst(!isNairaFirst);
  };


  const handleSubmit = async () => {
    // Validation
    if (!address) {
      setBlackResponse(false);
      setResponse(true);
      return;
    }

    if (!email) {
      setError("Email is required");
      setBlackResponse(false);
      setResponse(true);
      return;
    }

    if (!naira || !dollar) {
      setError("Please enter an amount");
      setBlackResponse(false);
      setResponse(true);
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse(false);

    try {
      const res = await fetch("/api/scalex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: isNairaFirst ? Number(dollar) : Number(naira),
          address,
          email,
          type: "offramp"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // setError(data.error || "An error occurred");
        setBlackResponse(false);
        console.log(data.error);

        toast.error("Transaction failed");
      } else {
        setBlackResponse(true);
        if (data.data?.link) {
          window.open(data.data.link, "_blank");
        }
        toast.success("Transaction initiated successfully");
      }
    } catch (err) {
      setError("Failed to initiate transaction");
      setBlackResponse(false);
      toast.error("Failed to initiate transaction");
    } finally {
      setIsLoading(false);
      setResponse(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-auto rounded-[24px] md:w-[500px] sm:w-[400px] mt-16 md:mt-0">
      <div className="flex flex-row justify-between p-2 rounded-[12px] border-[1px] border-solid">
        <input
          id="Solana address"
          className={`${geologica.className} font-normal text-[16px] leading-1 tracking-normal outline-none w-full`}
          placeholder="Connect wallet to continue"
          title="Solana address"
          value={address || ""}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <Image
          src="/AddressCopy.svg"
          alt="Copy"
          width={20}
          height={20}
          className="my-auto"
        />
      </div>

      <div className="flex flex-row justify-between p-2 rounded-[12px] border-[1px] border-solid">
        <input
          id="Email"
          className={`${geologica.className} bg-transparent  font-normal text-[16px] leading-1 tracking-normal outline-none w-full`}
          placeholder="Enter your email"
          title="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div
        className={`rounded-[12px] ${
          response ? (blackResponse ? "bg-black" : "bg-[#ffcbcb]") : null
        }`}
      >
        <div
          className={`flex flex-row gap-3 justify-between h-[104px] bg-white p-3 border-[1px] border-solid rounded-[12px] ${
            response
              ? blackResponse
                ? "border-black"
                : "border-[#ffcbcb]"
              : null
          }`}
        >
          <div className="flex flex-col gap-1.5 h-[80px] w-full">

            <div className="flex flex-col gap-1 h-[34px]">
              <label
                htmlFor={isNairaFirst ? "naira" : "dollar"}
                className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}
              >
                {isNairaFirst ? "NGN" : "USDC"}
              </label>
              <input
                value={isNairaFirst ? naira : dollar}
                onChange={isNairaFirst ? handleNairaChange : handleDollarChange}
                id={isNairaFirst ? "naira" : "dollar"}
                className={`h-[20px] ${geologica.className} bg-transparent font-normal text-[20px] leading-[20px] tracking-normal outline-none`}
                placeholder="0.00"
                title="Enter amount"
                onFocus={() => setIsInputActive(true)}
                onBlur={() => setIsInputActive(false)}
              />
            </div>

            <div className="border-[0.4px] border-solid border-[#444444] opacity-50 rounded-lg w-full"></div>


            <div className="flex flex-col gap-1 h-[34px]">
              <label
                htmlFor={isNairaFirst ? "dollar" : "naira"}
                className={`${geologica.className} font-normal text-[10px] leading-[10px] tracking-[0%]`}
              >
                {isNairaFirst ? "USDC" : "NGN"}
              </label>
              <input
                value={isNairaFirst ? dollar : naira}
                onChange={isNairaFirst ? handleDollarChange : handleNairaChange}
                id={isNairaFirst ? "dollar" : "naira"}
                className={`h-[20px] ${geologica.className} font-normal text-[20px] leading-[20px] tracking-normal outline-none`}
                placeholder="0.00"
                title="Enter amount"
              />
            </div>
          </div>

          <Image
            onClick={handleSwitch}
            src="/refresh.svg"
            alt="Switch"
            width={20}
            height={20}
            className="my-auto cursor-pointer"
          />
        </div>

        {response &&
          (blackResponse ? (
            <BlackResponse />
          ) : (
            <RedResponse errorMessage={error} />
          ))}
      </div>

      <button
        className={`flex gap-2 h-[43px] pt-3 pr-6 pb-3 pl-6 rounded-[12px] ${
          isLoading
            ? "bg-gray-400"
            : isInputActive && address
            ? "bg-blue-500"
            : "bg-[#444444]"
        } text-white cursor-pointer`}
        onClick={handleSubmit}
        disabled={isLoading || !address}
      >
        <h1
          className={`m-auto ${geologica.className} font-normal text-[16px] leading-[19.2px] tracking-normal text-center`}
        >
          {isLoading ? "Processing..." : "Submit"}
        </h1>
      </button>
    </div>
  );
};

export default ScalexConverterPage;
