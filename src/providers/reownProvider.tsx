'use client';

import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useEffect } from 'react';

export function ReownProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter() as any, new SolflareWalletAdapter() as any]
    })

    const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

    const metadata = {
      name: 'Termina',
      description: 'Gas abstraction with improved UI for degening experience.',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://termina.fun',
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    };

    createAppKit({
      adapters: [solanaWeb3JsAdapter],
      networks: [solana, solanaTestnet, solanaDevnet],
      metadata: metadata,
      projectId,
      features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'apple'],
        emailShowWallets: true,
        onramp: false
      },
      themeMode: 'light'
    });
  }, []); 

  return <>{children}</>;
}