// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
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
        striptags: resolve(__dirname, "shims/striptags.js"),
      },
    },
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
    darajaUrl: process.env.DARAJA_URL,
    darajaInitiator: process.env.MPESA_INITIATOR,
    darajaSecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    darajaPartyA: process.env.MPESA_PARTY_A,
    darajaPasskey: process.env.MPESA_PASSKEY,
    appUrl: process.env.APP_URL,
    mpesaShortCode: process.env.MPESA_SHORT_CODE,
    // openAI
    deepseekApiKey: process.env.DEEPSEEK_API,

    public: {
      // 🌍 Client-available (unsafe)
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      // api request
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
      organiserBookedEvents: process.env.ORGANISER_BOOKED_EVENTS_API,
      organiserBookingEvents: process.env.ORGANISER_BOOKING_EVENTS_API
    },
  },
});
