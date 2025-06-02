'use client';

import Image from 'next/image';
import { Geologica } from 'next/font/google';
import { useEffect, useState } from 'react';
import BlackResponse from '@/components/details/BlackResponse';
import RedResponse from '@/components/details/RedResponse';
import { useAppConnection } from '@/providers/PrivyProvider';
import { toast } from 'react-hot-toast';

const geologica = Geologica({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
});

export default function ScalexConverterPage() {
  const { connected, user } = useAppConnection();
  const userAddress = user?.wallet?.address || '';
  const [address, setAddress] = useState(userAddress);

  const [isInputActive, setIsInputActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [blackResponse, setBlackResponse] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [isNairaFirst, setIsNairaFirst] = useState(false);
  const [naira, setNaira] = useState('');
  const [dollar, setDollar] = useState('');

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    // Fetch onramp/offramp rates
    const fetchRate = async () => {
      try {
        const res = await fetch('/api/exchangeRate');
        if (!res.ok) throw new Error('Failed to fetch exchange rate');
        const data = await res.json();
        setExchangeRate(
          isNairaFirst
            ? data.data.offramp.rate_in_ngn
            : data.data.onramp.rate_in_ngn
        );
      } catch (err) {
        console.error('Error fetching exchange rate', err);
        setError('Could not fetch exchange rate');
      }
    };
    fetchRate();
  }, [isNairaFirst]);

  // Handlers for inputs and switch
  const handleNairaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setNaira(v);
    if (exchangeRate) setDollar((+v / exchangeRate).toFixed(2));
  };
  const handleDollarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDollar(v);
    if (exchangeRate) setNaira((+v * exchangeRate).toFixed(2));
  };
  const handleSwitch = () => setIsNairaFirst((p) => !p);

  const handleSubmit = async () => {
    // Basic validation
    if (!address || !email || !naira || !dollar) {
      setError(
        !address
          ? 'Wallet address required'
          : !email
          ? 'Email is required'
          : 'Please enter an amount'
      );
      setBlackResponse(false);
      setResponse(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse(false);

    try {
      const res = await fetch('/api/scalex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: isNairaFirst ? Number(dollar) : Number(naira),
          address,
          email,
          type: isNairaFirst ? 'offramp' : 'onramp',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBlackResponse(false);
        toast.error('Transaction failed');
      } else {
        setBlackResponse(true);
        data.data?.link && window.open(data.data.link, '_blank');
        toast.success('Transaction initiated successfully');
      }
    } catch {
      setError('Failed to initiate transaction');
      setBlackResponse(false);
      toast.error('Failed to initiate transaction');
    } finally {
      setIsLoading(false);
      setResponse(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-auto rounded-[24px] md:w-[500px] sm:w-[400px] mt-16 md:mt-0">
      {/* Wallet Address Input */}
      <div className="flex items-center p-2 rounded-[12px] border">
        <input
          className={`${geologica.className} flex-1 text-[16px] outline-none`}
          placeholder={connected ? userAddress : 'Connect wallet to continue'}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={() => navigator.clipboard.writeText(address)}>
          <Image
            src="/AddressCopy.svg"
            alt="Copy"
            width={20}
            height={20}
            className="ml-2"
          />
        </button>
      </div>

      {/* Email Input */}
      <div className="flex p-2 rounded-[12px] border">
        <input
          className={`${geologica.className} flex-1 text-[16px] outline-none`}
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* On/Off Ramping Card */}
      <div className={`${response ? (blackResponse ? 'bg-black' : 'bg-red-100') : ''} rounded-[12px]`}>
        <div className={`flex gap-3 justify-between bg-white p-3 border rounded-[12px] ${
            response
              ? blackResponse
                ? 'border-black'
                : 'border-red-100'
              : ''
          }`}>
          <div className="flex-1 flex flex-col gap-2">
            {/* First Field */}
            <div>
              <label className="text-[10px] opacity-50">
                {isNairaFirst ? 'NGN' : 'USDC'}
              </label>
              <input
                className={`${geologica.className} w-full text-[20px] outline-none`}
                value={isNairaFirst ? naira : dollar}
                onChange={isNairaFirst ? handleNairaChange : handleDollarChange}
                placeholder="0.00"
              />
            </div>
            <div className="border-t opacity-50"></div>
            {/* Second Field */}
            <div>
              <label className="text-[10px] opacity-50">
                {isNairaFirst ? 'USDC' : 'NGN'}
              </label>
              <input
                className={`${geologica.className} w-full text-[20px] outline-none`}
                value={isNairaFirst ? dollar : naira}
                onChange={isNairaFirst ? handleDollarChange : handleNairaChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <button onClick={handleSwitch} className="p-2">
            <Image src="/refresh.svg" alt="Switch" width={20} height={20} />
          </button>
        </div>
        {/* Response Messages */}
        {response && (blackResponse ? <BlackResponse /> : <RedResponse errorMessage={error} />)}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !address}
        className={`flex justify-center items-center h-[43px] rounded-[12px] text-white ${
          isLoading
            ? 'bg-gray-400'
            : isInputActive && address
            ? 'bg-blue-500'
            : 'bg-gray-800'
        }`}
      >
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
}
