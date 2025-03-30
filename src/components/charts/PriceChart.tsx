import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

// Type for the price data point
export interface PriceDataPoint {
  timestamp: number;
  price: number;
  marketCap?: number;
}

// Props for the chart component
interface PriceChartProps {
  data: PriceDataPoint[];
  timeframe: '1H' | '1D' | '1W' | '1M';
  isLoading?: boolean;
  isPriceUp?: boolean;
  height?: string | number;
  width?: string | number;
  showMarketCap?: boolean;
}

const PriceChart = ({
  data,
  timeframe,
  isLoading = false,
  isPriceUp = true,
  height = 400,
  width = '100%',
  showMarketCap = true,
}: PriceChartProps) => {
  // Calculate market cap change
  const marketCapChange = useMemo(() => {
    if (data.length < 2) return 0;
    
    const firstMarketCap = data[0].marketCap || data[0].price * 100000;
    const lastMarketCap = data[data.length - 1].marketCap || data[data.length - 1].price * 100000;
    
    return ((lastMarketCap - firstMarketCap) / firstMarketCap) * 100;
  }, [data]);

  // Format the timestamp based on the timeframe
  const formatXAxis = (timestamp: number) => {
    switch (timeframe) {
      case '1H':
        return format(new Date(timestamp), 'HH:mm');
      case '1D':
        return format(new Date(timestamp), 'HH:mm');
      case '1W':
        return format(new Date(timestamp), 'dd MMM');
      case '1M':
        return format(new Date(timestamp), 'dd MMM');
      default:
        return format(new Date(timestamp), 'HH:mm');
    }
  };

  // Custom tooltip that displays price, market cap and timestamp
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white shadow-lg rounded-md border border-gray-200">
          <p className="font-medium">
            ${data.price.toFixed(4)}
          </p>
          <p className="text-sm text-gray-500">
            Market Cap: ${formatNumber(data.marketCap || data.price * 100000)}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(data.timestamp), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">No price data available</p>
      </div>
    );
  }

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4CE666" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4CE666" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E64C4C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#E64C4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            dataKey={showMarketCap ? "marketCap" : "price"}
            domain={['auto', 'auto']} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => showMarketCap ? `$${formatNumber(value)}` : `$${value.toFixed(2)}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={showMarketCap ? "marketCap" : "price"}
            stroke={isPriceUp ? "#4CE666" : "#E64C4C"}
            strokeWidth={2}
            fillOpacity={1}
            fill={isPriceUp ? "url(#colorUp)" : "url(#colorDown)"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;