import nodemailer from "nodemailer";

export const sendResetEmail = async (to, code) => {
  const config = useRuntimeConfig();

  // If SMTP not configured, log to console and return a non-fatal result
  if (!config.smtpHost || !config.smtpPort || !config.emailUsername || !config.emailPass) {
    console.warn("SMTP not configured. Logging reset code to server console.");
    console.log(`Password reset code for ${to}: ${code}`);
    return { ok: false, message: "SMTP not configured; code logged to server console" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: false,
      auth: {
        user: config.emailUsername,
        pass: config.emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Support Team" <${config.emailUsername}>`,
      to,
      subject: "Password Reset Code",
      html: `
        <h2>Password Reset</h2>
        <p>Your password reset code is:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    return { ok: true };
  } catch (err) {
    console.error("Error sending reset email:", err);
    return { ok: false, message: err?.message || String(err) };
  }
};
