import nodemailer from "nodemailer";

export const sendResetEmail = async (to, code) => {
  const config = useRuntimeConfig();

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
    from: `"Support Team" <${config.emailUsernamer}>`,
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
};
