import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Organiser Dashboard",
      titleTemplate: "%s | Happitwin events",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Happitwin organiser dashboard — create events, track bookings, and manage attendees.",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500&display=swap",
        },
      ],
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem("happitwin-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
        },
      ],
    },
  },

  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  css: ["~/assets/css/index.css"],

  modules: ["@nuxt/icon", "nuxt-charts", "@velora/shared"],

  routeRules: {
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",

          // JavaScript
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
          "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com",

          // CSS
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",

          // Fonts
          "font-src 'self' https://fonts.gstatic.com data:",

          // Images
          "img-src 'self' data: https: blob:",

          // API and Cloudflare Analytics connections
          "connect-src 'self' https: https://cloudflareinsights.com",

          "upgrade-insecure-requests",
        ].join("; "),

        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(self), microphone=(), geolocation=()",
        "X-XSS-Protection": "1; mode=block",
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],

    resolve: {
      alias: {
        striptags: resolve(import.meta.dirname, "shims/striptags.js"),
      },
    },

    optimizeDeps: {
      include: ["jwt-decode", "vue-chrts"],
    },
  },

  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryPresetName: process.env.CLOUDINARY_PRESET_NAME,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,

    mongoUrl: process.env.CONNECTION_STR,
    secretStr: process.env.SECRET_STR,

    appUrl: process.env.APP_URL || "http://localhost:3007",

    public: {
      organiserEvents:
        process.env.ORGANISER_EVENTS_API || "/api/organiser/total-events",

      organiserCreateEventApi:
        process.env.ORGANISER_CREATE_EVENT_API || "/api/organiser/addevent",

      organiserNotifications:
        process.env.ORGANISER_NOTIFICATIONS_API ||
        "/api/organiser/notifications/receiveNot",

      organiserBookingEvents:
        process.env.ORGANISER_BOOKED_EVENTS_API ||
        "/api/organiser/bookedEvents/booking",

      organiserTotalAmount:
        process.env.ORGANISER_TOTAL_AMOUNT_API || "/api/organiser/totalIncome",

      eventApi: process.env.EVENT_API || "/api/events",

      updateEvent: process.env.UPDATE_EVENT_API || "/api/events",

      deleteEvent: process.env.DELETE_EVENT_API || "/api/events",

      pendingEventApi: process.env.PENDING_EVENT_API || "/api/events/fetch",

      approvedEvent: process.env.APPROVED_EVENT_API || "/api/events",

      rejectedEvents: process.env.REJECTED_EVENTS_API || "/api/events",

      totalEventsApi: process.env.TOTAL_EVENTS_API || "/api/events/fetch",

      bookedEvents: process.env.BOOKEDEVENTS_API || "/api/events/bookedEvents",

      totalAmountApi: process.env.TOTAL_AMOUNT_API || "/api/events/totalAmount",

      ticketsEvents: process.env.TICKETS_EVENT_API || "/api/users/userTickets",

      bookingData: process.env.BOOKING_DATA_API || "/api/users/userInfo",

      profileUpdateApi:
        process.env.PROFILE_UPDATE_API || "/api/Profile/edit-profile",

      profileDeleteApi:
        process.env.PROFILE_DELETE_API || "/api/Profile/delete-profile",
    },
  },
});
