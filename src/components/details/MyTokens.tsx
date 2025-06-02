'use client';

import { Geologica, Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import useFungibleTokens from '@/hooks/useFungibleTokes';
import { useAppConnection } from '@/providers/PrivyProvider';
import { formatNumber } from '@/utils';

const geologica = Geologica({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
});
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
});

export default function MyTokens() {
  const { connected, login, user } = useAppConnection();

  // If not connected, prompt to sign in
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 p-4">
        <p className="font-medium">Sign in to view your tokens</p>
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Connect / Sign In
        </button>
      </div>
    );
  }

  const address = user?.wallet?.address || '';
  const { fungibleTokens, loading, error } = useFungibleTokens(address);

  // Once loading finishes, if there are no tokens, render nothing
  if (!loading && !error && fungibleTokens.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <h2 className={`${instrumentSerif.className} text-lg font-semibold`}>
            My Tokens
          </h2>
          <Image src="/WatchSwap.svg" alt="watchlist" width={16} height={16} />
        </div>
        <Link
          href="/tokens/edit"
          className={`${geologica.className} text-xs text-gray-500`}
        >
          Edit
        </Link>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-gray-600">Loading tokens…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Token List */}
      {!loading &&
        !error &&
        fungibleTokens.slice(0, 5).map((token) => (
          <Link
            key={token.id}
            href={`/${token.id}`}
            className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-100 transition"
          >
            {/* Left: Icon + Name */}
            <div className="flex items-center gap-3">
              <img
                src={token.content?.links?.image}
                alt={token.content?.metadata.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded"
              />
              <div className="flex flex-col">
                <span
                  className={`${geologica.className} font-medium truncate`}
                >
                  {token.content?.metadata.name || 'Unknown'}
                </span>
                <span
                  className={`${geologica.className} text-xs text-gray-500 uppercase`}
                >
                  {token.content?.metadata.symbol || 'N/A'}
                </span>
              </div>
            </div>
            {/* Right: Price */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Image src="/MCAP.svg" alt="Market Cap" width={16} height={16} />
                <span className={`${geologica.className} font-medium`}>
                  ${formatNumber(token.token_info?.price_info?.total_price)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatNumber(
                  token.token_info?.price_info?.price_per_token
                )}{' '}
                SOL
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
