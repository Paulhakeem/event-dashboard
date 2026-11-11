# Happitwin events — Monorepo

Digital online events booking platform. Discover, book, and manage events with separate **web**, **admin**, and **organiser** applications sharing a common package.

## Structure

```
├── apps/
│   ├── web/        # Public website — @velora/web (Nuxt)
│   ├── admin/      # Admin dashboard — @velora/admin (Nuxt)
│   └── organiser/  # Organiser dashboard — @velora/organiser (Nuxt)
├── packages/
│   └── shared/   # Shared composables & components — @velora/shared
├── ecosystem.config.cjs  # PM2 production config (web, admin & organiser apps)
└── pnpm-workspace.yaml
```

Each app is a self-contained Nuxt application with its own `app/` (pages, components, composables), `server/` (API routes, models, utils), and `public/`. The backend (MongoDB, authentication, payments, notifications) is deployed with the web app. The organiser app has its own authentication, organiser dashboard, and organiser API routes.

## Requirements

- Node.js 20+
- pnpm 11+

## Setup

```bash
pnpm install
```

Create a `.env` file inside `apps/web/`, `apps/admin/`, and `apps/organiser/` with the environment variables referenced in each app's `nuxt.config.ts`. See each app's `.env.example` where provided. The root `.gitignore` excludes env files from version control.

## PayHero payments

Set `PAYHERO_USERNAME`, `PAYHERO_PASSWORD`, and `PAYHERO_CHANNEL_ID` in the `apps/web` environment. The web app serves the booking payment API and sets `APP_URL` to its public HTTPS base URL in production. PayHero sends payment callbacks to `/api/booking/payhero-callback`; it cannot reach a localhost callback from its servers, so use a public HTTPS tunnel for end-to-end callback testing. While a payment is pending, verification also checks PayHero's transaction-status endpoint. If confirmation is delayed, the booking page lets the attendee recheck the same payment rather than starting another one. Booking confirmation emails with ticket PDF attachments require `SMTP_HOST`, `SMTP_PORT`, `EMAIL_USERNAME`, and `EMAIL_PASSWORD` in the web app environment. Delivery status is saved on the booking, and a later verification retry resends only emails that were not successfully delivered. Admin notifications are sent to all admin accounts with an email address. The web booking page defaults to the local `/api/booking/stkpush` and `/api/booking/verify` routes, with `STKPUSH_API` and `VERIFY_API` available as overrides. The admin app does not serve booking payment endpoints.

## Development

Run all apps in parallel:

```bash
pnpm dev
```

Run a single app:

```bash
pnpm dev:web        # public website      → http://localhost:3000
pnpm dev:admin      # admin dashboard     → http://localhost:3001
pnpm dev:organiser  # organiser dashboard → http://localhost:3007
```

## Build

```bash
pnpm build            # build all apps
pnpm build:web        # build the public website
pnpm build:admin      # build the admin dashboard
pnpm build:organiser  # build the organiser dashboard
```

## Production (PM2)

Build the web app, then start it with PM2:

```bash
pnpm build:web
pm2 startOrReload ecosystem.config.cjs --update-env
```

The PM2 config (`.env` path, port, memory limits) lives in `ecosystem.config.cjs` at the repo root.