// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["shadcn-nuxt", "@nuxt/icon"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  // components: {
  //   dirs: [
  //     "~/components", // auto-import your own components
  //     { path: "~/app/components/ui", global: false , extensions: [".vue"]}, // disable auto-import for shadcn-vue
  //   ],
  // },
});