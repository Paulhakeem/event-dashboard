import connectDB from "../../utils/mongoose.js";
import { PendingPayment } from "../../models/PendingPayment";
import { Notification } from "../../models/Notification";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const callback = body?.response || body;

  // Match PayHero's ExternalReference to the server-created payment intent.
  const reference = callback?.ExternalReference;

  if (typeof reference !== "string" || !reference.trim()) {
    console.error("PayHero callback missing ExternalReference");

    throw createError({
      statusCode: 400,
      statusMessage: "Missing payment reference.",
    });
  }

  await connectDB();

  const pending = await PendingPayment.findOne({
    CheckoutRequestID: reference.trim(),
  });

  if (!pending) {
    console.error("No pending payment found for PayHero reference:", reference);

    throw createError({
      statusCode: 404,
      statusMessage: "Payment reference not found.",
    });
  }

  // Do not change a payment that has already been processed.
  if (["claimed", "confirmed"].includes(pending.status)) {
    return {
      success: true,
      message: "Payment callback already processed.",
    };
  }

  if (["failed", "mismatch"].includes(pending.status)) {
    return {
      success: true,
      message: "Payment already marked as unsuccessful.",
    };
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

  // A failed payment should never be marked confirmed.
  if (!paymentSucceeded) {
    await PendingPayment.updateOne(
      {
        _id: pending._id,
        status: "pending",
      },
      {
        $set: {
          status: "failed",
          resultCode: Number.isFinite(resultCode) ? resultCode : -1,
          resultDesc:
            callback.ResultDesc || callback.Status || "PayHero payment failed.",
          transactionId:
            callback.MpesaReceiptNumber ||
            callback.TransactionID ||
            callback.TransactionId ||
            "",
          verifiedAt: new Date(),
        },
      },
    );

    // Guest payments have no linked account to notify.
    if (pending.userId) {
      try {
        await Notification.create({
          title: "Payment failed",
          message: `${callback.ResultDesc || callback.Status || "Your payment was unsuccessful."} (${pending.eventName})`,
          recipientUser: pending.userId,
          event: pending.eventId,
          meta: { type: "payment_failed" },
          read: false,
        });
      } catch (notificationError) {
        console.error(
          "Failed to create payment failure notification:",
          notificationError,
        );
      }
    }

    return {
      success: true,
      message: "Failed payment callback recorded.",
    };
  }

  // Never confirm a payment if the amount is missing or different.
  if (
    !Number.isFinite(expectedAmount) ||
    !Number.isFinite(receivedAmount) ||
    receivedAmount !== expectedAmount
  ) {
    await PendingPayment.updateOne(
      {
        _id: pending._id,
        status: "pending",
      },
      {
        $set: {
          status: "mismatch",
          resultCode,
          resultDesc:
            "PayHero payment amount does not match the expected amount.",
          callbackAmount: Number.isFinite(receivedAmount)
            ? receivedAmount
            : null,
          transactionId:
            callback.MpesaReceiptNumber ||
            callback.TransactionID ||
            callback.TransactionId ||
            "",
          verifiedAt: new Date(),
        },
      },
    );

    console.error("PayHero payment amount mismatch:", {
      reference,
      expectedAmount,
      receivedAmount,
    });

    return {
      success: true,
      message: "Payment amount mismatch recorded for review.",
    };
  }

  // Atomically confirm only a still-pending payment.
  const updated = await PendingPayment.updateOne(
    {
      _id: pending._id,
      status: "pending",
    },
    {
      $set: {
        status: "confirmed",
        resultCode,
        resultDesc: callback.ResultDesc || "Payment confirmed by PayHero.",
        callbackAmount: receivedAmount,
        transactionId:
          callback.MpesaReceiptNumber ||
          callback.TransactionID ||
          callback.TransactionId ||
          "",
        mpesaReceiptNumber:
          callback.MpesaReceiptNumber ||
          callback.TransactionID ||
          callback.TransactionId ||
          "",
        verifiedAt: new Date(),
      },
    },
  );

  if (updated.modifiedCount !== 1) {
    console.warn(
      "PayHero callback was not applied because payment status changed:",
      reference,
    );
  }

  return {
    success: true,
    message: "PayHero callback received.",
  };
});
