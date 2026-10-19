<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f8f7f3] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
  >
    <div
      class="pointer-events-none absolute -right-28 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-[#13284b]/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-6xl">
      <!-- Hero -->
      <section
        class="relative isolate overflow-hidden rounded-3xl bg-[#101d3a] text-white shadow-2xl shadow-slate-900/20 sm:rounded-4xl"
      >
        <div
          class="absolute inset-0 -z-10 bg-linear-to-r from-[#081226]/95 via-[#101d3a]/85 to-[#101d3a]/40"
          aria-hidden="true"
        />
        <div
          class="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-[32px] border-amber-300/15"
          aria-hidden="true"
        />
        <div
          class="relative grid items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 md:grid-cols-[1.2fr_0.8fr] md:px-14 lg:px-16"
        >
          <div class="max-w-2xl">
            <p
              class="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur"
            >
              <Icon name="material-symbols:info-outline" class="text-base" />
              About Happitwin
            </p>
            <h1
              class="max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Where great events
              <span class="text-amber-300">come to life.</span>
            </h1>
            <p class="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Happitwin Events is a modern platform built to help people
              discover, book, and manage unforgettable experiences — while
              giving organisers the tools to sell out with confidence.
            </p>
            <div class="mt-7 flex flex-col gap-3 sm:flex-row">
              <NuxtLink
                to="/eventPage"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#101d3a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#101d3a]"
              >
                <Icon name="material-symbols:event-outline" class="text-lg" />
                Explore events
              </NuxtLink>
              <NuxtLink
                to="/contacts"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-amber-300/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <Icon name="material-symbols:forum-outline" class="text-lg" />
                Talk to us
              </NuxtLink>
            </div>
          </div>

          <div class="hidden justify-center md:flex">
            <div
              class="relative flex h-56 w-56 items-center justify-center rounded-3xl border border-amber-300/30 bg-white/5 shadow-2xl backdrop-blur-sm lg:h-64 lg:w-64"
              aria-hidden="true"
            >
              <div class="absolute inset-3 rounded-2xl border border-white/10" />
              <Icon
                name="mdi:calendar-star"
                class="text-8xl text-amber-300 drop-shadow-lg lg:text-9xl"
              />
              <span
                class="absolute -bottom-4 -right-5 rounded-xl border border-white/10 bg-[#101d3a]/90 px-4 py-3 text-xs font-semibold text-white shadow-xl"
              >
                From roots to reach
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission -->
      <section
        class="grid gap-6 py-4 pt-8 sm:py-6 sm:pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700"
          >
            Our mission
          </p>
          <h2
            class="mt-2 text-2xl font-bold tracking-tight text-[#101d3a] sm:text-3xl"
          >
            Making every event effortless
          </h2>
          <p class="mt-3 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            We believe organising and attending events should feel exciting, not
            stressful. That is why we blend beautiful design with reliable
            tooling so organisers can focus on the experience and guests can
            focus on the moment.
          </p>
          <ul class="mt-6 space-y-3">
            <li
              v-for="point in missionPoints"
              :key="point"
              class="flex items-start gap-3 text-sm text-slate-700"
            >
              <Icon
                name="material-symbols:check-circle"
                class="mt-0.5 shrink-0 text-lg text-emerald-500"
              />
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/5"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl text-[#13284b] transition group-hover:bg-amber-300"
            >
              <Icon :name="feature.icon" />
            </span>
            <h3 class="mt-4 text-base font-bold text-[#101d3a]">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="py-8 sm:py-10">
        <div class="mb-8 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            How it works
          </p>
          <h2
            class="mt-2 text-2xl font-bold tracking-tight text-[#101d3a] sm:text-3xl"
          >
            Three steps to your next event
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/5"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-[#13284b] text-sm font-black text-amber-300"
            >
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-base font-bold text-[#101d3a]">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section
        class="relative isolate overflow-hidden rounded-3xl bg-linear-to-r from-[#101d3a] via-[#172b50] to-[#213c35] px-6 py-10 text-white shadow-2xl shadow-slate-900/20 sm:px-10 sm:py-12 sm:rounded-4xl"
      >
        <div
          class="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-amber-300/15"
          aria-hidden="true"
        />
        <div
          class="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left"
        >
          <div class="max-w-xl">
            <h2 class="text-2xl font-black tracking-tight sm:text-3xl">
              Ready to create something unforgettable?
            </h2>
            <p class="mt-3 text-sm leading-7 text-white/75 sm:text-base">
              Join thousands of organisers and guests building memorable
              experiences on Happitwin.
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/signup"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#101d3a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              <Icon name="material-symbols:person-add-outline" class="text-lg" />
              Get started
            </NuxtLink>
            <NuxtLink
              to="/eventPage"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-amber-300/70 hover:bg-white/10"
            >
              Browse events
            </NuxtLink>
          </div>
        </div>
      </section>

      <p class="py-6 text-center text-xs text-slate-400">
        © {{ new Date().getFullYear() }} Happitwin events. All rights reserved.
      </p>
    </div>
  </main>
</template>

<script setup>
useHead({
  title: "About Happitwin Events",
  meta: [
    {
      name: "description",
      content:
        "Learn about Happitwin Events — a modern platform for discovering, booking, and managing unforgettable events.",
    },
    { property: "og:title", content: "About Happitwin Events" },
    {
      property: "og:description",
      content:
        "Discover the mission, features, and story behind the Happitwin Events platform.",
    },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

const missionPoints = [
  "Seamless ticketing from discovery to entry",
  "Powerful tools that help organisers sell out",
  "A booking experience guests actually enjoy",
];

const features = [
  {
    title: "Discover events",
    description:
      "Browse curated events by category and find your next experience in seconds.",
    icon: "material-symbols:explore-outline",
  },
  {
    title: "Instant booking",
    description:
      "Reserve tickets securely with flexible ticket types and quantities.",
    icon: "mdi:ticket-confirmation-outline",
  },
  {
    title: "Organiser tools",
    description:
      "Create, publish, and track your events with real-time insights.",
    icon: "material-symbols:insights-outline",
  },
  {
    title: "Trusted & secure",
    description:
      "Reliable payments and validated entry keep every event running smoothly.",
    icon: "material-symbols:verified-user-outline",
  },
];

const steps = [
  {
    title: "Create your event",
    description:
      "Set up your event details, ticket types, and pricing in minutes.",
  },
  {
    title: "Share and sell",
    description:
      "Publish with a shareable link and watch bookings roll in.",
  },
  {
    title: "Manage with ease",
    description:
      "Track attendees, tickets, and performance from one dashboard.",
  },
];
</script>
