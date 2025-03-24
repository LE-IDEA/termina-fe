/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "static.jup.ag",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: `*.ipfs.nftstorage.link`,
      },
      {
        protocol: "https",
        hostname: "griffain.com",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "image-cdn.solana.fm",
      },
      {
        protocol: "https",
        hostname: `*.fs1.hubspotusercontent-na1.net`,
      },
      {
        protocol: "https",
        hostname: `sgp1.vultrobjects.com`,
      },
      {
        protocol: "https",
        hostname: `*.imgur.com`,
      },
      {
        protocol: "https",
        hostname: `static.grassfoundation.io`,
      },
      {
        protocol: "https",
        hostname: `*.jito.network`,
      },
      {
        protocol: "https",
        hostname: `*.drift.foundation`,
      },
      {
        protocol: "https",
        hostname: `*.genesysgo.net`,
      },
      {
        protocol: "https",
        hostname: `hebbkx1anhila5yf.public.blob.vercel-storage.com`,
      }
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
