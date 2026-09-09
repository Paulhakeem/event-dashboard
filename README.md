# Velora Events — Monorepo

Digital online events booking platform. Discover, book, and manage events with separate **web** and **admin** applications sharing a common package.

## Structure

```
├── apps/
│   ├── web/      # Public website — @velora/web (Nuxt)
│   └── admin/    # Admin dashboard — @velora/admin (Nuxt)
├── packages/
│   └── shared/   # Shared composables & components — @velora/shared
├── ecosystem.config.cjs  # PM2 production config (web app)
└── pnpm-workspace.yaml
```

Each app is a self-contained Nuxt application with its own `app/` (pages, components, composables), `server/` (API routes, models, utils), and `public/`. The backend (MongoDB, authentication, payments, notifications) is deployed with the web app.

## Requirements

- Node.js 20+
- pnpm 11+

## Setup

```bash
pnpm install
```

Create a `.env` file inside `apps/web/` (and `apps/admin/`) with the environment variables referenced in each app's `nuxt.config.ts`. See the root `.gitignore` — env files are not committed.

## Development

Run both apps in parallel:

```bash
pnpm dev
```

Run a single app:

```bash
pnpm dev:web     # public website  → http://localhost:3000
pnpm dev:admin   # admin dashboard → http://localhost:3001
```

## Build

```bash
pnpm build            # build both apps
pnpm build:web        # build the public website
pnpm build:admin      # build the admin dashboard
```

## Production (PM2)

Build the web app, then start it with PM2:

```bash
pnpm build:web
pm2 startOrReload ecosystem.config.cjs --update-env
```

The PM2 config (`.env` path, port, memory limits) lives in `ecosystem.config.cjs` at the repo root.