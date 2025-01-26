import Link from "next/link";
import Image from "next/image";
import logo from "../../public/Logo-white.png";
import { Instrument_Serif, Geologica } from "next/font/google";
import { Button } from "./ui/button";
import WaitlistForm from "./landing/WaitlistForm";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });


export default function Footer() {
  return (
    <footer className="w-full py-12 sm:py-20 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between flex-col py-4 min-[500px]:py-8 gap-8 min-[500px]:gap-16 lg:gap-0 md:flex-row">
          <div>
            <div className="flex lg:flex-row pb-8 gap-7 lg:gap-0 ">
              <Link href="/" className="text-4xl font-bold text-white">
                <Image src={logo} alt="Termina-logo" className="w-32 lg:w-52" />
              </Link>
            </div>

            <div className="flex items-start flex-row gap-8 sm:gap-12 xl:gap-24">
              <div className="block">
                <ul className="grid text-gray-100 gap-4 min-[500px]:gap-6 min-[500px]:text-left">
                  <li>
                    <Link
                      href="https://x.com/use_Termina/status/1883078030907908389"
                      target="blank"
                      className="hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                     White Paper
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://x.com/use_Termina"
                      target="blank"
                      className="hover:text-white transition-colors"
                    >
                      Twitter(X)
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="block my-8 lg:max-w-md">
            <h3 className={`${instrumentSerif.className} font-semibold text-4xl text-white leading-9 mb-4 text-center md:text-left`}>
            100x Degen Journey Starts Now
            </h3>
            <p className="text-gray-300 mb-8 text-center md:text-left">
            Join waitlist today to stay ahead of 90% of Degens and stay up to date with new features releases.
            </p>

            <div className="space-y-2">
              {/* <Button
                  type="submit"
                  className="bg-blue-500 text-white rounded-xl w-full text-lg h-10 py-2 font-medium px-6"
                >
                  Join Waitlist
                </Button> */}
                <WaitlistForm initialFormState="join"/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
