import paystack from 'paystack';

const config = useRuntimeConfig();

export const paystackClient = paystack(config.paystackSecretKey);

