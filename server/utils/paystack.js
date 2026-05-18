import Paystack from "paystack";

export function getPaystack() {
  const config = useRuntimeConfig();
  return Paystack(config.paystackSecretKey);
}
