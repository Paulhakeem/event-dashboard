import getMpesaToken from "./mpesa";
import { Buffer } from "buffer";

export async function stkPush(config, phone, amount, reference) {
  const token = await getMpesaToken();

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    config.mpesaShortcode + config.mpesaPasskey + timestamp
  ).toString("base64");

  try {
    const res = await $fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: config.mpesaShortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: config.mpesaShortcode,
        PhoneNumber: phone,
        CallBackURL: config.mpesaCallbackUrl,
        AccountReference: reference,
        TransactionDesc: "Event Booking",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("STK Push failed:", err?.response?.data || err.message || err);
    throw err;
  }
}