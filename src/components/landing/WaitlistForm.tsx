"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../../lib/firebase";

export default function WaitlistForm({
  initialFormState = "waitlist",
}: {
  initialFormState?: "join" | "waitlist" | "wishlist" | "done";
}) {
  const [email, setEmail] = useState("");
  const [wishlist, setWishList] = useState("");

  const [formState, setFormState] = useState(initialFormState);

  const db = getFirestore(app);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "waitlist"), {
        email,
        timestamp: new Date(),
      });
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
      await addDoc(collection(db, "wishlist"), {
        email,
        wishlist,
        timestamp: new Date(),
      });
      toast.success("Successfully added to wishlist!");
      setFormState("done");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error joining waitlist");
    }
  };

  return (
    <div className="mb-4 space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
      <AnimatePresence mode="wait">
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
              className="bg-blue-500 text-white rounded-xl text-lg h-11 py-2 font-medium px-6"
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
                type="text"
                placeholder="wish features"
                value={wishlist}
                onChange={(e) => setWishList(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-9"
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-500 text-white rounded-xl text-lg h-11 py-2 font-medium px-6"
            >
              Add Wishlist
            </Button>
          </form>
        )}

        {formState === "done" && (
          <div className="w-full">
            <Button className="bg-blue-500 w-full text-white rounded-xl text-lg h-10 py-2 font-medium px-6 hover:bg-blue-500">
              Thank you for joining!
            </Button>
          </div>
        )}
        {formState === "join" && (
          <div className="w-full">
            <Button
              type="submit"
              className="bg-blue-500 text-white rounded-xl w-full text-lg h-10 py-2 font-medium px-6"
              onClick={() => {
                setFormState("waitlist");
              }}
            >
              Join Waitlist
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
