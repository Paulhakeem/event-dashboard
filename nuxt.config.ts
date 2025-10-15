// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["shadcn-nuxt", "@nuxt/icon", "@nuxt/image", "nuxt-charts"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  runtimeConfig: {
    cloudinary: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
      cloundinaryPresetName: process.env.CLOUNDINARY_PRESET_NAME,
    },
    // 🔒 Server-only (safe)
    mongoUrl: process.env.CONNECTION_STR,
    secretStr: process.env.SECRET_STR,
  },
});
