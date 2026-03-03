import connectDB from "../../utils/mongoose.js";
import { Event } from "~~/server/models/Events";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { phone, amount, eventName, userEmail, ticketType } = body;

  if (!phone || !amount || !eventName || !userEmail || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage: "phone, amount, eventName, userEmail and ticketType are required",
    });
  }

  await connectDB();

  // verify event exists and is bookable
  const eventData = await Event.findOne({ title: eventName });
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }
  if (eventData.status === "cancelled" || eventData.status === "completed") {
    throw createError({ statusCode: 400, statusMessage: "Event is no longer available for booking" });
  }

  const consumerKey = config.darajaConsumerKey;
  const consumerSecret = config.darajaConsumerSecret;
  const darajaUrl = config.darajaUrl || "https://sandbox.safaricom.co.ke";
  const passkey = config.darajaPasskey;

  if (!consumerKey || !consumerSecret || !passkey) {
    throw createError({ statusCode: 500, statusMessage: "Daraja credentials not configured (missing passkey?)" });
  }

  // get token
  let accessToken;
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenRes = await axios.get(
      `${darajaUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    accessToken = tokenRes.data.access_token;
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Failed to obtain Daraja access token" });
  }

  const transactionId = `MPESA-${Date.now()}`;

  // build STK push request
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${config.darajaPartyA}${passkey}${timestamp}`).toString("base64");

  // callback URL must be accessible to Safaricom and usually HTTPS
  const callbackUrl = `${config.appUrl}/api/booking/mpesa-callback`;
  if (callbackUrl.startsWith("https://letsbook.vercel.app")) {
    // running locally: Daraja sandbox will reject this, so warn early
    console.warn("Using localhost callback URL - Daraja may reject the request");
  }
  if (!/^https?:\/\//.test(callbackUrl)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid CallBackURL configured for Daraja (must be a valid URL)",
    });
  }

  const stkPayload = {
    BusinessShortCode: config.mpesaShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: config.mpesaShortCode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: eventName,
    TransactionDesc: `Booking ${eventName}`,
    // embed transactionId so we can track later
    // some implementations put this in Remarks or AccountReference
  };

  try {
    const pushRes = await axios.post(
      `${darajaUrl}/mpesa/stkpush/v1/processrequest`,
      stkPayload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return {
      success: true,
      checkoutRequestID: pushRes.data.CheckoutRequestID,
      transactionId,
      response: pushRes.data,
    };
  } catch (err) {
    console.error("STK push error", err.response?.data || err.message);
    throw createError({ statusCode: 500, statusMessage: "Failed to initiate STK push" });
  }
});