import { useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import { useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";

const useSwap = () => {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const [txid, setTxid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const swapTokens = async (
    inputMint,
    outputMint,
    amount,
    slippageBps = 50
  ) => {
    if (!walletProvider || !connection) {
      setError("Wallet or connection not available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch quote from Jupiter API
      const quoteResponse = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
        )
      ).json();

      console.log({ quoteResponse });

      // Get serialized transaction for the swap
      const { swapTransaction } = await (
        await fetch("https://quote-api.jup.ag/v6/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: walletProvider.publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        })
      ).json();

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign and send the transaction
      await walletProvider.signAndSendTransaction(transaction);

      // Execute the transaction
      const rawTransaction = transaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction(txid);
      setTxid(txid);
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (err) {
      console.error("Error during swap:", err);
      setError(err.message || "An error occurred during the swap");
    } finally {
      setLoading(false);
    }
  };

  return { swapTokens, txid, loading, error };
};

export default useSwap;
