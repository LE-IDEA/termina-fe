import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://ramp.scalex.africa/business/rates?token=USDC&network=SOLANA&currency=NGN",
      {
        headers: {
          Authorization:
            "Bearer sc.ey6761a29bd556c761698620ca6761a29bd556c761698620cb6761a29bd556c761698620cc",
          "SC-Timestamp": "",
        },
      }
    );
    if (!response.ok) {
      return res.status(response.status);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}