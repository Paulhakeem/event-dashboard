import { stkPush } from "~/server/utils/stkPush";
import connectDB from "~/server/utils/mongoose";
import { Event } from "~/server/models/Events";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phone, eventId, userId } = body;

  if (!phone || !eventId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  await connectDB();

  const eventData = await Event.findById(eventId);
  if (!eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  const reference = `EVT-${Date.now()}`;

  const response = await stkPush(
    phone,
    1, // sandbox amount
    reference
  );

  return {
    message: "STK Push sent",
    reference,
    checkoutRequestID: response.CheckoutRequestID,
  };
});
