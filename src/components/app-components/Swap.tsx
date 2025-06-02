'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VersionedTransaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppConnection } from '@/providers/PrivyProvider';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '../ui/input';
import SwapSlippage from '@/components/details/SwapSlippage';
import TokenSearchModal from './TokenModal';
import useTokens from '@/hooks/useTokens';
import { debounce } from '@/utils';
import { useSwap } from '@/hooks/useSwap';
import { useSolBalance } from '@/hooks/useSolBalance';
import { formatBalance } from '@/utils/formattedbalances';

export default function Swap({ initialFromAsset, initialToAsset }) {
  // 1️⃣ Privy authentication
  const { connected, login } = useAppConnection();
  if (!connected) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <p className="text-lg">Please sign in to swap</p>
        <Button onClick={login}>Connect / Sign In</Button>
      </div>
    );
  }

  // 2️⃣ Solana connection & wallet
  const { connection } = useConnection();
  const wallet = useWallet();

  // 3️⃣ Tokens & balances
  const { tokens } = useTokens();
  const { balances, balancesLoading } = useSolBalance({
    connection,
    publicKey: wallet.publicKey,
  });

  // 4️⃣ Swap hook
  const {
    quoteResponse,
    estimatedFee,
    swapping,
    toAmount,
    debounceQuoteCall,
    signAndSendTransaction,
  } = useSwap({ connection, walletProvider: wallet });

  // 5️⃣ Local state
  const [fromAsset, setFromAsset] = useState(initialFromAsset || tokens[0]);
  const [toAsset, setToAsset]     = useState(initialToAsset || tokens[1] || tokens[0]);
  const [fromAmount, setFromAmount] = useState('');

  // 6️⃣ Initialize defaults once tokens load
  useEffect(() => {
    if (tokens.length >= 2) {
      setFromAsset(initialFromAsset || tokens[0]);
      setToAsset(initialToAsset || tokens[1]);
    }
  }, [tokens, initialFromAsset, initialToAsset]);

  // 7️⃣ Handle input & direction
  const handleFromChange = token => { setFromAsset(token); setFromAmount(''); };
  const handleToChange   = token => setToAsset(token);
  const handleAmount     = e => {
    const v = e.target.value;
    if (!v || (!isNaN(+v) && +v >= 0)) setFromAmount(v);
  };
  const handleDirection = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount(toAmount || '');
  };

  // 8️⃣ Debounce quoting
  const getQuote = async amt => {
    if (!amt || !fromAsset || !toAsset) return;
    try {
      const res = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset.address}&outputMint=${toAsset.address}` +
        `&amount=${Math.floor(amt * 10**(fromAsset.decimals||9))}&slippage=0.5`
      );
      const js = await res.json();
      if (js?.outAmount) {
        setFromAmount(amt.toString());
      }
    } catch {}
  };
  const debounced = useCallback(debounce(getQuote, 500), [fromAsset, toAsset]);
  useEffect(() => {
    if (fromAmount && +fromAmount > 0) debounced(+fromAmount);
  }, [fromAmount, debounced]);

  // 9️⃣ Fee/Total helpers
  const formatFee = f => f ? `~$${(f * 20).toFixed(2)}` : '—';
  const totalWithFee = () =>
    fromAmount && estimatedFee
      ? `${(Number(fromAmount) + estimatedFee).toFixed(4)} ${fromAsset.symbol}`
      : '—';
  const rate =
    quoteResponse && fromAmount
      ? (Number(toAmount) / Number(fromAmount)).toFixed(6)
      : null;

  // ⓫ Disable logic
  const swapDisabled =
    !fromAmount ||
    !toAmount ||
    Number(fromAmount) <= 0 ||
    toAsset.address === fromAsset.address ||
    swapping;

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-4 space-y-4">
        {/* You Pay */}
        <div className="bg-zinc-800 rounded-2xl p-4">
          <div className="flex justify-between text-gray-400 mb-2">
            <span>You pay</span>
            <span>
              {formatBalance({
                token: fromAsset,
                balance: balances[fromAsset.address],
                isLoading: balancesLoading,
                isWalletConnected: !!wallet.publicKey,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="0.0"
              value={fromAmount}
              onChange={handleAmount}
              className="bg-transparent text-white text-2xl flex-1"
            />
            <TokenSearchModal
              onSelect={handleFromChange}
              defaultToken={fromAsset}
            />
          </div>
        </div>

        {/* Switch */}
        <div className="flex justify-center">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={handleDirection}
          >
            <ArrowUpDown />
          </Button>
        </div>

        {/* You Receive */}
        <div className="bg-zinc-800 rounded-2xl p-4">
          <div className="flex justify-between text-gray-400 mb-2">
            <span>You receive</span>
            <span>
              {formatBalance({
                token: toAsset,
                balance: balances[toAsset.address],
                isLoading: balancesLoading,
                isWalletConnected: !!wallet.publicKey,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="0.0"
              value={toAmount || ''}
              readOnly
              className="bg-transparent text-white text-2xl flex-1"
            />
            <TokenSearchModal
              onSelect={handleToChange}
              defaultToken={toAsset}
            />
          </div>
        </div>

        {/* Slippage */}
        <SwapSlippage />

        {/* Fee & Rate Display */}
        <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Network Fee</span><span>{formatFee(estimatedFee)}</span>
          </div>
          {rate && (
            <div className="flex justify-between">
              <span>Rate</span>
              <span>1 {fromAsset.symbol} = {rate} {toAsset.symbol}</span>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <Button
          className="w-full bg-blue-700 py-3 text-lg text-white rounded-full"
          onClick={signAndSendTransaction}
          disabled={swapDisabled}
        >
          {swapping ? 'Swapping…' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  );
}
