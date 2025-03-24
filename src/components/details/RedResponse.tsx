import Image from "next/image";
import { Geologica, Instrument_Serif } from "next/font/google";
import { useState } from "react";
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const RedResponse = ({ errorMessage }) => {
  return (
    <div className="flex flex-row p-[10px] rounded-br-[12px] rounded-bl-[12px] bg-[#ffcbcb]">
      <div className="flex flex-row gap-[4px]  h-[12px]">
        <Image src="/circleDetail.svg" alt="Home" width={12} height={12} />
        <h1
          className={`${geologica.className} text-[#AC1717] my-auto font-medium text-[8px] leading-[8px] tracking-normal`}
        >
          {" "}
          {errorMessage || "An error occurred. Please try again."}
        </h1>
      </div>
    </div>
  );
};

export default RedResponse;
