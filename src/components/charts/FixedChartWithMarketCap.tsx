import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import Moralis from 'moralis';


interface SimpleChartProps {
  tokenAddress?: string;
  marketCap?: number;       // Market cap to display
  priceChangePercent?: number; // Optional: price change percentage to display
  timeframe?: '1H' | '1D' | '1W' | '1M';
  height?: string;
  backgroundColor?: string;
  lineColorUp?: string;
  lineColorDown?: string;
  timeLabels?: boolean;
  priceLabels?: boolean;
}


interface PriceData {
  timestamps: string[];
  prices: number[];
}


// Helper function to safely convert a value to a number and format it
const formatNumber = (value: string | number, decimals: number = 2): string => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  } else {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return numValue.toFixed(decimals);
    }
    return '0.00'; // Default fallback
  }
};


// Helper to format market cap for display (e.g., $1.2M, $45K)
const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
  } else if (marketCap >= 1_000_000) {
    return `$${(marketCap / 1_000_000).toFixed(2)}M`;
  } else if (marketCap >= 1_000) {
    return `$${(marketCap / 1_000).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
};


// Helper to generate consistent mock data for development
const generateMockPriceData = (
  timeframe: '1H' | '1D' | '1W' | '1M',
  basePrice: number = 1.98,
  seed: number = 42
): PriceData => {
  // Use a deterministic seed for consistent random numbers
  const seededRandom = (min: number, max: number): number => {
    const x = Math.sin(seed++) * 10000;
    const rand = x - Math.floor(x);
    return min + rand * (max - min);
  };


  // Number of data points based on timeframe
  const numPoints = {
    '1H': 60,  // 1 minute intervals
    '1D': 48,  // 30 minute intervals
    '1W': 42,  // 4 hour intervals
    '1M': 30   // 1 day intervals
  }[timeframe];


  // Time interval in minutes
  const intervalMinutes = {
    '1H': 1,
    '1D': 30,
    '1W': 240,
    '1M': 1440
  }[timeframe];


  // Generate timestamps
  const now = new Date();
  const timestamps = Array.from({ length: numPoints }, (_, i) => {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - (numPoints - i - 1) * intervalMinutes);
   
    // Format based on timeframe
    if (timeframe === '1M' || timeframe === '1W') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  });


  // Create a trend direction (up or down) based on seed
  const trendDirection = seededRandom(0, 1) > 0.5 ? 1 : -1;
 
  // Volatility factor - higher for longer timeframes
  const volatilityFactor = {
    '1H': 0.02,
    '1D': 0.05,
    '1W': 0.08,
    '1M': 0.12
  }[timeframe];


  // Generate prices with consistent trend
  const prices = Array.from({ length: numPoints }, (_, i) => {
    const progress = i / (numPoints - 1);
    const trend = trendDirection * volatilityFactor * progress;
    const noise = seededRandom(-0.5, 0.5) * volatilityFactor * 0.5;
    return basePrice * (1 + trend + noise);
  });


  return { timestamps, prices };
};


const FixedChartWithMarketCap: React.FC<SimpleChartProps> = ({
  tokenAddress,
  marketCap = 175000,     // Default to 175K if not provided
  priceChangePercent,     // Price change percentage
  timeframe = '1D',
  height = '400px',
  backgroundColor = '#FFFFFF',
  lineColorUp = '#4CE666',  // Green for up trend
  lineColorDown = '#E64C4C', // Red for down trend
  timeLabels = true,
  priceLabels = true,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number>(priceChangePercent || 0);


  // Function to fetch price data from Moralis for Solana
  const fetchPriceDataFromMoralis = async (): Promise<void> => {
    try {
      setLoading(true);
     
      // Initialize Moralis if not already initialized
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
      }
     
      // Get the from date based on the timeframe
      const fromDate = getFromDate(timeframe);
     
      // Fetch token price from Moralis for Solana
      const response = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: tokenAddress || '',
      });
     
      if (response && response.result) {
        // Store current price
        const price = parseFloat(formatNumber(response.result.usdPrice ?? '0'));
        setCurrentPrice(price);
       
        // For historical data in a real app, you would fetch actual historical data here
        // Since we don't have that endpoint, we'll generate mock data with the real current price
        const mockData = generateMockPriceData(timeframe, price);
       
        // Make sure the last price matches the current price we got from the API
        if (mockData.prices.length > 0) {
          mockData.prices[mockData.prices.length - 1] = price;
        }
       
        setPriceData(mockData);
        
        // If price change percent wasn't provided, calculate it from the chart data
        if (priceChangePercent === undefined && mockData.prices.length > 0) {
          const firstPrice = mockData.prices[0];
          const lastPrice = mockData.prices[mockData.prices.length - 1];
          const calculatedChange = ((lastPrice - firstPrice) / firstPrice) * 100;
          setChangePercent(calculatedChange);
        }
      } else {
        throw new Error('Invalid response from Moralis');
      }
     
      setLoading(false);
    } catch (err) {
      console.error('Error fetching price data from Moralis:', err);
     
      // Fall back to mock data in development
      if (process.env.NODE_ENV === 'development') {
        createMockData();
      } else {
        setError((err as Error).message);
        setLoading(false);
      }
    }
  };
 
  // Helper function to determine the from_date based on timeframe
  const getFromDate = (timeframe: string): string => {
    const now = new Date();
    switch(timeframe) {
      case '1H':
        return new Date(now.setHours(now.getHours() - 1)).toISOString();
      case '1D':
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
      case '1W':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '1M':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
    }
  };


  // Create mock data for development/preview
  const createMockData = (): void => {
    // Use our reusable mock data generator
    const mockData = generateMockPriceData(timeframe);
    setPriceData(mockData);
   
    // Set the last price as current price
    if (mockData.prices.length > 0) {
      setCurrentPrice(mockData.prices[mockData.prices.length - 1]);
      
      // If price change percent wasn't provided, calculate it from the chart data
      if (priceChangePercent === undefined) {
        const firstPrice = mockData.prices[0];
        const lastPrice = mockData.prices[mockData.prices.length - 1];
        const calculatedChange = ((lastPrice - firstPrice) / firstPrice) * 100;
        setChangePercent(calculatedChange);
      }
    }
   
    setLoading(false);
  };


  // Whenever priceChangePercent prop changes, update the state
  useEffect(() => {
    if (priceChangePercent !== undefined) {
      setChangePercent(priceChangePercent);
    }
  }, [priceChangePercent]);


  // Fetch data when component mounts or tokenAddress/timeframe changes
  useEffect(() => {
    if (tokenAddress) {
      fetchPriceDataFromMoralis();
    } else if (process.env.NODE_ENV === 'development') {
      // Use mock data for development
      createMockData();
    }
  }, [tokenAddress, timeframe]);


  // Calculate price change metrics
  const priceMetrics = useMemo(() => {
    if (!priceData || priceData.prices.length === 0) return null;
   
    const firstPrice = priceData.prices[0];
    const lastPrice = priceData.prices[priceData.prices.length - 1];
    const isPriceGoingUp = lastPrice >= firstPrice;
    const priceChange = lastPrice - firstPrice;
    const percentChange = (priceChange / firstPrice * 100);
   
    return {
      firstPrice,
      lastPrice,
      isPriceGoingUp,
      priceChange,
      percentChange
    };
  }, [priceData]);


  // Create and update chart when data changes
  useEffect(() => {
    if (!priceData || loading || !chartRef.current || !priceMetrics) return;


    // Cleanup previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
   
    // Use the price metrics to determine if trend is up or down
    // OR use the provided/calculated change percent
    const isGoingUp = changePercent >= 0;
    const lineColor = isGoingUp ? lineColorUp : lineColorDown;


    // Create gradient for area under the line
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
   
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `${lineColor}40`); // 40 is hex for 25% opacity
    gradient.addColorStop(1, `${backgroundColor}00`); // Transparent at bottom


    // Format timestamps for chart display based on timeframe
    const displayLabels = priceData.timestamps.map((timestamp, index) => {
      // For longer timeframes, make labels less dense
      if (timeframe === '1W' || timeframe === '1M') {
        if (index % 3 === 0 || index === priceData.timestamps.length - 1) {
          return timestamp;
        }
        return '';
      }
      return timestamp;
    });


    // Create the chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: displayLabels,
        datasets: [{
          label: 'Price',
          data: priceData.prices,
          borderColor: lineColor,
          borderWidth: 2,
          tension: 0.4, // Smoother curve
          pointRadius: 0, // Hide points
          pointHoverRadius: 5, // Show points on hover
          pointBackgroundColor: lineColor,
          backgroundColor: gradient,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#242424',
            titleColor: '#fff',
            bodyColor: '#fff',
            titleFont: {
              family: "'Geologica', sans-serif",
              size: 14,
            },
            bodyFont: {
              family: "'Geologica', sans-serif",
              size: 12,
            },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                // Safely format the value using our helper function
                const value = context.parsed.y;
                return `$${formatNumber(value)}`;
              }
            }
          },
        },
        scales: {
          x: {
            display: timeLabels,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "'Geologica', sans-serif",
                size: 10,
              },
              color: '#68738D',
              maxRotation: 0, // Don't rotate labels
              maxTicksLimit: timeframe === '1H' ? 6 : 8, // Fewer ticks for readability
              callback: function(index) {
                // Show fewer labels for readability
                const numericIndex = Number(index);
                const label = displayLabels[numericIndex];
                if (timeframe === '1H' || timeframe === '1D') {
                  if (numericIndex === 0 || numericIndex === displayLabels.length - 1 || numericIndex % 8 === 0) {
                    return label;
                  }
                  return '';
                }
                return label;
              }
            }
          },
          y: {
            display: priceLabels,
            position: 'right',
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "'Geologica', sans-serif",
                size: 10,
              },
              color: '#68738D',
              callback: function(value) {
                // Safely format tick values
                return `$${formatNumber(value)}`;
              }
            }
          }
        }
      }
    });


    // Add market cap and price change details overlay
    const changeInfo = document.getElementById('price-change-info');
    if (changeInfo) {
      // Format the market cap
      const formattedMarketCap = formatMarketCap(marketCap);
      
      // Use the provided/calculated change percent
      const formattedChangePercent = formatNumber(Math.abs(changePercent));
      const changeSign = changePercent >= 0 ? '+' : '-';
      const changeColor = changePercent >= 0 ? lineColorUp : lineColorDown;
      
      // Show market cap instead of price, with the correct percentage change
      changeInfo.innerHTML = `
        <div class="market-cap-value" style="font-size: 18px; font-weight: 500;">${formattedMarketCap}</div>
        <div class="price-change" style="color: ${changeColor}; font-size: 14px;">
          ${changeSign}${formattedChangePercent}%
        </div>
      `;
    }
  }, [priceData, loading, backgroundColor, lineColorUp, lineColorDown, timeLabels, priceLabels, priceMetrics, timeframe, marketCap, changePercent]);


  if (loading) {
    return (
      <div style={{
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}>
        <div>Loading chart...</div>
      </div>
    );
  }


  if (error) {
    return (
      <div style={{
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}>
        <div>Error loading chart: {error}</div>
      </div>
    );
  }


  return (
    <div style={{
      position: 'relative',
      height: height,
      backgroundColor: backgroundColor,
      borderRadius: '12px',
      padding: '16px',
    }}>
      <div id="price-change-info" style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 5,
        fontFamily: "'Geologica', sans-serif",
      }}>
        {/* Market cap and price change will be inserted here */}
      </div>
      <canvas ref={chartRef} height={height} />
    </div>
  );
};


export default FixedChartWithMarketCap;