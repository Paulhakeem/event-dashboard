import Paystack from "paystack";

const config = useRuntimeConfig();

export const paystack = Paystack(config.paystackSecretKey);
