export interface Pool {
    audit: any;
    id: string;
    chain: string;
    dex: string;
    type: string;
    baseAsset: BaseAsset;
    quoteAsset: string;
    createdAt: string; 
    liquidity: number;
    volume24h: number;
    updatedAt: string; 
  }
  
  export interface BaseAsset {
    dev?: string;
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    twitter: string;
    website: string;
    circSupply: number;
    totalSupply: number;
    tokenProgram: string;
    firstPool: FirstPool;
    holderCount: number;
    fdv: number;
    mcap: number;
    usdPrice: number;
    liquidity: number;
    stats5m: Stats;
    stats1h: Stats;
    stats6h: Stats;
    stats24h: Stats;
    audit: Audit;
    organicScore: number;
    organicBuyers24h: number;
    organicScoreLabel: string;
    ctLikes: number;
    smartCtLikes: number;
    isVerified: boolean;
    cexes: string[];
    tags: string[];
  }
  
  export interface FirstPool {
    Id: string;
    Dex: string;
    CreatedAt: string; 
  }
  
  export interface Stats {
    priceChange: number;
    holderChange: number;
    buyVolume: number;
    sellVolume: number;
    buyOrganicVolume: number;
    sellOrganicVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numBuyers: number;
    numSellers: number;
    numOrganicBuyers: number;
  }
  
  export interface Audit {
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage: number;
  }
  