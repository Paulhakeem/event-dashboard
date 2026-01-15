<template>
  <div>
    <!-- Hero Section -->
    <header class="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style="background-image: url('/images/dj.jpg')"
    >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-transparent"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div class="space-y-6 text-center md:text-left">
            <div class="space-y-3">
              <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                B.M.E <span class="text-[#9c4e8b] block md:inline">Events</span>
              </h1>
              <p class="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-md mx-auto md:mx-0">
                Discover, book, and manage amazing events all in one place. 
                Experience seamless event management at your fingertips.
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <NuxtLink
                to="/eventPage"
                class="px-8 py-3 bg-[#9c4e8b] text-white font-semibold rounded-lg hover:bg-[#7c3a6d] transform hover:scale-105 transition duration-200 text-center shadow-lg"
              >
                Explore Events
              </NuxtLink>
              <NuxtLink
                v-if="user && user.role === 'admin'"
                to="/admin/dashboard"
                class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200 text-center"
              >
                Create Event
              </NuxtLink>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-8 md:pt-0">
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">1000+</p>
                <p class="text-xs sm:text-sm text-gray-300">Events</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">50K+</p>
                <p class="text-xs sm:text-sm text-gray-300">Users</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">100%</p>
                <p class="text-xs sm:text-sm text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>

          <!-- Right Visual Element -->
          <div class="hidden md:flex justify-center">
            <div class="relative w-80 h-96 bg-gradient-to-br from-[#9c4e8b]/20 to-purple-600/20 rounded-3xl flex items-center justify-center border border-[#9c4e8b]/30 backdrop-blur-sm">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#9c4e8b]/10 to-transparent"></div>
              <Icon name="mdi:ticket-percent" class="text-8xl text-[#9c4e8b]/40 relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen">
      <!-- Loading Skeleton -->
      <div v-if="!eventPosters.length" class="py-20">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Loading Events...</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <skeleton-card/>
            <skeleton-card/>
            <skeleton-card/>
            <skeleton-card/>
          </div>
        </div>
      </div>

      <!-- Events Display -->
      <events-event-page v-else />

      <!-- Newsletter Section -->
      <section class="bg-gradient-to-r from-[#020f31] via-[#1a1f3a] to-[#2d1b4e]">
        <subscribe />
      </section>
    </main>
  </div>
</template>

<script setup>
const { eventPosters } = EventFunctions();
const { user } = useAuth();
</script>
