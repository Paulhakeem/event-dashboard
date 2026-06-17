export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body?.token;
  if (!token) {
    return { success: false, message: "Missing reCAPTCHA token" };
  }

  const config = useRuntimeConfig();
  const secret = config.recaptchaSecret;
  if (!secret) {
    return {
      success: false,
      message: "reCAPTCHA secret not configured on server",
    };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  try {
    const verify = await $fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      },
    );
    return verify;
  } catch (err) {
    return {
      success: false,
      message: "Verification failed",
      error: String(err),
    };
  }
});
