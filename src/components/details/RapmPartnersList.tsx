"use client";
import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import handleSubmit from "@/app/(andWithdraw)/add/page";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

interface ButtonProps {
  label: string;
  img: string;
  url: string;
  isDisabled: boolean;
}
const RapmPartnersList = () => {


  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);

  const buttons: ButtonProps[] = [
    { label: "AZZA", img: '/azza.jpg', url: "https://url1.com", isDisabled: true },
    { label: "PAJCASH", img: '/pajcash.jpg', url: "https://url3.com", isDisabled: true },
    { label: "SCALEX", img: '/scalex.jpg', url: "http://checkout.Scalex.africa", isDisabled: false },
  ];

  const handleClick = (url: string) => {
    setSelectedUrl(url);
  };

  const submitHandler = () => {
    if (selectedUrl) {
      window.location.href = selectedUrl;
    }
    handleSubmit();
  };

  const handleContinue = () => {
    
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!isVisible) return null;

  return (

    <div ref={popupRef} className='md:hidden fixed gap-4 flex flex-col bottom-[0px] left-0 bg-[#ebebeb] w-screen overflow-hidden rounded-tl-[60px] rounded-tr-[60px] py-[24px] px-[24px] z-50' >
      <div className='flex flex-row items-start gap-4'>
        <Image src="/carretLeft.svg" alt="Ramp" width={30} height={30} />
        <h1 className={`${instrumentSerif.className} font-normal text-[22px] leading-[1] tracking-normal text-center my-auto`}>Select a ramp partner</h1>
      </div>

      <div className="flex flex-col gap-3">
        {buttons.map((button) => (
          <button
            key={button.label}
            disabled={button.isDisabled}
            className={`flex flex-row gap-2 p-2 items-start hover:border-[2px] hover:border-solid hover:border-blue-500 rounded-xl bg-white ${button.isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
            onClick={() => handleClick(button.url)}
          >
            <Image src={button.img} alt={button.label} width={40} height={30} className="rounded-full" />
            <h1 className={` font-bold text-[12px] leading-[12px] my-auto`}>{button.label}</h1>
          </button>
        ))}



      </div>

      <button
        onClick={submitHandler}
        disabled={!selectedUrl}
        style={{
          backgroundColor: selectedUrl ? "blue" : "grey",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: selectedUrl ? "pointer" : "not-allowed",
        }}
      >
        Continue
      </button>

    </div >
  )
}

export default RapmPartnersList