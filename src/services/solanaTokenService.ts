import { Connection, PublicKey } from "@solana/web3.js";
import { PriceDataPoint } from "@/components/charts/PriceChart";

// Define token data interface
export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

// Connection to Solana network
const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);

// Fallback RPC endpoints
const fallbackRPCs = [
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
];

// Jupiter API endpoint
const jupiterApiEndpoint = "https://price.jup.ag/v4";

// Solscan API endpoint
const solscanApiEndpoint = "https://public-api.solscan.io";

/**
 * Get token metadata from Jupiter API
 */
export const getTokenMetadataFromJupiter = async (
  tokenAddress: string
): Promise<TokenMetadata | null> => {
  try {
    const response = await fetch(`https://datapi.jup.ag/v1/pools?assetIds=${tokenAddress}`);
    
    if (!response.ok) throw new Error("Failed to fetch from Jupiter API");

    const data = await response.json();
    if (!data.data) return null;

    console.log(data.data);
    

    const tokenData = data.data;
    return {
      address: tokenAddress,
      name: tokenData.name || "Unknown Token",
      symbol: tokenData.symbol || "???",
      decimals: tokenData.decimals || 9,
      totalSupply: tokenData.totalSupply || 0,
      marketCap: tokenData.marketCap || 0,
      price: tokenData.price || 0,
      priceChange24h: tokenData.priceChange24h || 0,
      volume24h: tokenData.volume24h || 0,
      liquidity: tokenData.liquidity || 0,
    };
  } catch (error) {
    console.error("Error fetching token metadata from Jupiter:", error);
    return null;
  }
};

/**
 * Get token metadata from Solscan API (fallback)
 */
export const getTokenMetadataFromSolscan = async (
  tokenAddress: string
): Promise<TokenMetadata | null> => {
  try {
    const response = await fetch(`${solscanApiEndpoint}/token/${tokenAddress}`);
    if (!response.ok) throw new Error("Failed to fetch from Solscan API");

    const data = await response.json();
    if (!data) return null;

    return {
      address: tokenAddress,
      name: data.name || "Unknown Token",
      symbol: data.symbol || "???",
      decimals: data.decimals || 9,
      totalSupply: data.supply || 0,
      marketCap: data.marketCapFD || 0,
      price: data.priceUst || 0,
      priceChange24h: data.priceChange24h || 0,
      volume24h: data.volume24h || 0,
      liquidity: data.liquidity || 0,
    };
  } catch (error) {
    console.error("Error fetching token metadata from Solscan:", error);
    return null;
  }
};

/**
 * Get token price history from Jupiter API
 */
export const getTokenPriceHistoryFromJupiter = async (
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M"
): Promise<PriceDataPoint[]> => {
  try {
    // Map timeframe to Jupiter API parameters
    let interval: string;
    let limit: number;

    switch (timeframe) {
      case "1H":
        interval = "1m";
        limit = 60;
        break;
      case "1D":
        interval = "15m";
        limit = 96; // 24 * 4
        break;
      case "1W":
        interval = "1h";
        limit = 168; // 24 * 7
        break;
      case "1M":
        interval = "1d";
        limit = 30;
        break;
      default:
        interval = "15m";
        limit = 96;
    }

    const response = await fetch(
      `${jupiterApiEndpoint}/price/history?ids=${tokenAddress}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok)
      throw new Error("Failed to fetch price history from Jupiter");

    const data = await response.json();
    if (!data.data || !data.data[tokenAddress]) return [];

    // Map Jupiter data to our PriceDataPoint format
    return data.data[tokenAddress].map((item: any) => ({
      timestamp: item.time,
      price: item.price,
      marketCap: item.marketCap || item.price * (item.totalSupply || 0),
    }));
  } catch (error) {
    console.error("Error fetching price history from Jupiter:", error);
    return [];
  }
};

/**
 * Get token market cap history (calculate from price and supply)
 */
export const getTokenMarketCapHistory = async (
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M"
): Promise<PriceDataPoint[]> => {
  // First try Jupiter
  const jupiterData = await getTokenPriceHistoryFromJupiter(
    tokenAddress,
    timeframe
  );
  if (jupiterData.length > 0) return jupiterData;

  // If Jupiter fails, we'll calculate market cap history from price history and total supply
  try {
    // Get token metadata for total supply
    const metadata = await getTokenMetadata(tokenAddress);
    if (!metadata) throw new Error("Failed to get token metadata");

    const priceHistory = await getTokenPriceHistoryFallback(
      tokenAddress,
      timeframe
    );

    // Calculate market cap for each price point
    return priceHistory.map((point) => ({
      timestamp: point.timestamp,
      price: point.price,
      marketCap: point.price * metadata.totalSupply,
    }));
  } catch (error) {
    console.error("Error calculating market cap history:", error);
    return [];
  }
};

/**
 * Fallback method to get token price history
 */
const getTokenPriceHistoryFallback = async (
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M"
): Promise<PriceDataPoint[]> => {
  // Implement fallback logic here if needed - could use Solscan or other sources
  console.log("Using fallback price history method");

  // If all APIs fail, return mock data as a last resort
  return generateMockPriceData(timeframe);
};

/**
 * Get token metadata (combine Jupiter and Solscan data)
 */
export const getTokenMetadata = async (
  tokenAddress: string
): Promise<TokenMetadata | null> => {
  // Try Jupiter first
  const jupiterData = await getTokenMetadataFromJupiter(tokenAddress);
  if (jupiterData) return jupiterData;

  // If Jupiter fails, try Solscan
  const solscanData = await getTokenMetadataFromSolscan(tokenAddress);
  if (solscanData) return solscanData;

  // If all APIs fail, return null
  return null;
};

// Mock data generator as fallback for demo purposes
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

    // Add some randomness to price
    const change = (Math.random() - 0.5) * 0.05; // Random change between -0.025 and 0.025

    // For trending up or down, add a slight bias
    const trend = isUp ? 0.002 : -0.002;

    lastPrice = lastPrice + change + trend;

    // Ensure price doesn't go below a minimum value
    if (lastPrice < 0.5) lastPrice = 0.5;

    // Calculate market cap based on price
    lastMarketCap = lastPrice * 100000; // Simplified calculation

    data.push({
      timestamp,
      price: lastPrice,
      marketCap: lastMarketCap,
    });
  }

  return data;
};
