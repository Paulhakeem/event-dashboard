import axios from "axios";
import { randomBytes } from "node:crypto";

import connectDB from "../../utils/mongoose.js";
import { Event } from "../../models/Events";
import { PendingPayment } from "../../models/PendingPayment";
import { User } from "../../models/User";
import { getOptionalAuth } from "../../utils/requireAuth.js";
import { parseBody } from "../../utils/parseBody.js";

function normalizePhone(phone) {
  let value = String(phone || "").replace(/[\s+\-()]/g, "");

  if (value.startsWith("0")) {
    value = "254" + value.slice(1);
  } else if (value.startsWith("7") || value.startsWith("1")) {
    value = "254" + value;
  }

  if (!/^254[17]\d{8}$/.test(value)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Enter a valid Kenyan phone number, for example 0712345678.",
    });
  }

  return value;
}

function getTicketPrice(eventData, ticketType) {
  const normalizedType = String(ticketType || "")
    .trim()
    .toLowerCase();

  if (!normalizedType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ticket type is required.",
    });
  }

  // Supports event fields such as regular, vip and vvip.
  const directValue = eventData[normalizedType];

  if (directValue !== undefined && directValue !== null) {
    const price =
      typeof directValue === "object"
        ? Number(directValue.price)
        : Number(directValue);

    if (Number.isFinite(price) && price > 0) {
      return price;
    }
  }

  // Supports custom tickets stored as an array.
  const customTickets = Array.isArray(eventData.customTickets)
    ? eventData.customTickets
    : [];

  const customTicket = customTickets.find((ticket) => {
    const name = String(ticket.ticketType || ticket.name || ticket.type || "")
      .trim()
      .toLowerCase();

    return name === normalizedType;
  });

  if (customTicket) {
    const price = Number(customTicket.price);

    if (Number.isFinite(price) && price > 0) {
      return price;
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: `Could not find a valid price for ticket type "${ticketType}". Check your Event model.`,
  });
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await getOptionalAuth(event);
  const body = await parseBody(event);

  const { phone, eventId } = body;

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID is required.",
    });
  }

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Phone number is required.",
    });
  }

  await connectDB();

  let firstName = String(body.firstName || "").trim();
  let lastName = String(body.lastName || "").trim();

  // Logged-in bookings may omit the name fields; fall back to the account.
  if (authUser && (!firstName || !lastName)) {
    const account = await User.findById(authUser.id || authUser._id).select(
      "firstName lastName",
    );
    firstName = firstName || String(account?.firstName || "").trim();
    lastName = lastName || String(account?.lastName || "").trim();
  }

  if (!firstName || !lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: "First name and last name are required.",
    });
  }

  let userEmail;
  if (authUser) {
    userEmail = authUser.email;
  } else {
    userEmail = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: "A valid email address is required.",
      });
    }
  }

  const userId = authUser ? authUser.id || authUser._id : null;

  const username = config.payheroUsername;
  const password = config.payheroPassword;
  const channelId = config.payheroChannelId;
  const appUrl = String(config.appUrl || "").replace(/\/+$/, "");

  if (!username || !password || !channelId || !appUrl) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "PayHero is not fully configured. Check your server runtime configuration.",
    });
  }

  const eventData = await Event.findById(eventId);

  if (!eventData) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found.",
    });
  }

  if (eventData.status === "cancelled" || eventData.status === "completed") {
    throw createError({
      statusCode: 400,
      statusMessage: "This event is no longer available for booking.",
    });
  }

  // Supports either a single ticket or multiple ticket types.
  const requestedTickets =
    Array.isArray(body.tickets) && body.tickets.length
      ? body.tickets
      : [
          {
            ticketType: body.ticketType,
            quantity: body.quantity ?? 1,
          },
        ];

  const tickets = requestedTickets.map((line) => {
    const ticketType = String(line.ticketType || "").trim();
    const quantity = Number(line.quantity);

    if (
      !ticketType ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Each ticket must have a valid ticket type and a quantity between 1 and 20.",
      });
    }

    const unitPrice = getTicketPrice(eventData, ticketType);

    return {
      ticketType,
      quantity,
      amount: Math.round(unitPrice * quantity),
    };
  });

  const ticketCount = tickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0,
  );

  const maxPerUser = eventData.maxTicketsPerUser;
  if (Number.isFinite(Number(maxPerUser)) && Number(maxPerUser) > 0) {
    if (ticketCount > Number(maxPerUser)) {
      throw createError({
        statusCode: 400,
        statusMessage: `You can only purchase up to ${maxPerUser} ticket${Number(maxPerUser) === 1 ? "" : "s"} for this event.`,
      });
    }
  }

  const amount = tickets.reduce((total, ticket) => total + ticket.amount, 0);

  if (!Number.isInteger(amount) || amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "The calculated payment amount is invalid.",
    });
  }

  // Avoid selling more tickets than the event has available.
  const customTicketsAvail = Array.isArray(eventData.customTickets)
    ? eventData.customTickets
    : [];
  for (const ticket of tickets) {
    const tname = String(ticket.ticketType || "").trim().toLowerCase();
    const ct = customTicketsAvail.find((c) => {
      const cname = String(c.ticketType || c.name || c.type || "").trim().toLowerCase();
      return cname === tname;
    });
    if (ct) {
      const avail = Number(ct.availableQuantity ?? ct.quantity ?? 0);
      if (Number.isFinite(avail) && ticket.quantity > avail) {
        throw createError({
          statusCode: 400,
          statusMessage: `Not enough "${ticket.ticketType}" tickets available.`,
        });
      }
    } else if (
      Number.isFinite(Number(eventData.TicketQuantity)) &&
      eventData.TicketQuantity >= 0
    ) {
      // fallback
      if (Number(eventData.TicketQuantity) < ticketCount) {
        throw createError({
          statusCode: 400,
          statusMessage: "Not enough tickets are available.",
        });
      }
    }
  }

  const normalizedPhone = normalizePhone(phone);

  // This reference is generated on the server and used by all payment routes.
  const reference = `EVT-${Date.now()}-${randomBytes(4).toString("hex")}`;

  // Save the pending payment before sending the request to PayHero.
  await PendingPayment.create({
    CheckoutRequestID: reference,
    userId,
    firstName,
    lastName,
    userEmail,
    phone: normalizedPhone,
    eventId: eventData._id,
    eventName: eventData.title,
    ticketType: tickets.map((ticket) => ticket.ticketType).join(", "),
    tickets,
    quantity: ticketCount,
    amount,
    status: "pending",
    resultCode: null,
    resultDesc: "Waiting for PayHero payment confirmation",
  });

  try {
    const authHeader = Buffer.from(`${username}:${password}`).toString(
      "base64",
    );

    const payheroResponse = await axios.post(
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
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const payheroReference =
      payheroResponse.data?.reference ||
      payheroResponse.data?.CheckoutRequestID;
    if (typeof payheroReference === "string" && payheroReference.trim()) {
      await PendingPayment.updateOne(
        { CheckoutRequestID: reference },
        { $set: { payheroReference: payheroReference.trim() } },
      );
    } else {
      console.warn(
        "PayHero accepted payment request without returning a transaction reference:",
        reference,
      );
    }

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
    });

    // The request may have reached PayHero even if the response timed out.
    // Keep the record pending until its status can be established.
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
        ? (typeof errorMessage === 'string' && /insufficient balance|merchant.*balance|insufficient funds|not enough funds/i.test(errorMessage)
            ? "Payment failed: the event organizer's PayHero account does not have enough funds to complete this transaction. Please contact the event organizer for assistance."
            : `PayHero rejected the payment request (HTTP ${responseStatus}): ${errorMessage}`)
        : `No response from PayHero: ${errorMessage}`,
    });
  }

  return {
    success: true,
    message: "Payment request submitted. Complete the payment on your phone.",
    reference,
    checkoutRequestID: reference,
    CheckoutRequestID: reference,
    amount,
    phone: normalizedPhone,
    ticketCount,
  };
});
