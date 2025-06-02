"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppConnection } from "@/providers/PrivyProvider";

export default function ConnectButton() {
  const { connected, login, logout, ready } = useAppConnection();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Wait for client-side hydration and auth readiness
  if (!isClient || !ready) return null;

  return connected ? (
    <Button
      onClick={() => logout()}
      variant="outline"
      className="h-[2rem] min-w-[4rem] gap-2 border border-red-500 font-bold bg-red-50 text-red-600 lg:min-w-[8rem] rounded-full"
    >
      Disconnect
    </Button>
  ) : (
    <Button
      onClick={() => login()}
      variant="default"
      className="h-[2rem] min-w-[4rem] gap-2 font-bold bg-primary text-white lg:min-w-[8rem] rounded-full"
    >
      Connect Wallet
    </Button>
  );
}