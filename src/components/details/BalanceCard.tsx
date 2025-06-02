'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Geologica, Instrument_Serif } from 'next/font/google';
import { useAppConnection } from '@/providers/PrivyProvider';
import useFungibleTokens from '@/hooks/useFungibleTokes';
import CurrencyChange, { CurrencyItem } from './CurrencyChange';

const geologica = Geologica({ weight: ['300', '400', '500', '600'], subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

export default function BalanceCard() {
  const { connected, user, ready } = useAppConnection();
  const address = user?.wallet?.address ?? '';
  const { totalPrice, loading } = useFungibleTokens(connected ? address : '');

  // Dynamic price simulation
  const [dynamicPrice, setDynamicPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceDirection, setPriceDirection] = useState(1);

  // Currency dropdown state
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>({
    id: 4,
    imgURL: '/USDC.png',
    curName: 'USDC',
    curCode: 'USDC',
    symbol: '$',
    conversionRate: 1,
  });

  // ref to the dropdown container
  const menuAnchor = useRef<HTMLDivElement>(null);

  // Initialize dynamicPrice once totalPrice is available
  useEffect(() => {
    if (totalPrice !== undefined && !loading) {
      setDynamicPrice(totalPrice);
    }
  }, [totalPrice, loading]);

  // Simulate small fluctuations every 3 seconds
  useEffect(() => {
    if (loading || dynamicPrice === 0) return;
    const iv = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.003; // ±0.15%
      if (Math.random() > 0.7) {
        setPriceDirection(d => -d);
      }
      setDynamicPrice(p => p * (1 + delta * priceDirection));
      setPriceChange(c => {
        let next = c + delta * 100 * priceDirection;
        if (next > 100) next = 100;
        if (next < -100) next = -100;
        return next;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, [dynamicPrice, loading, priceDirection]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuOpen && menuAnchor.current && !menuAnchor.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  // Copy address helper
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied!');
    } catch {
      toast.error('Failed to copy address.');
    }
  };

  // Avoid rendering until Privy is ready
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4 w-full relative">
      {/* Main Card */}
      <div className="bg-gray-100 p-5 rounded-xl flex flex-col justify-between">
        <div className="flex justify-between items-start">
          {/* Display dynamic price × conversionRate */}
          <h1 className={`${instrumentSerif.className} text-3xl font-medium`}>
            {loading
              ? 'Loading…'
              : `${selectedCurrency.symbol}${(dynamicPrice * selectedCurrency.conversionRate).toFixed(2)}`}
          </h1>

          {/* Currency selector */}
          <div className="relative" ref={menuAnchor}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-haspopup="menu"
              className="p-1"
              title="Change currency"
            >
              <Image src="/ArrowDown.svg" alt="▼" width={18} height={18} />
            </button>
            <Image
              src={selectedCurrency.imgURL}
              alt={selectedCurrency.curCode}
              width={36}
              height={36}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 z-50">
                <CurrencyChange
                  currencies={[
                    {
                      id: 1,
                      imgURL: '/Nigeria.png',
                      curName: 'Nigerian Naira',
                      curCode: 'NGN',
                      symbol: '₦',
                      conversionRate: 0.0023,
                    },
                    {
                      id: 2,
                      imgURL: '/UK.png',
                      curName: 'British Pound',
                      curCode: 'GBP',
                      symbol: '£',
                      conversionRate: 1.25,
                    },
                    {
                      id: 3,
                      imgURL: '/Solana.svg',
                      curName: 'Solana',
                      curCode: 'SOL',
                      symbol: '◎',
                      conversionRate: dynamicPrice, // show price in SOL
                    },
                    {
                      id: 4,
                      imgURL: '/USDC.png',
                      curName: 'USDC',
                      curCode: 'USDC',
                      symbol: '$',
                      conversionRate: 1,
                    },
                  ]}
                  selectedCurrency={selectedCurrency}
                  onCurrencySelect={c => {
                    setSelectedCurrency(c);
                    setMenuOpen(false);
                  }}
                  onClose={() => setMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Price change indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`w-2 h-2 rounded-full ${
              priceChange >= 0 ? 'bg-green-500' : 'bg-red-500'
            } transition-colors`}
          />
          <p
            className={`${geologica.className} text-xs ${
              priceChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(2)}%
          </p>
        </div>

        {/* Address & Copy */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            {address ? `${address.slice(0, 6)}…${address.slice(-6)}` : '—'}
          </p>
          <button onClick={copyToClipboard} className="p-1">
            <Image src="/Copy.svg" alt="Copy" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* Add / Withdraw buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/add" legacyBehavior>
          <a className="flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 transition">
            <Image src="/Add.svg" alt="Add" width={24} height={24} />
            <span className={`${geologica.className} text-lg`}>Add</span>
          </a>
        </Link>
        <Link href="/withdraw" legacyBehavior>
          <a className="flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 transition">
            <Image src="/Withdraw.svg" alt="Withdraw" width={24} height={24} />
            <span className={`${geologica.className} text-lg`}>Withdraw</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
