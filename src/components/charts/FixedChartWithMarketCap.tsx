import { useState, useEffect } from 'react';
import PriceChart from './PriceChart';
import { fetchPriceData, isPriceUp } from '@/services/priceDataService';
import { formatNumber } from '@/lib/utils';

import { PriceDataPoint } from './PriceChart';
import useTokenData from '@/hooks/useTokenData';

interface FixedChartWithMarketCapProps {
  tokenAddress: string;
  marketCap?: number;
  priceChangePercent?: number;
  timeframe: '1H' | '1D' | '1W' | '1M';
  backgroundColor?: string;
  lineColorUp?: string;
  lineColorDown?: string;
  height?: string;
  showMarketCap?: boolean;
}

const FixedChartWithMarketCap = ({
  tokenAddress,
  marketCap = 0,
  priceChangePercent,
  timeframe,
  backgroundColor = '#FFFFFF',
  height = '400px',
  showMarketCap = true,
}: FixedChartWithMarketCapProps) => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceUp, setPriceUp] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<{
    name?: string;
    symbol?: string;
    marketCap?: number;
  } | null>(null);

  const { analyticsData } = useTokenData(tokenAddress);

  useEffect(() => {
    const getTokenInfo = async () => {
      try {

          setTokenInfo({
            name: analyticsData?.baseAsset.name,
            symbol: analyticsData?.baseAsset.symbol,
            marketCap: analyticsData?.baseAsset.mcap,
          });

      } catch (err) {
        console.error('Error fetching token info:', err);
      }
    };

    if (tokenAddress) {
      getTokenInfo();
    }
  }, [tokenAddress]);

  useEffect(() => {
    const getPriceData = async () => {
      try {
        setLoading(true);
        const priceData = await fetchPriceData(tokenAddress, timeframe);
        setData(priceData); // Changed setPriceData to setData
        setPriceUp(isPriceUp(priceData));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError('Failed to load price data');
        setLoading(false);
      }
    };

    if (tokenAddress) {
      getPriceData();
    }
  }, [tokenAddress, timeframe]);

  // Calculate market cap from price data if not provided
  const displayMarketCap = tokenInfo?.marketCap

  // Calculate or use provided price change percentage
  const calculatedPriceChange = priceChangePercent ?? (data.length >= 2 // Changed priceData to data
    ? ((data[data.length - 1]?.price - data[0]?.price) / data[0]?.price) * 100 // Changed marketCap to price (assuming this is what you meant)
    : 0);

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ height, backgroundColor }}>
      {/* Chart overlay info */}
      <div className="flex justify-between p-4">
        <div>
          <div className="text-sm text-gray-500">Market Cap</div>
          <div className="text-xl font-medium">${formatNumber(displayMarketCap ?? 0)}</div>
        </div>
        {calculatedPriceChange !== undefined && (
          <div>
            <div className="text-sm text-gray-500">Change ({timeframe})</div>
            <div 
              className={`text-xl font-medium ${calculatedPriceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {calculatedPriceChange >= 0 ? '+' : ''}{calculatedPriceChange.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Price chart */}
      <PriceChart
        data={data} // Changed priceData to data
        timeframe={timeframe}
        isLoading={loading}
        isPriceUp={priceUp}
        height="75%"
        showMarketCap={showMarketCap}
      />
      
      {error && (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default FixedChartWithMarketCap;