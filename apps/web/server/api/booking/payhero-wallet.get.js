import axios from "axios";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const username = config.payheroUsername;
  const password = config.payheroPassword;

  // Ensure the PayHero credentials exist.
  if (!username || !password) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "PayHero credentials are missing. Check your server environment variables.",
    });
  }

  try {
    // Request the PayHero service wallet balance.
    const response = await axios.get(
      "https://backend.payhero.co.ke/api/v2/wallets",
      {
        params: {
          wallet_type: "service_wallet",
        },
        auth: {
          username,
          password,
        },
        timeout: 15000,
      },
    );

    // Return the wallet information.
    return {
      success: true,
      message: "PayHero wallet retrieved successfully.",
      wallet: response.data,
    };
  } catch (error) {
    const status = error.response?.status || 502;
    const responseData = error.response?.data;

    console.error("PayHero wallet request failed:", {
      status,
      response: responseData,
      message: error.message,
    });

    if (status === 401) {
      throw createError({
        statusCode: 502,
        statusMessage:
          "PayHero rejected the credentials. Verify the API username, password, and authentication format.",
      });
    }

    throw createError({
      statusCode: 502,
      statusMessage:
        "Unable to retrieve the PayHero service wallet. Check the server logs and PayHero API configuration.",
    });
  }
});
