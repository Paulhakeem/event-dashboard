import connectDB from "../../utils/mongoose.js";
import { Event } from "~~/server/models/Events";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { phone, eventId, userEmail, ticketType } = body;

  if (!phone || !eventId || !userEmail || !ticketType) {
    throw createError({
      statusCode: 400,
      statusMessage: "phone, eventId, userEmail and ticketType are required",
    });
  }

  await connectDB();

  // Normalize phone
  let formattedPhone = phone.replace(/\D/g, "");

  if (formattedPhone.startsWith("0")) {
    formattedPhone = "254" + formattedPhone.slice(1);
  }

  if (!/^2547\d{8}$/.test(formattedPhone)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid phone number format",
    });
  }

  // Find event
  const eventData = await Event.findById(eventId);

  if (!eventData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found",
    });
  }

  if (["cancelled", "completed"].includes(eventData.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event not available for booking",
    });
  }

  // Verify ticket type
  let amount = null;

  if (ticketType === "regular") {
    amount = eventData.regular;
  }

  if (ticketType === "vip") {
    amount = eventData.vip;
  }

  if (ticketType === "vvip") {
    amount = eventData.vvip;
  }

  if (!amount) {
    throw createError({
      statusCode: 404,
      statusMessage: "Ticket type not found",
    });
  }

  // Daraja credentials
  const {
    darajaConsumerKey,
    darajaConsumerSecret,
    darajaPasskey,
    darajaUrl,
    mpesaShortCode,
    appUrl,
  } = config;

  if (!darajaConsumerKey || !darajaConsumerSecret || !darajaPasskey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Daraja credentials missing",
    });
  }

  // Get access token
  let accessToken;

  try {
    const auth = Buffer.from(
      `${darajaConsumerKey}:${darajaConsumerSecret}`,
    ).toString("base64");

    const tokenRes = await axios.get(
      `${darajaUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    accessToken = tokenRes.data.access_token;
  } catch (err) {
    console.error("Token error", err.response?.data);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to get Daraja token",
    });
  }

  // Timestamp
  const date = new Date();

  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = Buffer.from(
    `${mpesaShortCode}${darajaPasskey}${timestamp}`,
  ).toString("base64");

  const transactionId = `MPESA-${Date.now()}`;

  const callbackUrl = `${appUrl}/api/booking/mpesa-callback`;

  const payload = {
    BusinessShortCode: mpesaShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: mpesaShortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: eventData.title,
    TransactionDesc: `Ticket booking for ${eventData.title}`,
  };

  try {
    const response = await axios.post(
      `${darajaUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      success: true,
      checkoutRequestID: response.data.CheckoutRequestID,
      transactionId,
      message: "STK push sent successfully",
    };
  } catch (err) {
    console.error("STK push error:", err.response?.data);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to initiate STK push",
    });
  }
});
