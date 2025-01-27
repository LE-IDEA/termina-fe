"use client";
import Image from "next/image";
import { FC, useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../../lib/firebase";
import { Button } from "@/components/ui/button";
import heroImg from "../../../public/shield-icon.png";
import { Instrument_Serif, Geologica } from "next/font/google";
import { Mail, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import WaitlistForm from "./WaitlistForm";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const Hero: FC = () => {
  const [email, setEmail] = useState("");
  const [wishlist, setWishList] = useState("");

  const [formState, setFormState] = useState("waitlist");

  const db = getFirestore(app);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      // await addDoc(collection(db, "waitlist"), {
      //   email,
      //   timestamp: new Date(),
      // });
      // setEmail("");
      toast.success("Successfully joined waitlist!");
      setFormState("wishlist");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error joining waitlist");
    }
  };

  const handleWishList = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      // await addDoc(collection(db, "waitlist"), {
      //   email,
      //   timestamp: new Date(),
      // });
      // setEmail("");
      toast.success("Successfully added to wishlist!");
      setFormState("done");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error joining waitlist");
    }
  };

  return (
    <>
      <section className={`container mx-auto mt-0 `}>
        <div className="mx-auto md:grid max-w-screen-lg px-4 pt-12 flex flex-col-reverse md:grid-cols-12 lg:gap-16  lg:pt-28 xl:gap-0">
          <div className="md:col-span-7">
            <h1
              className={`mb-4 max-w-3xl text-4xl font-extrabold leading-none tracking-tight lg:text-5xl xl:text-6xl ${instrumentSerif.className}`}
            >
              Gas abstraction with improved UI for degening experience.
              <br />
            </h1>

            <p
              className={`text-base leading-relaxed/2 lg:mb-8 mb-6 max-w-2xl font-light text-gray-700 ${geologica.className}`}
            >
              Trade memecoins on Solana effortlessly. Swap meme tokens for SPL
              tokens in a few clicks—no hassle, no telegram trade bot, just
              safe, secure, and intuitive.
            </p>

            {/* <div className="mb-4 space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
              {formState === "waitlist" && (
                <form
                  className="flex space-x-3 items-center w-full max-w-md "
                  onSubmit={handleSubmit}
                >
                  <div className="relative flex-1 gap-2 p-1 rounded-xl border bg-background">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-9"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white rounded-xl text-lg h-10 py-2 font-medium px-6"
                  >
                    Join Waitlist
                  </Button>
                </form>
              )}

              {formState === "wishlist" && (
                <form
                  className="flex space-x-3 items-center w-full max-w-md "
                  onSubmit={handleWishList}
                >
                  <div className="relative flex-1 gap-2 p-1 rounded-xl border bg-background">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setWishList(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-9"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white rounded-xl text-lg h-10 py-2 font-medium px-6"
                  >
                    Add Wishlist
                  </Button>
                </form>
              )}

              {formState === "done" && (
                <Button className="bg-blue-500 w-full text-white rounded-xl text-lg h-10 py-2 font-medium px-6 hover:bg-blue-500">
                  Thank you for joining!
                </Button>
              )}
            </div> */}
            <WaitlistForm/>
          </div>
          <div className="md:col-span-5 lg:mt-0 lg:flex">
            <Image
              src={heroImg}
              alt=""
              width={400}
              height={400}
              className="w-[240px] h-[240px]  lg:w-[340px] lg:h-[340px] mx-auto"
            />
          </div>
        </div>
        <Toaster />
      </section>
    </>
  );
};
export default Hero;
