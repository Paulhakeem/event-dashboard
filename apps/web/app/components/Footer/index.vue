<template>
  <footer
    class="relative isolate overflow-hidden bg-[#081226] text-white"
    aria-labelledby="footer-heading"
  >
    <h2 id="footer-heading" class="sr-only">Footer</h2>

    <!-- Decorative background -->
    <div
      class="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#13284b]/40 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-300/40 to-transparent"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <!-- Newsletter strip -->
      <div
        class="mb-12 flex flex-col items-start gap-6 rounded-3xl border border-amber-300/20 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div class="max-w-xl">
          <h3 class="text-xl font-bold tracking-tight sm:text-2xl">
            Never miss an event
          </h3>
          <p class="mt-2 text-sm leading-6 text-white/70">
            Subscribe for early access, exclusive offers, and updates delivered
            straight to your inbox.
          </p>
        </div>
        <form
          class="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          @submit.prevent="handleSubscribe"
        >
          <label class="sr-only" for="footer-email">Email address</label>
          <input
            id="footer-email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/40"
          />
          <button
            type="submit"
            class="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#101d3a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#081226]"
          >
            <Icon name="material-symbols:send-rounded" class="text-lg" />
            Subscribe
          </button>
        </form>
      </div>

      <!-- Main grid -->
      <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-3" aria-label="Happitwin home">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 ring-1 ring-amber-300/50"
            >
              <img :src="logo" alt="" class="h-full w-full object-contain" />
            </span>
            <span>
              <span class="block text-sm font-black tracking-[0.14em]">
                HAPPITWIN
              </span>
              <span class="block text-[10px] font-medium text-amber-300">
                EVENTS · FROM ROOTS TO REACH
              </span>
            </span>
          </NuxtLink>
          <p class="mt-5 max-w-sm text-sm leading-7 text-white/65">
            Discover, book, and manage unforgettable events. Happitwin brings
            organisers and guests together in one seamless platform.
          </p>

          <div class="mt-6 flex items-center gap-3">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              :aria-label="social.name"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-lg text-white/80 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-300 hover:text-[#101d3a]"
            >
              <Icon :name="social.icon" />
            </a>
          </div>
        </div>

        <!-- Columns -->
        <div v-for="column in columns" :key="column.title">
          <h4
            class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300"
          >
            {{ column.title }}
          </h4>
          <ul class="mt-5 space-y-3">
            <li v-for="link in column.links" :key="link.name">
              <NuxtLink
                :to="link.path"
                class="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <span
                  class="h-px w-0 bg-amber-300 transition-all duration-200 group-hover:w-4"
                />
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div
        class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row"
      >
        <p>© {{ year }} Happitwin events. All rights reserved.</p>
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <NuxtLink
            v-for="item in legal"
            :key="item.name"
            :to="item.path"
            class="transition hover:text-white"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from "~/assets/logo/happitwin.png";

const year = new Date().getFullYear();
const email = ref("");

const socials = [
  { name: "Instagram", icon: "mdi:instagram", href: "https://instagram.com/happitwineventsltd" },
  { name: "WhatsApp", icon: "ic:baseline-whatsapp", href: "https://wa.me/254759732432" },
  { name: "Email", icon: "material-symbols:mail-outline", href: "mailto:support@happitwineventsltd.co.ke" },
];

const columns = [
  {
    title: "Explore",
    links: [
      { name: "Home", path: "/" },
      { name: "Events", path: "/eventPage" },
      { name: "About", path: "/about" },
      { name: "Contacts", path: "/contacts" },
    ],
  },
  {
    title: "Organisers",
    links: [
      { name: "Create an event", path: "/signup" },
      { name: "Dashboard", path: "/login" },
      { name: "Sell tickets", path: "/signup" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Login", path: "/login" },
      { name: "Sign up", path: "/signup" },
      { name: "My tickets", path: "/login" },
    ],
  },
];

const legal = [
  { name: "Privacy", path: "/about" },
  { name: "Terms", path: "/about" },
  { name: "Contact", path: "/contacts" },
];

const handleSubscribe = () => {
  email.value = "";
};
</script>
