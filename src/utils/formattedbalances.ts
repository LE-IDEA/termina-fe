// utils/formatters.ts
type Token = {
  address?: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals?:number
}
  
  interface FormatBalanceOptions {
    token: Token | null;
    balance?: number;
    decimals?: number;
    isLoading?: boolean;
    isWalletConnected?: boolean;
    maximumFractionDigits?: number;
  }
  
  export function formatBalance({
    token,
    balance = 0,
    isLoading = false,
    isWalletConnected = true,
    maximumFractionDigits = 4,
  }: FormatBalanceOptions): string {
    if (!token || isLoading) return "Loading...";
    if (!isWalletConnected) return "Connect wallet";
  
    const formattedBalance = balance / Math.pow(10, token.decimals || 9);
    
    return `Balance: ${formattedBalance.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    })} ${token.symbol}`;
  }
  
  // Optional hook for components that need balance formatting
  export function useFormattedBalance(options: Omit<FormatBalanceOptions, 'isWalletConnected'> & {
    walletProvider?: { publicKey: { toString: () => string } | null };
  }) {
    const { token, balance, isLoading, walletProvider, maximumFractionDigits } = options;
    
    const formatted = formatBalance({
      token,
      balance,
      isLoading,
      isWalletConnected: !!walletProvider?.publicKey,
      maximumFractionDigits,
    });
  
    return formatted;
  }