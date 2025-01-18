"use client";
import { FC } from "react";
import { Instrument_Serif, Geologica } from "next/font/google";
import Image from "next/image";
import { Button } from "../ui/button";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({ weight: "400", subsets: ["latin"] });

const GetFamiliar: FC = () => {
  return (
    <>
      <section className={`container mx-auto mt-28 mb-8 `}>
        <div className={`grid md:grid-cols-2 items-center gap-12 mt-12 px-4 md:px-0 ${instrumentSerif.className}`}>
          <Image src="/GettingStarted.png" className="w-full" alt="" width={1000} height={1000} />

          <div>
            <h2 className={`${instrumentSerif.className} text-5xl mb-8`}>
              Get familiar Termina
            </h2>
            <p className={`${geologica.className} text-xl text-gray-600`}>
              Watch our quick tutorials and get familiar on how to degen with
              termina in a couple minutes.
            </p>
            <Button className={`${geologica.className} bg-blue-500 text-lg rounded-xl mt-8 hover:bg-blue-800 hover:text-white`} size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
export default GetFamiliar;
