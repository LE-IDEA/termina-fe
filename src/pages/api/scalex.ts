import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto-js";

type Data = {
  error?: string;
  [key: string]: any;
};

const apiKey = process.env.SCALEX_PUBLIC_KEY || "";
const secret = process.env.SCALEX_SECRET_KEY || "";

const authMiddleware = (path: string, method: string, body: any) => {
  const date = new Date().toISOString();
  const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secret);
  hmac.update(date);
  hmac.update(path);
  hmac.update(method);
  if (body) {
    const bodyHmac = crypto.SHA256(JSON.stringify(body)).toString(crypto.enc.Base64);
    hmac.update(bodyHmac);
  }
  const hash = hmac.finalize();
  const signature = crypto.enc.Base64.stringify(hash);
  return {
    "SC-Timestamp": date,
    "Authorization": `Bearer ${apiKey}:${signature}`
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, address, email, type } = req.body;
  if (!amount || !address || !email || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const data = {
    type,
    address,
    email,
    token: "USDC",
    network: "SOLANA",
    amount,
    currency: "NGN",
    skipRampForm: true,

  };

  const url = "https://ramp.scalex.africa/webpay/tx/initiate";
  const authHeaders = authMiddleware("/webpay/tx/initiate", "POST", data);
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: responseData || "Internal Server Error" });
    }

    res.status(200).json(responseData);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}