"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Swap from "./Swap";
import RampCard from "./Ramp";
import OffRampCard from "./Offramp";

export default function ActionWrapper() {
  return (
    <div className="max-w-lg mt-8 mx-auto my-4 p-4 md:p-6 md:my-6 lg:mt-16">
      <Tabs defaultValue="swap" className="w-full">
        <TabsList className="grid w-fit gap-6 grid-cols-4 bg-transparent p-1 mb-4">
          <TabsTrigger value="swap" className="text-base rounded-full data-[state=active]:bg-blue-700">
            Swap
          </TabsTrigger>
          {/* <TabsTrigger value="send" className="text-base rounded-full data-[state=active]:bg-blue-700">
            Send
          </TabsTrigger> */}
          <TabsTrigger value="buy" className="text-base rounded-full data-[state=active]:bg-blue-700">
            Buy USDC
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-base rounded-full data-[state=active]:bg-blue-700">
            Sell USDC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swap" className="space-y-4">
          <Swap />
        </TabsContent>

        <TabsContent value="buy" className="space-y-4">
          <RampCard />
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <OffRampCard/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
