import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";
import { PendingPayment } from "~~/server/models/PendingPayment.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  try {
    const body = await readBody(event);

    if (!body.Result) {
      console.error("M-Pesa callback error: missing Result object", body);
      return {
        ResultCode: 1,
        ResultDesc: "Invalid callback payload",
      };
    }

    const resultParams = body.Result.ResultParameters?.ResultParameter || [];
    const checkoutId = body.Result?.CheckoutRequestID;
    const resultCode = body.Result?.ResultCode;
    const resultDesc = body.Result?.ResultDesc;

    if (!checkoutId) {
      console.error("M-Pesa callback missing CheckoutRequestID", body);
      return {
        ResultCode: 1,
        ResultDesc: "Missing CheckoutRequestID",
      };
    }

    const transactionId = resultParams.find(
      (p) => p.Key === "TransactionID" || p.Key === "MpesaReceiptNumber",
    )?.Value;
    const amount = Number(
      resultParams.find((p) => p.Key === "Amount")?.Value,
    );
    const mpesaReceiptNumber = resultParams.find(
      (p) => p.Key === "MpesaReceiptNumber" || p.Key === "ReceiptNumber",
    )?.Value;

    const success = resultCode === 0 || resultCode === "0";

    /* ── Verify against the server-bound pending payment ────── */
    // The callback itself cannot be cryptographically authenticated (Safaricom
    // does not sign callbacks), so we reconcile it against the payment intent
    // we recorded when the STK push was initiated. Only the expected amount is
    // accepted as confirmed; attacker-supplied amounts set status to "mismatch".
    const pending = await PendingPayment.findOne({
      CheckoutRequestID: checkoutId,
      status: { $in: ["pending", "confirmed"] },
    });

    if (pending) {
      let status = "failed";
      if (success) {
        if (Number.isNaN(amount)) {
          status = "pending";
        } else if (amount === pending.amount) {
          status = "confirmed";
        } else {
          status = "mismatch";
        }
      }

      await PendingPayment.updateOne(
        { _id: pending._id },
        {
          mpesaReceiptNumber,
          transactionId,
          callbackAmount: Number.isNaN(amount) ? undefined : amount,
          verifiedAt: new Date(),
          status,
        },
      );
    } else {
      console.warn(
        "M-Pesa callback received for unknown pending payment",
        checkoutId,
      );
    }

    /* ── Existing booking record: update receipts only ──────── */
    // Never trust the callback to set amount or status on a booking — that must
    // be derived server-side from the verified payment intent.
    const existingBooking = await TotalBooking.findOne({
      reference: checkoutId,
    });
    if (existingBooking) {
      await TotalBooking.updateOne(
        { _id: existingBooking._id },
        {
          mpesaReceiptNumber,
          transactionId,
          verifiedAt: new Date(),
        },
      );
    } else {
      console.warn("M-Pesa callback received for unknown booking", checkoutId);
    }

    return {
      ResultCode: 0,
      ResultDesc: "Received successfully",
    };
  } catch (error) {
    console.error("Callback processing error:", error);
    return {
      ResultCode: 1,
      ResultDesc: "Internal server error",
    };
  }
});