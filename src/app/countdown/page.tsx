"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import WaitlistForm from "@/components/landing/WaitlistForm";
import CountdownTimer from "@/components/countdown/Counter";

const FloatingImage = ({
  src,
  alt,
  width,
  height,
  className,
  delay = 0,
  duration = 4,
}) => {
  const floatAnimation = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration,
          ease: "easeInOut",
          delay,
        },
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: duration * 1.2,
          ease: "easeInOut",
          delay: delay + 0.2,
        },
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={floatAnimation}
      initial="initial"
      animate="animate"
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default function CountDownPage() {
  return (
    <>
      {/* <Header /> */}
      <main className="bg-neutral-950 ">
        <div className="relative h-screen overflow-hidden z-30">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/landing/landing-bg.svg')] bg-bottom bg-no-repeat bg-opacity-20" />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <FloatingImage
              src="/logo-bright.svg"
              alt="Crypto Logo 1"
              width={1000}
              height={1000}
              className="absolute top-[10%] left-[15%] w-12 h-12 lg:w-24 md:h-24 text-green-500/20 rotate-12"
            />
            <FloatingImage
              src="/pump.png"
              alt="Pump Logo"
              width={1000}
              height={1000}
              className="absolute top-[8%] right-[18%] w-12 h-12 lg:w-24 md:h-24 text-green-500/20 -rotate-12"
            />

            <FloatingImage
              src="/phantom-logo.svg"
              alt="Phantom Logo"
              width={1000}
              height={1000}
              className="absolute top-[30%] left-[8%] w-12 h-12 lg:w-24 md:h-24 text-green-500/20 rotate-45"
            />
            <FloatingImage
              src="/TA-logo.svg"
              alt="TA Logo"
              width={1000}
              height={1000}
              className="absolute top-[45%] left-[20%] w-12 h-12 lg:w-20 lg:h-20 text-green-500/20 -rotate-12"
            />
            <FloatingImage
              src="/scalex.svg"
              alt="TW Logo"
              width={1000}
              height={1000}
              className="absolute top-[35%] rounded-full right-[10%] w-12 h-12 lg:w-24 md:h-24 text-green-500/20 rotate-12"
            />
            <FloatingImage
              src="/solanaLogoMark.svg"
              alt="Crypto Logo 2"
              width={1000}
              height={1000}
              className="absolute top-[50%] right-[18%] w-12 h-12 lg:w-20 lg:h-20 text-green-500/20 -rotate-6"
            />

            {/* <CircleDollarSign className="absolute bottom-[20%] right-[15%] w-16 h-16 lg:w-24 md:h-24 text-green-500/20 -rotate-12" />
              <Bitcoin className="absolute bottom-[10%] left-[45%] w-12 h-12 md:w-20 md:h-20 text-green-500/20 rotate-45" /> */}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 mt-16 lg:mt-32 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <Image
                  src={"/Logo animated loader.png"}
                  alt=""
                  width={1000}
                  height={1000}
                  className=" w-40 h-40"
                />
              </div>
              <div className="bg-gray-950/90 backdrop-blur-sm rounded-lg flex items-center justify-center mb-8 w-fit mx-auto">
                <p className="mt-6 text-lg lg:text-xl text-white font-bold max-w-md ">
                Join us at
                launch to experience the future of decentralized finance.
                </p>
              </div>

              <CountdownTimer />

              <div className="mt-16 text-center flex flex-col items-center w-full justify-center">
                <WaitlistForm initialFormState="join" />
              </div>

              <div className="flex gap-6 justify-center w-fit mx-auto text-white mt-12">
                {/* Social links commented out but preserved */}
                {/* <Link
                  href="https://t.me/ongridprotocol"
                  target="blank"
                  className="hover:text-white transition-colors"
                >
                  <IconBrandTelegram className="h-8 w-8" />
                  <span className="sr-only">Discord</span>
                </Link> */}
                {/* <Link
                  href="https://x.com/OngridProtocol"
                  target="blank"
                  className="hover:text-white transition-colors"
                >
                  <IconBrandX className="h-8 w-8" />
                  <span className="sr-only">Twitter</span>
                </Link> */}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="w-full absolute inset-auto bottom-0 max-h-[300px] overflow-hidden">
          <Image
            src="/Frame 5.png"
            alt="Colorful gradient"
            width={1920}
            height={200}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </main>
    </>
  );
}
