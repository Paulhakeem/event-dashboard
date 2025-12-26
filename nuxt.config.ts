// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
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
    // paystack
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    public: {
      // 🌍 Client-available (unsafe)
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
       paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
    },
  },
});
