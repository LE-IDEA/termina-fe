'use client';

import Image from 'next/image';
import { Geologica, Instrument_Serif } from 'next/font/google';
import { useEffect, useState } from 'react';
import HottestCard from '@/components/details/HottestCard';
import HotList from '@/components/details/MyTokens';
import HotRecent from '@/components/details/HotRecent';
import SearchAdd from '@/components/details/SearchAdd';
import BalanceCard from '@/components/details/BalanceCard';
import ConnectButton from '@/components/ConnectComponent';
import { useAppConnection } from '@/providers/PrivyProvider';
import useFungibleTokens from '@/hooks/useFungibleTokes';
import { formatNumber } from '@/utils';
import { TrendingUpDown, Shuffle, Wallet, Shield } from 'lucide-react';

const geologica = Geologica({ weight: ['300', '400', '500', '600'], subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

export default function Page() {
  // Privy connection hook
  const { connected: isConnected, user, ready } = useAppConnection();
  const address = user?.wallet?.address;

  // Client-only guard
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch and simulate token data (always call hooks to maintain order)
  const { totalPrice, fungibleTokens, loading } = useFungibleTokens(address || '');

  // State for dynamic price simulation
  const [dynamicPrice, setDynamicPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(20);
  const [priceDirection, setPriceDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (totalPrice && !loading) setDynamicPrice(totalPrice);
  }, [totalPrice, loading]);

  useEffect(() => {
    if (!dynamicPrice || !isConnected) return;
    const interval = setInterval(() => {
      const randomChange = (Math.random() - 0.45) * 0.004;
      if (Math.random() > 0.7) setPriceDirection((prev) => (prev * -1) as 1 | -1);
      const newPrice = dynamicPrice * (1 + randomChange * priceDirection);
      setDynamicPrice(newPrice);
      setPriceChange((prev) => Math.max(15, Math.min(25, prev + randomChange * 100 * priceDirection)));
    }, 3000);
    return () => clearInterval(interval);
  }, [dynamicPrice, isConnected, priceDirection]);

  // Fetch top tokens for Market Trends
  const [topTokens, setTopTokens] = useState<any[]>([]);
  const [topTokensLoading, setTopTokensLoading] = useState(true);
  useEffect(() => {
    async function fetchTopTokens() {
      try {
        const res = await fetch('https://datapi.jup.ag/v1/pools/popular/24h');
        const data = await res.json();
        setTopTokens(data.pools.slice(0, 3));
      } catch (e) {
        console.error('Failed to fetch top tokens:', e);
      } finally {
        setTopTokensLoading(false);
      }
    }
    if (isConnected) fetchTopTokens();
  }, [isConnected]);

  // Do not render until client & auth ready
  if (!isClient || !ready) return null;

  return (
    <main className="min-h-screen flex flex-col">
      {!isConnected ? (
        <div className="mt-[12.5vh] w-fit mx-auto">
          <ConnectButton />
        </div>
      ) : (
        <div className="max-w-7xl gap-[24px] flex flex-col mb-[200px] px-8 mx-auto mt-8">
          {/* Top bar: Search + Connect */}
          <div className="flex w-full justify-between items-center mb-6">
            <SearchAdd />
            <ConnectButton />
          </div>

          {/* Greeting */}
          <div className="hidden md:flex w-full justify-between items-start mt-4 mb-6">
            <h1 className={`${instrumentSerif.className} font-bold text-[36px]`}>Gm mate</h1>
            <div className="flex items-center bg-[#EBEBEB] rounded-xl p-2 gap-2">
              <Image src="/glasses.svg" alt="Portfolio overview" width={24} height={24} />
              <span className={`${geologica.className} text-[12px]`}>Portfolio overview</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <BalanceCard />
            <HottestCard />
            <HotList />
            <HotRecent />
          </div>
        </div>
      )}
    </main>
  );
}
