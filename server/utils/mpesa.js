import { Buffer } from "buffer";
import axios from "axios";
export default async function getMpesaToken() {
  const config = useRuntimeConfig();

  const { mpesaConsumerKey, mpesaConsumerSecret } = config;

  if (!mpesaConsumerKey || !mpesaConsumerSecret) {
    console.error("Missing M-Pesa credentials in runtime config");
    throw new Error("Missing M-Pesa credentials: mpesaConsumerKey/mpesaConsumerSecret");
  }

  const auth = Buffer.from(`${mpesaConsumerKey}:${mpesaConsumerSecret}`).toString("base64");

  // Minimal, non-sensitive debug info to help diagnose 400s
  console.debug(
    "MPESA token request -> consumerKey=",
    `${mpesaConsumerKey.slice(0, 4)}...${mpesaConsumerKey.slice(-3)}`,
    " authSample=",
    `${auth.slice(0, 8)}...`
  );

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    return res?.data?.access_token;
  } catch (err) {
    console.error(
      "Failed to get M-Pesa token:",
      err?.response?.status,
      err?.response?.headers,
      err?.response?.data ?? err?.message ?? err
    );
    throw err;
  }
}
