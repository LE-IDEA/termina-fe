import { PriceDataPoint } from "@/components/charts/PriceChart";
import { getTokenMarketCapHistory } from "./solanaTokenService";

// Function to fetch price and market cap data based on timeframe
export const fetchPriceData = async (
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M"
): Promise<PriceDataPoint[]> => {
  try {
    console.log(`Fetching ${timeframe} data for token: ${tokenAddress}`);

    // Get market cap history from our API service
    const data = await getTokenMarketCapHistory(tokenAddress, timeframe);

    if (data.length === 0) {
      console.warn("No data returned, using fallback");
      // Generate mock data with 70% chance of trending up as fallback
      const isUp = Math.random() > 0.3;
      return generateMockPriceData(timeframe, isUp);
    }

    return data;
  } catch (error) {
    console.error("Error fetching price data:", error);
    // Return mock data if API fails
    const isUp = Math.random() > 0.3;
    return generateMockPriceData(timeframe, isUp);
  }
};

// Function to check if price is trending up
export const isPriceUp = (data: PriceDataPoint[]): boolean => {
  if (data.length < 2) return true;

  // Check if the market cap is trending up and ensure data points exist
  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  
  if (!lastPoint?.marketCap || !firstPoint?.marketCap) return true;
  return lastPoint.marketCap >= firstPoint.marketCap;
};

// Mock data generator for demo purposes (fallback)
const generateMockPriceData = (
  timeframe: "1H" | "1D" | "1W" | "1M",
  isUp: boolean = true
): PriceDataPoint[] => {
  const now = Date.now();
  const data: PriceDataPoint[] = [];
  let interval: number;
  let count: number;

  // Set interval and count based on timeframe
  switch (timeframe) {
    case "1H":
      interval = 60 * 1000; // 1 minute
      count = 60; // 60 minutes
      break;
    case "1D":
      interval = 15 * 60 * 1000; // 15 minutes
      count = 24 * 4; // 24 hours
      break;
    case "1W":
      interval = 4 * 60 * 60 * 1000; // 4 hours
      count = 42; // 7 days
      break;
    case "1M":
      interval = 24 * 60 * 60 * 1000; // 1 day
      count = 30; // 30 days
      break;
    default:
      interval = 15 * 60 * 1000;
      count = 24 * 4;
  }

  // Generate base price and market cap
  const basePrice = 1.98;
  const baseMarketCap = 175000; // $175k market cap
  let lastPrice = basePrice;
  let lastMarketCap = baseMarketCap;

  // Create data points from oldest to newest
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * interval;

    // Add some randomness to market cap
    const change = (Math.random() - 0.5) * 0.05; // Random change between -0.025 and 0.025

    // For trending up or down, add a slight bias
    const trend = isUp ? 0.002 : -0.002;

    lastPrice = lastPrice + change + trend;

    // Ensure price doesn't go below a minimum value
    if (lastPrice < 0.5) lastPrice = 0.5;

    // Calculate market cap based on price change
    lastMarketCap = lastMarketCap * (1 + change + trend);

    // Ensure market cap doesn't go below a minimum value
    if (lastMarketCap < 50000) lastMarketCap = 50000;

    data.push({
      timestamp,
      price: lastPrice,
      marketCap: lastMarketCap,
    });
  }

  return data;
};
