export async function verifyRecaptcha(token, config) {
  if (!token) {
    return { success: false, message: "Missing reCAPTCHA token" };
  }

  const secret = config?.recaptchaSecret;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return {
        success: true,
        skipped: true,
        message: "reCAPTCHA verification skipped in non-production mode",
      };
    }

    return {
      success: false,
      message: "reCAPTCHA secret not configured on server",
    };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  try {
    const verify = await $fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: params,
    });

    return verify;
  } catch (err) {
    return {
      success: false,
      message: "Verification failed",
      error: String(err),
    };
  }
}
