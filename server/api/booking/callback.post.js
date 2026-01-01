import connectDB from "../../utils/mongoose";
import { TotalBooking } from "../../models/totalBooking";
// import { User } from "~/server/models/User";
// import { Event } from "~/server/models/Events";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = body?.Body?.stkCallback;

    if (!result) {
      console.warn("No stkCallback payload", { body });
      return { ok: true };
    }

    if (result.ResultCode !== 0) {
      return { ok: true };
    }

    const meta = result.CallbackMetadata?.Item || [];

    const getValue = (name) => {
      const item = meta.find((i) => i.Name === name);
      return item ? item.Value : undefined;
    };

    const receipt = getValue("MpesaReceiptNumber");
    const amount = getValue("Amount");
    const phone = getValue("PhoneNumber");

    if (!receipt) {
      console.warn("Missing MpesaReceiptNumber in callback metadata", { meta });
      return { ok: true };
    }

    await connectDB();

    // prevent duplicates
    const exists = await TotalBooking.findOne({ reference: receipt });
    if (exists) return { ok: true };

    await TotalBooking.create({
      reference: receipt,
      phone,
      amount,
      status: "success",
      bookedAt: new Date(),
    });

    return { ok: true };
  } catch (err) {
    console.error("Error processing STK callback:", err);
    return { ok: true };
  }
});
