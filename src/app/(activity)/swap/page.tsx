'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Geologica, Instrument_Serif } from 'next/font/google';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppConnection } from '@/providers/PrivyProvider';  // ← Privy auth
import useTokens from '@/hooks/useTokens';
import TokenSearchModal from '@/components/app-components/TokenModal';
import { useSolBalance } from '@/hooks/useSolBalance';
import { useSwap } from '@/hooks/useSwap';
import SwapSlippage from '@/components/details/SwapSlippage';
import SearchAdd from '@/components/details/SearchAdd';

const geologica = Geologica({ weight: ['300','400','500','600'], subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

export default function SwapPage() {
  // 1) Privy authentication
  const { connected, login } = useAppConnection();
  // If not logged in, show sign-in button and nothing else
  if (!connected) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl">Please sign in to access swaps</h2>
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Connect / Sign In
        </button>
      </div>
    );
  }

  // 2) Solana connection & wallet (for on-chain signing)
  const { connection } = useConnection();
  const wallet = useWallet();

  // 3) Tokens list
  const { tokens } = useTokens();

  // 4) Swap hook
  const {
    quoteResponse,
    estimatedFee,
    swapping,
    toAmount,
    debounceQuoteCall,
    signAndSendTransaction,
  } = useSwap({ connection, walletProvider: wallet });

  // 5) Refresh SOL balance after swap
  const { fetchSolBalance } = useSolBalance({
    connection,
    publicKey: wallet.publicKey,
  });

  // 6) Local state
  const [fromAsset, setFromAsset] = useState(tokens[0]);
  const [toAsset, setToAsset]     = useState(tokens[1] || tokens[0]);
  const [fromAmount, setFromAmount] = useState('');
  const [transactionID, setTransactionID] = useState<string|null>(null);

  // 7) Popular quick-picks
  const popular = ['SOL','USDC','RAY','JUP','BONK'];
  const popularMap: Record<string,string> = {
    SOL:  'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    RAY:  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    JUP:  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  };

  // 8) Handlers
  const handleFromChange = (token) => { setFromAsset(token); setFromAmount(''); };
  const handleToChange   = (token) => setToAsset(token);
  const handleAmount     = (e) => {
    const v = e.target.value;
    if (!v || (!isNaN(+v) && +v >= 0)) setFromAmount(v);
  };
  const handleDirection = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount(toAmount || '');
  };

  // 9) Fetch quote on amount change
  useEffect(() => {
    if (fromAmount && fromAsset && toAsset) {
      debounceQuoteCall(Number(fromAmount), fromAsset, toAsset);
    }
  }, [fromAmount, fromAsset, toAsset, debounceQuoteCall]);

  // 10) Perform the on-chain swap
  const handleSwap = async () => {
    const txid = await signAndSendTransaction();
    if (txid) {
      fetchSolBalance();
      setTransactionID(txid);
      setFromAmount('');
      // TODO: record trade to your database here, using Privy user ID
    }
  };

  const swapDisabled = 
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset.address === fromAsset.address ||
    swapping;

  // 11) UI helpers
  const formatFee     = (fee) => fee ? `~$${(fee*20).toFixed(2)}` : '—';
  const totalWithFee  = () => fromAmount && estimatedFee
    ? `${(Number(fromAmount)+estimatedFee).toFixed(4)} ${fromAsset.symbol}`
    : '—';
  const swapRate = quoteResponse && fromAmount
    ? (Number(toAmount)/Number(fromAmount)).toFixed(6)
    : null;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Search bar + no more Connect button */}
      <SearchAdd />

      {/* Popular tokens */}
      <div className="flex flex-wrap gap-2">
        {popular.map(sym => (
          <button
            key={sym}
            className={`px-3 py-1 text-sm rounded-full ${
              fromAsset.symbol === sym
                ? 'bg-blue-600 text-white'
                : toAsset.symbol === sym
                ? 'bg-green-600 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => {
              const addr = popularMap[sym];
              const tok = tokens.find(t => t.address === addr);
              if (tok) {
                if (fromAsset.symbol === sym) handleDirection();
                else handleFromChange(tok);
              }
            }}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Swap card */}
      <section className="border rounded-xl bg-white p-6 space-y-4">
        {/* From */}
        <div className="flex items-center justify-between">
          <TokenSearchModal onSelect={handleFromChange} defaultToken={fromAsset} />
          <input
            className="w-24 text-right text-2xl font-medium outline-none"
            placeholder="0.0"
            value={fromAmount}
            onChange={handleAmount}
          />
        </div>

        {/* Switch */}
        <div className="flex justify-center">
          <button onClick={handleDirection}>
            <Image src="/Interswap.svg" width={24} height={24} alt="Swap" />
          </button>
        </div>

        {/* To */}
        <div className="flex items-center justify-between">
          <TokenSearchModal onSelect={handleToChange} defaultToken={toAsset} />
          <div className="w-24 text-right text-2xl font-medium">
            {toAmount || '0.0'}
          </div>
        </div>

        {/* Fee & Total */}
        <div className="flex justify-between text-sm text-gray-600">
          <div>Fee: {formatFee(estimatedFee)}</div>
          <div>Total: {totalWithFee()}</div>
        </div>
      </section>

      {/* Slippage */}
      <SwapSlippage />

      {/* Confirm */}
      <button
        onClick={handleSwap}
        disabled={swapDisabled}
        className={`w-full py-3 rounded-xl text-white ${
          swapDisabled ? 'bg-gray-400' : 'bg-blue-600'
        }`}
      >
        {swapping ? 'Swapping...' : 'Confirm Swap'}
      </button>

      {/* Rate */}
      {swapRate && (
        <div className="border rounded-lg bg-gray-50 p-3 text-center text-gray-800">
          1 {fromAsset.symbol} ≈ {swapRate} {toAsset.symbol}
        </div>
      )}

      {/* TX Link */}
      {transactionID && (
        <div className="text-center">
          <Link
            href={`https://solscan.io/tx/${transactionID}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View TX: {transactionID.slice(0, 8)}…
          </Link>
        </div>
      )}
    </main>
  );
}
