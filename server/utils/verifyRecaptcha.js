export async function verifyRecaptcha(token, config) {
  if (!token) {
    return { success: false, message: "Missing reCAPTCHA token" };
  }

  const secret = config?.recaptchaSecretKey;
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

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const result = await $fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    return result;
  } catch (err) {
    return {
      success: false,
      message: "reCAPTCHA verification request failed",
      error: String(err),
    };
  }
}
