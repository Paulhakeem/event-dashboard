// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-charts"],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'striptags': resolve(__dirname, 'shims/striptags.js')
      }
    }
  },
  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloundinaryPresetName: process.env.CLOUNDINARY_PRESET_NAME,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    // 🔒 Server-only (safe)
    mongoUrl: process.env.CONNECTION_STR,
    secretStr: process.env.SECRET_STR,
    // email
    emailUsername: process.env.EMAIL_USERNAME,
    emailPass: process.env.EMAIL_PASSWORD,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,

    // Daraja M-Pesa
    darajaConsumerKey: process.env.MPESA_CONSUMER_KEY,
    darajaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
    darajaUrl: process.env.MPESA_URL,
    darajaInitiator: process.env.MPESA_INITIATOR,
    darajaSecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    darajaPartyA: process.env.MPESA_PARTY_A,
    darajaPasskey: process.env.MPESA_PASSKEY,
    appUrl: process.env.APP_URL,
    mpesaShortCode: process.env.MPESA_SHORT_CODE,
    // openAI
    openAiApiKey: process.env.OPENAI_API_KEY,

    public: {
      // 🌍 Client-available (unsafe)
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
  },

});
