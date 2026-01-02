import getMpesaToken from "./mpesa";
import { Buffer } from "buffer";
import axios from "axios";
export async function stkPush(phone, amount, reference) {
  const config = useRuntimeConfig();
  const token = await getMpesaToken();

 const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  // Generate STK Password (CORRECT)
  const password = Buffer.from(
    `${config.mpesaShortcode}${config.mpesaPasskey}${timestamp}`
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

    console.log(res);
  } catch (err) {
    console.error(
      "STK Push failed:",
      err?.response?.data ?? err?.message ?? err
    );
    throw err;
  }
}
