"use client";
import { FC } from "react";
import { Instrument_Serif, Geologica } from "next/font/google";
import Image from "next/image";
import WaitlistForm from "./WaitlistForm";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: "400", subsets: ["latin"] });

const GetFamiliar: FC = () => {
  return (
    <>
      <section className={`container mx-auto mt-28 md:px-8 mb-8 `}>
        <div className={`grid md:grid-cols-2 items-center gap-12 mt-12 px-4 md:px-0`}>
          <Image src="/GettingStarted.png" className="w-full" alt="" width={1000} height={1000} />

          <div>
            <h2 className={`${instrumentSerif.className} text-5xl mb-8`}>
            Join the fun! 
            </h2>
            <p className={`${geologica.className} text-base md:text-xl text-gray-600 mb-4`}>
            Stay ahead of the curve and get instant access to our hottest updates the moment they land. Don't miss out on the excitement – join our waitlist now!</p>
           <WaitlistForm initialFormState="join"/>
          </div>
        </div>
      </section>
    </>
  );
};
export default GetFamiliar;
