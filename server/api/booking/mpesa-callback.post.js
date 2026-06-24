import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";

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
    const amount = Number(resultParams.find((p) => p.Key === "Amount")?.Value);
    const mpesaReceiptNumber = resultParams.find(
      (p) => p.Key === "MpesaReceiptNumber" || p.Key === "ReceiptNumber",
    )?.Value;

    const existingBooking = await TotalBooking.findOne({
      reference: checkoutId,
    });

    if (!existingBooking) {
      console.warn("M-Pesa callback received for unknown booking", checkoutId);
      return {
        ResultCode: 0,
        ResultDesc: "Received successfully",
      };
    }

    const updateFields = {
      mpesaReceiptNumber,
      transactionId,
      verifiedAt: new Date(),
    };

    if (!Number.isNaN(amount)) {
      updateFields.amount = amount;
    }

    if (resultCode === 0 || resultCode === "0") {
      updateFields.status = "success";
    } else {
      updateFields.status = "failed";
    }

    await TotalBooking.updateOne({ reference: checkoutId }, updateFields);

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
