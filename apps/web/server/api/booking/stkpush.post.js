import connectDB from "../../utils/mongoose.js";
import { Event } from "~~/server/models/Events";
import { PendingPayment } from "~~/server/models/PendingPayment";
import { requireAuth } from "../../utils/requireAuth.js";
import { parseBody } from "../../utils/parseBody.js";
import axios from "axios";

const sanitizeForMpesa = (str) => {
  return str
    .replace(/&/g, "and") // & breaks XML
    .replace(/'/g, "") // apostrophes can break SOAP
    .replace(/"/g, "") // quotes too
    .replace(/[<>]/g, "") // XML tags
    .replace(/[^\w\s\-\.]/g, "") // any other special chars
    .trim()
    .slice(0, 12); // Safaricom recommends max 12 chars
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await requireAuth(event);
  const body = await parseBody(event);
  const query = getQuery(event);

  const {
    tickets: rawTickets,
    ticketType: legacyTicketType,
    quantity: legacyQuantity,
  } = body;

  let phone = body.phone ?? query.phone ?? null;
  let eventId = body.eventId ?? query.eventId ?? null;
  if (!phone || !eventId) {
    console.log("STKPUSH using query fallback", {
      query,
      bodyKeys: Object.keys(body),
    });
  }

  let resolvedTickets = rawTickets;
  if (!Array.isArray(resolvedTickets) && query.tickets) {
    try {
      resolvedTickets = JSON.parse(String(query.tickets));
    } catch {}
  }

  const requestedUserEmail = body.userEmail || query.userEmail || null;
  const userEmail = requestedUserEmail || authUser.email || null;

  if (!phone || !eventId || !userEmail) {
    console.log("STKPUSH validation failed", {
      contentType: event.node.req.headers["content-type"],
      bodyKeys: Object.keys(body),
      phone,
      eventId,
      authEmail: authUser?.email,
      authId: authUser?.id,
    });

    throw createError({
      statusCode: 400,
      statusMessage: "phone, eventId and userEmail are required",
      data: {
        receivedKeys: Object.keys(body),
        phone: phone ?? null,
        eventId: eventId ?? null,
        authEmail: authUser?.email ?? null,
      },
    });
  }

  /* ── NORMALISE TICKETS ARRAY ─────────────────────────────── */
  let ticketLines = Array.isArray(resolvedTickets)
    ? resolvedTickets
        .filter(
          (t) => t?.ticketType && Math.floor(Number(t?.quantity) || 0) > 0,
        )
        .map((t) => ({
          ticketType: String(t.ticketType),
          quantity: Math.floor(Number(t.quantity) || 0),
        }))
    : [];

  // Legacy single-ticket fallback
  if (ticketLines.length === 0 && legacyTicketType) {
    const qty = Math.floor(Number(legacyQuantity) || 1);
    if (qty >= 1) {
      ticketLines = [{ ticketType: String(legacyTicketType), quantity: qty }];
    }
  }

  if (ticketLines.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please select at least one ticket type",
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

  /* ── VERIFY TICKET TYPES & COMPUTE TOTAL ─────────────────── */
  const tickets = [];
  let totalTickets = 0;
  let amount = 0;

  for (const line of ticketLines) {
    const matchedTicket = eventData.customTickets?.find(
      (t) => t.name === line.ticketType,
    );

    if (!matchedTicket || !matchedTicket.price) {
      throw createError({
        statusCode: 404,
        statusMessage: `Ticket type "${line.ticketType}" not found`,
      });
    }

    totalTickets += line.quantity;
    amount += matchedTicket.price * line.quantity;

    tickets.push({
      ticketType: line.ticketType,
      quantity: line.quantity,
      amount: matchedTicket.price * line.quantity,
    });
  }

  if (!eventData.TicketQuantity || eventData.TicketQuantity < totalTickets) {
    throw createError({
      statusCode: 400,
      statusMessage: "Not enough tickets available",
    });
  }

  const ticketCount = totalTickets;

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
    AccountReference: sanitizeForMpesa(eventData.title),
    TransactionDesc: `Booking ${sanitizeForMpesa(eventData.title)}`,
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

    const checkoutRequestID = String(response.data?.CheckoutRequestID || "");

    if (!checkoutRequestID) {
      console.error(
        "STK push no CheckoutRequestID",
        JSON.stringify(response.data),
      );
      throw new Error("Safaricom returned no CheckoutRequestID");
    }

    // Persist the intent so verification is bound to this user/event/amount
    await PendingPayment.create({
      CheckoutRequestID: checkoutRequestID,
      userId: authUser.id,
      userEmail,
      phone: formattedPhone,
      eventId: eventData._id,
      eventName: eventData.title,
      ticketType: tickets[0]?.ticketType,
      quantity: ticketCount,
      tickets,
      amount,
    });

    return {
      success: true,
      checkoutRequestID,
      transactionId,
      message: "STK push sent successfully",
    };
  } catch (err) {
    const darajaError = err.response?.data || err.data || null;
    console.error(
      "STK push failed",
      darajaError ? JSON.stringify(darajaError) : err.message,
    );

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to initiate STK push",
      data: darajaError,
    });
  }
});
