'use client';

import React, { ReactNode } from 'react';
import { PrivyProvider, usePrivy, type PrivyClient } from '@privy-io/react-auth';

interface PrivyWalletProviderProps {
  /**
   * Your React application children elements
   */
  children: ReactNode;
}

/**
 * PrivyWalletProvider initializes Privy auth and embedded wallet support.
 *
 * Requirements:
 * - Add PRIVY_APP_ID to .env.local as NEXT_PUBLIC_PRIVY_APP_ID
 *
 * Configuration options below are examples; adjust as needed.
 */
export function PrivyWalletProvider({ children }: PrivyWalletProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
      config={{
        // Automatically create an embedded wallet for users without wallets
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // UI appearance settings
        appearance: {
          theme: 'light',
        },
        // Available login methods
        loginMethods: ['email', 'google', 'apple', 'twitter'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

/**
 * useAppConnection wraps usePrivy to expose a unified API:
 * - connected: boolean
 * - user: PrivyClient['user']
 * - ready: boolean
 * - login: () => Promise<void>
 * - logout: () => Promise<void>
 */
export function useAppConnection() {
  const { user, ready, login, logout, authenticated } = usePrivy();

  return {
    connected: authenticated,
    user,
    ready,
    login,
    logout,
  };
}

/**
 * Expose the underlying PrivyClient type for advanced use
 */
export type Provider = PrivyClient;

/**
 * Direct access to Privy client hooks
 */
export const useAppProvider = () => usePrivy();