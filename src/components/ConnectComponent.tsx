// @ts-nocheck

"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useDisconnect } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ConnectButton() {
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && isConnected ? (
        <Button
          onClick={() => disconnect()}
          variant="outline"
          className="h-[2rem] min-w-[4rem] gap-2 border border-red-600 px-4 py-3 font-bold bg-red-500 text-background lg:min-w-[8rem] rounded-full "
        >
          Disconnect
        </Button>
      ) : (
        <div>
          <appkit-button />
        </div>
      )}
    </>
  );
}
