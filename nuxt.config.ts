// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  app: {
    head: {
      title:
        "Digital Online Events Booking Platform, Discover, Book, and Manage Events",
      titleTemplate: "%s | Velora Events",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Velora Events Dashboard helps organisers and attendees discover, manage, and book events in one place.",
        },
        { property: "og:title", content: "Velora Events Dashboard" },
        {
          property: "og:description",
          content:
            "Discover, book, and manage amazing events all in one place.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
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
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-charts", "nuxt-google-auth"],

  routeRules: {
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          // script-src: covers eval/inline and all needed Google script origins
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
          // script-src-elem: explicitly covers <script src="..."> tags
          "script-src-elem 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
          // style-src: added https://accounts.google.com for GSI stylesheet
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
          // style-src-elem: explicitly covers <link rel="stylesheet"> tags
          // without this, browser blocks the GSI stylesheet even if style-src allows it
          "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: https: blob:",
          // connect-src: added Google OAuth and Accounts endpoints
          "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https:",
          // frame-src: added accounts.google.com for One Tap iframe
          "frame-src 'self' https://accounts.google.com https://www.google.com https://www.gstatic.com",
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

  googleAuth: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    autoLoadScript: true,
    promptOneTap: true,
    enableServerVerify: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        striptags: resolve(__dirname, "shims/striptags.js"),
      },
    },
    optimizeDeps: {
      include: ["@headlessui/vue", "jwt-decode", "vue-chrts"],
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
    recaptchaSecretKey: process.env.NUXT_PUBLIC_RECAPTCHA_SECRET_KEY,

    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      createEventApi: process.env.CREATE_EVENT_API,
      eventApi: process.env.EVENT_API,
      bookingEvent: process.env.BOOKING_EVENTS,
      verifyApi: process.env.VERIFY_API,
      stkpushApi: process.env.STKPUSH_API,
      chatbotApi: process.env.CHATBOT_API,
      bookedEvents: process.env.BOOKEDEVENTS_API,
      cancelEventsApi: process.env.CANCEL_EVENTS_API,
      signupApi: process.env.SIGNUP_API,
      notificationsApi: process.env.NOTIFICATIONS_API,
      deleteNotification: process.env.DELETE_NOTIFICATION_API,
      organiserEvents: process.env.ORGANISER_EVENTS_API,
      organiserCreateEventApi: process.env.ORGANISER_CREATE_EVENT_API,
      organiserNotifications: process.env.ORGANISER_NOTIFICATIONS_API,
      pendingEventApi: process.env.PENDING_EVENT_API,
      totalEventsApi: process.env.TOTAL_EVENTS_API,
      usersApi: process.env.USERS_API,
      deleteEvent: process.env.DELETE_EVENT_API,
      updateEvent: process.env.UPDATE_EVENT_API,
      bookingData: process.env.BOOKING_DATA_API,
      createAdminApi: process.env.CREATE_ADMIN_API,
      searchApi: process.env.SEARCH_API,
      approvedEvent: process.env.APPROVED_EVENT_API,
      rejectedEvents: process.env.REJECTED_EVENTS_API,
      upcomingEvents: process.env.UPCOMING_EVENTS_API,
      ticketsEvents: process.env.TICKETS_EVENT_API,
      monthlyStatsApi: process.env.MONTHLY_STATS_API,
      totalAmountApi: process.env.TOTAL_AMOUNT_API,
      organiserBookingEvents: process.env.ORGANISER_BOOKED_EVENTS_API,
      organiserTotalAmount: process.env.ORGANISER_TOTAL_AMOUNT_API,
      profileUpdateApi: process.env.PROFILE_UPDATE_API,
      profileDeleteApi: process.env.PROFILE_DELETE_API,
      ticketCancelApi: process.env.TICKET_CANCEL_API,
      cancelledSummaryApi: process.env.CANCELLED_SUMMARY_API,
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  },
});
