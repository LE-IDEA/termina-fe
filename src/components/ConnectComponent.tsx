"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ConnectButton() {
  const { authenticated, logout, login } = usePrivy();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && authenticated ? (
        <Button
          onClick={() => logout()}
          variant="outline"
          className="h-[2rem] min-w-[4rem] gap-2 border border-red-600 px-4 py-3 font-bold bg-red-500 text-background lg:min-w-[8rem] rounded-full "
        >
          Disconnect
        </Button>
      ) : (
        <Button
          onClick={() => login()}
          variant="outline"
          className="h-[2rem] min-w-[4rem] gap-2 border px-4 py-3 font-bold bg-primary text-background lg:min-w-[8rem] rounded-full"
        >
          Connect
        </Button>
      )}
    </>
  );
}
