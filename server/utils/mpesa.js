import { Buffer } from "buffer";
import axios from "axios";
export default async function getMpesaToken() {
  const config = useRuntimeConfig();
  const auth = Buffer.from(
    `${config.mpesaConsumerKey}:${config.mpesaConsumerSecret}`
  ).toString("base64");

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    return res?.access_token ?? res;


  } catch (err) {
    console.error("Failed to get M-Pesa token:", err);
    throw err;
  }
}

