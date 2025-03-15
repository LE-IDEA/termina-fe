"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoveDownLeft, MoveUpRight, Wallet } from "lucide-react"

export default function OnrampModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="bg-zinc-600 cursor-pointer text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <Wallet className="w-5 h-5" />
          Buy Crypto
          <MoveDownLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Scalex Ramp</DialogTitle>
        </DialogHeader>
        <div className="aspect-square w-full flex">
          <iframe
            src="https://checkout.scalex.africa/on-ramp
            "
            className="w-full h-full border-0 rounded-md"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

