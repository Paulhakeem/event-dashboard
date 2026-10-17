import axios from "axios";
import { randomBytes } from "node:crypto";

import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events";
import { PendingPayment } from "../../models/PendingPayment";
import { requireAuth } from "../../utils/requireAuth.js";

function normalizePhone(phone) {
  let value = String(phone || "").replace(/[\s+\-()]/g, "");

  if (value.startsWith("0")) {
    value = `254${value.slice(1)}`;
  } else if (value.startsWith("7") || value.startsWith("1")) {
    value = `254${value}`;
  }

  if (!/^254[17]\d{8}$/.test(value)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enter a valid Kenyan phone number.",
    });
  }

  return value;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await requireAuth(event);
  const body = await readBody(event);
  const { phone, eventId, ticketType } = body;
  const userId = authUser.id || authUser._id;
  const userEmail = authUser.email;

  if (!eventId || !ticketType || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Phone, eventId and ticketType are required.",
    });
  }
  if (!userId || !userEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: "Your login session is missing user details.",
    });
  }

  const username = config.payheroUsername;
  const password = config.payheroPassword;
  const channelId = config.payheroChannelId;
  const appUrl = String(config.appUrl || "").replace(/\/+$/, "");
  if (!username || !password || !channelId || !appUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "PayHero is not fully configured.",
    });
  }

  const normalizedPhone = normalizePhone(phone);
  await connectDB();

  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found." });
  }
  if (["cancelled", "completed"].includes(eventData.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "This event is no longer available for booking.",
    });
  }
  if (
    !Number.isFinite(Number(eventData.TicketQuantity)) ||
    eventData.TicketQuantity < 1
  ) {
    throw createError({ statusCode: 400, statusMessage: "Tickets sold out." });
  }

  const normalizedType = String(ticketType).trim().toLowerCase();
  const matchedTicket = eventData.customTickets?.find((ticket) =>
    [ticket.name, ticket.ticketType, ticket.type]
      .filter(Boolean)
      .some((name) => String(name).trim().toLowerCase() === normalizedType),
  );
  const amount = Number(matchedTicket?.price);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Ticket type not found.",
    });
  }

  const reference = `EVT-${Date.now()}-${randomBytes(4).toString("hex")}`;
  await PendingPayment.create({
    CheckoutRequestID: reference,
    userId,
    userEmail,
    phone: normalizedPhone,
    eventId: eventData._id,
    eventName: eventData.title,
    ticketType: String(ticketType).trim(),
    amount,
    status: "pending",
    resultDesc: "Waiting for PayHero payment confirmation",
  });

  try {
    await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount,
        phone_number: `0${normalizedPhone.slice(3)}`,
        channel_id: Number(channelId),
        provider: "m-pesa",
        external_reference: reference,
        callback_url: `${appUrl}/api/booking/payhero-callback`,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    return {
      success: true,
      reference,
      checkoutRequestID: reference,
      CheckoutRequestID: reference,
      message: "Payment request submitted. Complete the payment on your phone.",
    };
  } catch (error) {
    const responseData = error.response?.data;
    const providerMessage =
      responseData && typeof responseData === "object"
        ? [
            responseData.message,
            responseData.error_message,
            responseData.error,
            responseData.detail,
            responseData.status_message,
          ].find((message) => typeof message === "string" && message.trim()) ||
          JSON.stringify(responseData)
        : typeof responseData === "string"
          ? responseData
          : null;
    const errorMessage =
      providerMessage || error.message || "Unknown PayHero error.";
    const responseStatus = error.response?.status;

    console.error("PayHero payment initiation failed:", {
      status: responseStatus || null,
      message: errorMessage,
    });

    if (responseStatus >= 400 && responseStatus < 500) {
      await PendingPayment.updateOne(
        { CheckoutRequestID: reference, status: "pending" },
        {
          $set: {
            status: "failed",
            resultCode: responseStatus,
            resultDesc: errorMessage,
            verifiedAt: new Date(),
          },
        },
      );
    }

    throw createError({
      statusCode: 502,
      statusMessage: responseStatus
        ? `PayHero rejected the payment request (HTTP ${responseStatus}): ${errorMessage}`
        : `No response from PayHero: ${errorMessage}`,
    });
  }
});
