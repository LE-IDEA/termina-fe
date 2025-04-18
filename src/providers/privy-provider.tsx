"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const solanaConnectors = toSolanaWalletConnectors();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_PROJECT_ID || ""}
      config={{
        appearance: {
          walletChainType: "solana-only",
          theme: "dark",
          accentColor: "#000000",
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
