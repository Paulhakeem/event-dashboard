<template>
  <section class="relative bg-[#f8f7f3] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Why choose us -->
      <div class="mb-14 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
          Why Happitwin
        </p>
        <h2
          class="mx-auto mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#101d3a] sm:text-4xl"
        >
          Everything you need for a standout event
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          From discovery to a sold-out show, Happitwin gives organisers and
          guests one seamless experience built on trust and great design.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/5"
        >
          <span
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-[#13284b] transition group-hover:bg-amber-300"
          >
            <Icon :name="feature.icon" />
          </span>
          <h3 class="mt-5 text-base font-bold text-[#101d3a]">
            {{ feature.title }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <!-- Browse by category -->
      <div class="mt-16">
        <div class="mb-8 flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Find your vibe
            </p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-[#101d3a] sm:text-3xl">
              Browse by category
            </h2>
          </div>
          <NuxtLink
            to="/eventPage"
            class="inline-flex items-center gap-2 self-center text-sm font-bold text-[#13284b] transition hover:text-[#9c4e8b] sm:self-auto"
          >
            View all events
            <Icon name="material-symbols:arrow-forward-rounded" />
          </NuxtLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="category in categories"
            :key="category.name"
            :to="`/eventPage?type=${encodeURIComponent(category.name)}`"
            class="group relative isolate flex min-h-32 flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
          >
            <div
              class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70 transition duration-300 group-hover:scale-125"
              :class="category.blob"
              aria-hidden="true"
            />
            <span
              class="relative flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-white shadow-lg"
              :class="category.tint"
            >
              <Icon :name="category.icon" />
            </span>
            <div class="relative">
              <p class="text-base font-bold text-[#101d3a]">
                {{ category.name }}
              </p>
              <p class="mt-1 text-xs text-slate-500">{{ category.blurb }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- How it works -->
      <div class="mt-16 overflow-hidden rounded-4xl bg-[#101d3a] px-6 py-12 text-white sm:px-10 sm:py-14">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Get started in minutes
          </p>
          <h2 class="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            How Happitwin works
          </h2>
        </div>

        <div class="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-sm font-black text-[#101d3a]"
            >
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-base font-bold">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-white/70">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: "Curated discovery",
    description:
      "Find events that match your interests with smart categories and filters.",
    icon: "material-symbols:explore-outline",
  },
  {
    title: "Flexible ticketing",
    description:
      "Multiple ticket types, transparent pricing, and instant confirmation.",
    icon: "mdi:ticket-confirmation-outline",
  },
  {
    title: "Organiser toolkit",
    description:
      "Create, publish, and track performance from a single dashboard.",
    icon: "material-symbols:insights-outline",
  },
  {
    title: "Secure by design",
    description:
      "Trusted payments and validated entry keep every event running smoothly.",
    icon: "material-symbols:verified-user-outline",
  },
];

const categories = [
  {
    name: "Entertainment",
    blurb: "Concerts, parties & live shows",
    icon: "material-symbols:celebration-outline",
    tint: "bg-gradient-to-br from-[#13284b] to-[#0b1730]",
    blob: "bg-amber-200",
  },
  {
    name: "Arts & Culture",
    blurb: "Exhibitions, theatre & more",
    icon: "material-symbols:palette-outline",
    tint: "bg-gradient-to-br from-[#9c4e8b] to-[#6d3560]",
    blob: "bg-pink-200",
  },
  {
    name: "Tech & Business",
    blurb: "Conferences, summits & meetups",
    icon: "material-symbols:rocket-launch-outline",
    tint: "bg-gradient-to-br from-[#213c35] to-[#132520]",
    blob: "bg-emerald-200",
  },
  {
    name: "Other",
    blurb: "Community & everything else",
    icon: "material-symbols:event-outline",
    tint: "bg-gradient-to-br from-amber-500 to-amber-600",
    blob: "bg-amber-200",
  },
];

const steps = [
  {
    title: "Discover events",
    description: "Browse and pick the experience that excites you most.",
  },
  {
    title: "Book in seconds",
    description: "Choose your ticket type and quantity, then pay securely.",
  },
  {
    title: "Show up & enjoy",
    description: "Get instant confirmation and a shareable entry ticket.",
  },
];
</script>
