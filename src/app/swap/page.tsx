"use client";

import Swap from "@/components/app-components/Swap";
import TokenSearchModal from "@/components/app-components/TokenModal";
import { useState } from "react";

type Token = {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
};

export default function SwapPage() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Token Selector</h1>
      <TokenSearchModal onSelect={setSelectedToken} />

      {selectedToken && (
        <div className="p-4 rounded-lg border">
          <h2 className="font-medium mb-2">Selected Token:</h2>
          <div className="flex items-center gap-2">
            <img
              src={selectedToken.logoURI || "/placeholder.svg"}
              alt={`${selectedToken?.symbol} logo`}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <div className="font-medium">{selectedToken?.symbol}</div>
              <div className="text-sm text-gray-500">{selectedToken?.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
