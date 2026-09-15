// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Velora Events Admin",
      titleTemplate: "%s | Velora Admin",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Velora Events Admin Panel",
        },
        { name: "robots", content: "noindex,nofollow" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap",
        },
      ],
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-charts", "@velora/shared"],

  routeRules: {
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "script-src-elem 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https:",
          "frame-src 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
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
  },

  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryPresetName: process.env.CLOUDINARY_PRESET_NAME,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    mongoUrl: process.env.CONNECTION_STR,
    secretStr: process.env.SECRET_STR,
    emailUsername: process.env.EMAIL_USERNAME,
    emailPass: process.env.EMAIL_PASSWORD,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    darajaConsumerKey: process.env.MPESA_CONSUMER_KEY,
    darajaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
    darajaUrl: process.env.DARAJA_URL,
    darajaInitiator: process.env.MPESA_INITIATOR,
    darajaSecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    darajaPartyA: process.env.MPESA_PARTY_A,
    darajaPasskey: process.env.MPESA_PASSKEY,
    appUrl: process.env.APP_URL,
    mpesaShortCode: process.env.MPESA_SHORT_CODE,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    deepseekApiKey: process.env.DEEPSEEK_API,
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,

    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      pendingEventApi: "/api/events/fetch",
      approvedEvent: "/api/events",
      rejectedEvents: "/api/events",
      totalEventsApi: "/api/events/fetch",
      usersApi: "/api/users",
      createAdminApi: "/api/admin/create-admin",
      deleteEvent: "/api/admin/events",
      updateEvent: "/api/admin/events",
      createEventApi: "/api/upload/post",
      cancelEventsApi: "/api/tickets/cancel-ticket",
      bookingData: "/api/admin/bookings",
      monthlyStatsApi: "/api/stats/monthly",
      totalAmountApi: "/api/events/totalAmount",
      ticketsEvents: "/api/tickets/ticket-filter",
      searchApi: "/api/search/filter",
      notificationsApi: "/api/notification/notifications",
      deleteNotification: "/api/notification",
      profileUpdateApi: "/api/Profile/edit-profile",
      profileDeleteApi: "/api/Profile/delete-profile",
      ticketCancelApi: "/api/tickets/cancel-ticket",
      cancelledSummaryApi: "/api/tickets/cancelled-summary",
      bookedEvents: "/api/events/bookedEvents",
    },
  },
});
