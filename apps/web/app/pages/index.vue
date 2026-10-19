<script setup>
useHead({
  title: "Events Booking Platform - Discover, Book, and Manage Events",
  meta: [
    {
      name: "description",
      content:
        "Happitwin events is a modern platform for discovering, booking, and managing events with ease.",
    },
    { property: "og:title", content: "Happitwin events - Home" },
    {
      property: "og:description",
      content: "Discover, book, and manage amazing events all in one place.",
    },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <header
      class="relative w-full min-h-125 sm:min-h-150 md:min-h-175 bg-cover bg-center flex items-center justify-center overflow-hidden"
      style="background-image: url(&quot;/images/dj.jpg&quot;)"
    >
      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-transparent"
      ></div>

      <!-- Content -->
      <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div class="space-y-6 text-center md:text-left">
            <div class="space-y-3">
              <h1
                class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                HappiTwin
                <span class="text-amber-300 block md:inline">Events</span>
              </h1>
              <p
                class="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-md mx-auto md:mx-0"
              >
                Discover, book, and manage amazing events all in one place.
                Experience seamless event management at your fingertips.
              </p>
            </div>

            <!-- CTA Buttons -->
            <div
              class="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start"
            >
              <NuxtLink
                to="/eventPage"
                class="px-8 py-3 bg-amber-300 text-[#101d3a] font-semibold rounded-lg hover:bg-amber-200 transform hover:scale-105 transition duration-200 text-center shadow-lg shadow-black/20"
              >
                Explore Events
              </NuxtLink>
              <NuxtLink
                to="/signup"
                class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200 text-center"
              >
                Be Organiser😁
              </NuxtLink>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-8 md:pt-0">
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-amber-300">
                  1000+
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Events</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-amber-300">
                  50K+
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Users</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-amber-300">
                  100%
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>

          <!-- Right Visual Element -->
          <div class="hidden md:flex justify-center">
            <div
              class="relative flex h-96 w-80 items-center justify-center rounded-3xl border border-amber-300/30 bg-linear-to-br from-[#13284b]/60 to-amber-500/20 backdrop-blur-sm"
            >
              <div
                class="absolute inset-0 rounded-3xl bg-linear-to-br from-amber-300/10 to-transparent"
              ></div>
              <Icon
                name="mdi:ticket-percent"
                class="relative z-10 text-8xl text-amber-300/80"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen">
      <!-- Highlights -->
      <home-highlights />

      <!-- Events Display -->
      <events-event-page />

      <!-- Newsletter Section -->
      <section
        class="bg-linear-to-r from-[#101d3a] via-[#172b50] to-[#213c35]"
      >
        <subscribe />
      </section>
    </main>
  </div>
</template>
