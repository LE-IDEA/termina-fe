import axios from 'axios';
import base58 from 'bs58';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  Commitment,
  ConfirmOptions,
  RpcResponseAndContext,
  BlockhashWithExpiryBlockHeight,
  SignatureStatus,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

// ============= Types =============

export type TokenFee = {
  mint: string;
  account: string;
  decimals: number;
  fee: number;
};

export type OctaneConfig = {
  feePayer: string;
  rpcUrl: string;
  maxSignatures: number;
  lamportsPerSignature: number;
  corsOrigin: boolean;
  endpoints: {
    transfer: { tokens: TokenFee[] };
    createAssociatedTokenAccount: { tokens: TokenFee[] };
    whirlpoolsSwap: { tokens: TokenFee[] };
  };
};

export type FeeDeductionDetails = {
  userAccount: string;
  feeCollectorAccount: string;
  amount: number;
};

type WhirlpoolsQuote = {
  estimatedAmountIn: string;
  estimatedAmountOut: string;
  estimatedEndTickIndex: number;
  estimatedEndSqrtPrice: string;
  estimatedFeeAmount: string;
  amount: string;
  amountSpecifiedIsInput: boolean;
  aToB: boolean;
  otherAmountThreshold: string;
  sqrtPriceLimit: string;
  tickArray0: string;
  tickArray1: string;
  tickArray2: string;
};

interface BuildWhirlpoolsSwapResponse {
  status: 'ok';
  transaction: string;
  quote: WhirlpoolsQuote;
  messageToken: string;
}

interface TransactionResponse {
  status: string;
  signature: string;
  error?: string;
}

// ============= Constants =============

const FAST_RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.rpc.extrnode.com',
];

const OCTANE_ENDPOINTS = [
  'https://octane-mainnet-beta.breakroom.show/api',
  'https://octane-mainnet.solana.com/api',
];

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_COMMITMENT: Commitment = 'confirmed';
const MAX_RETRIES = 3;
const CONFIG_CACHE_TTL = 60 * 1000;

// ============= State =============

let cachedConfig: OctaneConfig | null = null;
let cachedConfigTimestamp = 0;
let configLoadingPromise: Promise<OctaneConfig> | null = null;
let connection: Connection;
let lastRpcIndex = 0;

// ============= Helpers =============

function getOptimizedConnection(): Connection {
  if (!connection) {
    connection = new Connection(FAST_RPC_ENDPOINTS[0], {
      commitment: DEFAULT_COMMITMENT,
      confirmTransactionInitialTimeout: DEFAULT_TIMEOUT_MS,
    });
  }
  return connection;
}

function rotateRpcEndpoint(): Connection {
  lastRpcIndex = (lastRpcIndex + 1) % FAST_RPC_ENDPOINTS.length;
  connection = new Connection(FAST_RPC_ENDPOINTS[lastRpcIndex], {
    commitment: DEFAULT_COMMITMENT,
    confirmTransactionInitialTimeout: DEFAULT_TIMEOUT_MS,
  });
  console.log(`Rotated to RPC endpoint: ${FAST_RPC_ENDPOINTS[lastRpcIndex]}`);
  return connection;
}

async function makeApiRequest(path: string, payload: any, retries = MAX_RETRIES): Promise<any> {
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const endpoint = OCTANE_ENDPOINTS[attempt % OCTANE_ENDPOINTS.length];
    try {
      const { data } = await axios.post(`${endpoint}${path}`, payload, {
        timeout: DEFAULT_TIMEOUT_MS,
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (err: any) {
      lastError = err;
      if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
        console.warn('Request timed out, retrying...');
      } else {
        console.warn(`API error (attempt ${attempt + 1}): ${err.message}`);
      }
      if (attempt < retries) await new Promise((res) => setTimeout(res, 2 ** attempt * 500));
    }
  }

  throw lastError;
}

// ============= Config Loading =============

export async function loadOctaneConfig(): Promise<OctaneConfig> {
  const now = Date.now();
  if (cachedConfig && now - cachedConfigTimestamp < CONFIG_CACHE_TTL) {
    return cachedConfig;
  }
  if (!configLoadingPromise) {
    configLoadingPromise = (async () => {
      let lastErr;
      for (const url of OCTANE_ENDPOINTS) {
        try {
          const { data } = await axios.get<OctaneConfig>(url, { timeout: DEFAULT_TIMEOUT_MS });
          cachedConfig = data;
          cachedConfigTimestamp = Date.now();
          return data;
        } catch (e: any) {
          lastErr = e;
          console.warn(`Config load failed at ${url}: ${e.message}`);
        }
      }
      if (cachedConfig) return cachedConfig;
      throw lastErr;
    })();
  }
  try {
    return await configLoadingPromise;
  } finally {
    configLoadingPromise = null;
  }
}

// ============= Fee Lookup =============

export async function findTokenFee(
  endpoint: keyof OctaneConfig['endpoints'],
  mint: PublicKey
): Promise<TokenFee> {
  const config = await loadOctaneConfig();
  const tokens = config.endpoints[endpoint]?.tokens;
  if (!tokens) throw new Error(`No endpoint ${endpoint}`);
  const fee = tokens.find((t) => t.mint === mint.toBase58());
  if (!fee) throw new Error(`Missing fee for mint ${mint.toBase58()}`);
  return fee;
}

// ============= Transaction Building =============

async function fetchBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
  const conn = getOptimizedConnection();
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash(
    DEFAULT_COMMITMENT
  );
  return { blockhash, lastValidBlockHeight };
}

async function buildTransactionToTransfer(
  feePayer: PublicKey,
  fee: TokenFee,
  mint: PublicKey,
  sender: PublicKey,
  recipient: PublicKey,
  amount: number
): Promise<Transaction> {
  const conn = getOptimizedConnection();
  const [senderAta, recipientAta, feeAta] = await Promise.all([
    getAssociatedTokenAddress(mint, sender),
    getAssociatedTokenAddress(mint, recipient),
    Promise.resolve(new PublicKey(fee.account)),
  ]);

  const { blockhash, lastValidBlockHeight } = await fetchBlockhash();

  const tx = new Transaction({
    blockhash,
    lastValidBlockHeight,
    feePayer,
  });

  tx.add(createTransferInstruction(senderAta, feeAta, sender, fee.fee));
  tx.add(createTransferInstruction(senderAta, recipientAta, sender, amount));

  return tx;
}

async function buildTransactionToCreateAccount(
  feePayer: PublicKey,
  fee: TokenFee,
  mint: PublicKey,
  owner: PublicKey
): Promise<Transaction> {
  const conn = getOptimizedConnection();
  const ata = await getAssociatedTokenAddress(mint, owner);
  const feeAta = new PublicKey(fee.account);
  const { blockhash, lastValidBlockHeight } = await fetchBlockhash();

  const tx = new Transaction({
    blockhash,
    lastValidBlockHeight,
    feePayer,
  });

  tx.add(createTransferInstruction(ata, feeAta, feePayer, fee.fee));
  tx.add(
    createAssociatedTokenAccountInstruction(
      feePayer,
      ata,
      owner,
      mint
    )
  );

  return tx;
}

// ============= Swap =============

export async function performOptimizedSwap(
  user: PublicKey,
  sourceMint: PublicKey,
  amount: number,
  targetMint: PublicKey | null = null,
  slippingTolerance = 0.5
): Promise<{ signature: string; quote: WhirlpoolsQuote }> {
  try {
    const USDC = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    const isSwapToUSDC = targetMint?.equals(USDC) ?? false;

    const fee = await findTokenFee('whirlpoolsSwap', sourceMint);
    const resp = await makeApiRequest('/buildWhirlpoolsSwap', {
      user: user.toBase58(),
      sourceMint: sourceMint.toBase58(),
      amount,
      slippingTolerance,
    });

    const { transaction: txB58, quote, messageToken } = resp as BuildWhirlpoolsSwapResponse;
    const tx = Transaction.from(base58.decode(txB58));
    const signature = (
      await makeApiRequest(
        isSwapToUSDC ? '/sendWhirlpoolsSwap' : '/sendWhirlpoolsSwap',
        { transaction: base58.encode(tx.serialize({ requireAllSignatures: false })), messageToken }
      )
    ).signature;

    // Poll for confirmation
    let backoff = 500;
    for (let i = 0; i < 8; i++) {
      const status = await getOptimizedConnection().getSignatureStatuses([
        signature
      ]);
      const info = status.value[0];
      if (info?.confirmationStatus === 'finalized') break;
      await new Promise((res) => setTimeout(res, backoff));
      backoff *= 2;
    }

    return { signature, quote };
  } catch (err: any) {
    console.error('Swap error:', err);
    throw err;
  }
}

// ============= Simple API Wrappers =============

export async function createAssociatedTokenAccount(
  transaction: Transaction
): Promise<string> {
  const payload = base58.encode(
    transaction.serialize({ requireAllSignatures: false })
  );
  const resp = (await makeApiRequest(
    '/createAssociatedTokenAccount',
    { transaction: payload }
  )) as TransactionResponse;
  if (resp.error) throw new Error(resp.error);
  return resp.signature;
}

export async function sendTransactionWithTokenFee(
  transaction: Transaction
): Promise<string> {
  const payload = base58.encode(
    transaction.serialize({ requireAllSignatures: false })
  );
  const resp = (await makeApiRequest('/transfer', { transaction: payload })) as TransactionResponse;
  if (resp.error) throw new Error(resp.error);
  return resp.signature;
}
