import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "../../models/totalBooking.js";
import { PendingPayment } from "../../models/PendingPayment.js";
import { Notification } from "../../models/Notification.js";

function getTransactionId(callback) {
  return (
    callback.MpesaReceiptNumber ||
    callback.TransactionID ||
    callback.TransactionId ||
    ""
  );
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const callback = body?.response || body;
  const reference = callback?.ExternalReference;

  if (typeof reference !== "string" || !reference.trim()) {
    console.error("PayHero callback missing ExternalReference");
    throw createError({
      statusCode: 400,
      statusMessage: "Missing payment reference.",
    });
  }

  await connectDB();
  const paymentReference = reference.trim();
  const pending = await PendingPayment.findOne({
    CheckoutRequestID: paymentReference,
  });

  if (!pending) {
    console.error("No pending payment found for PayHero reference:", reference);
    throw createError({
      statusCode: 404,
      statusMessage: "Payment reference not found.",
    });
  }

  if (["claimed", "confirmed", "failed", "mismatch"].includes(pending.status)) {
    return { success: true, message: "Payment callback already processed." };
  }

  const expectedAmount = Number(pending.amount);
  const receivedAmount = Number(callback.Amount);
  const rawResultCode = callback.ResultCode ?? callback.resultCode;
  const resultCode =
    rawResultCode === undefined || rawResultCode === null
      ? NaN
      : Number(rawResultCode);
  const callbackStatus = String(
    callback.Status ?? callback.status ?? "",
  ).toLowerCase();
  const gatewayStatus = String(body?.status ?? "").toLowerCase();
  const paymentSucceeded =
    callbackStatus === "success" &&
    (gatewayStatus === "true" || gatewayStatus === "success") &&
    (!Number.isFinite(resultCode) || resultCode === 0);
  const transactionId = getTransactionId(callback);
  const now = new Date();

  let status;
  if (!paymentSucceeded) {
    status = "failed";
  } else if (
    !Number.isFinite(expectedAmount) ||
    !Number.isFinite(receivedAmount) ||
    receivedAmount !== expectedAmount
  ) {
    status = "mismatch";
  } else {
    status = "confirmed";
  }

  const update = {
    status,
    resultCode: Number.isFinite(resultCode) ? resultCode : -1,
    resultDesc:
      callback.ResultDesc ||
      callback.Status ||
      (status === "confirmed"
        ? "Payment confirmed by PayHero."
        : "PayHero payment failed."),
    transactionId,
    verifiedAt: now,
  };
  if (Number.isFinite(receivedAmount)) {
    update.callbackAmount = receivedAmount;
  }
  if (status === "confirmed") {
    update.mpesaReceiptNumber = transactionId;
  }

  const result = await PendingPayment.updateOne(
    { _id: pending._id, status: "pending" },
    { $set: update },
  );

  if (result.modifiedCount !== 1) {
    return { success: true, message: "Payment callback already processed." };
  }

  if (status === "failed" || status === "mismatch") {
    try {
      await Notification.create({
        title: "Payment failed",
        message: `${update.resultDesc} (${pending.eventName})`,
        recipientUser: pending.userId,
        event: pending.eventId,
        meta: { type: "payment_failed" },
        read: false,
      });
    } catch (notificationError) {
      console.error(
        "Failed to create PayHero payment failure notification:",
        notificationError,
      );
    }
  }

  await TotalBooking.updateOne(
    { reference: paymentReference },
    {
      $set: {
        mpesaReceiptNumber: transactionId,
        transactionId,
        verifiedAt: now,
      },
    },
  );

  return { success: true, message: "PayHero callback received." };
});
