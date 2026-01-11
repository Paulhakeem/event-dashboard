import getMpesaToken from "./mpesa";
import { Buffer } from "buffer";
import axios from "axios";

export async function stk(phone, amount, reference) {
  const config = useRuntimeConfig();
  const token = await getMpesaToken();

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = Buffer.from(
    `${config.mpesaConsumerKey}${config.mpesaConsumerSecret}${timestamp}`
  ).toString("base64");

  const body = {
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
  };

  try {
    const res = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data ?? res;
  } catch (err) {
    console.error(
      "STK Push failed:",
      err?.response?.data ?? err?.message ?? err
    );
    throw err;
  }
}
