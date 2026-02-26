import connectDB from "../../utils/mongoose.js";
import { TotalBooking } from "~~/server/models/totalBooking.js";

export default defineEventHandler(async (event) => {
  await connectDB();

  try {
    const body = await readBody(event);

    // Safaricom sends the response in Result object
    if (body.Result && body.Result.ResultCode === 0) {
      const resultParams = body.Result.ResultParameters?.ResultParameter || [];
      
      // Extract transaction details
      const transactionId = resultParams.find(p => p.Key === "TransactionID")?.Value;
      const amount = parseInt(resultParams.find(p => p.Key === "Amount")?.Value) || 0;
      const mpesaReceiptNumber = resultParams.find(p => p.Key === "ReceiptNumber")?.Value;

      // CheckoutRequestID comes from body.Result.CheckoutRequestID
      const checkoutId = body.Result?.CheckoutRequestID;

      if (checkoutId) {
        // Update booking using checkout request id and attach receipt/transaction info
        await TotalBooking.updateOne(
          { reference: checkoutId },
          { 
            status: "success",
            mpesaReceiptNumber,
            transactionId,
            amount,
            verifiedAt: new Date(),
          }
        );
      }

      return {
        ResultCode: 0,
        ResultDesc: "Received successfully",
      };
    } else {
      console.error("M-Pesa callback error:", body.Result?.ResultDesc);
      return {
        ResultCode: 1,
        ResultDesc: "Transaction failed",
      };
    }
  } catch (error) {
    console.error("Callback processing error:", error);
    return {
      ResultCode: 1,
      ResultDesc: "Internal server error",
    };
  }
});
