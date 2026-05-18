<template>
  <div>
    <!-- Error Toast Notification -->
    <Transition
      name="slide-fade"
      @enter="
        (el) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(-20px)';
        }
      "
      @after-enter="
        (el) => {
          el.style.transition = 'all 0.3s';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      "
    >
      <div
        v-if="showErrorToast"
        class="fixed top-4 right-4 z-50 max-w-sm bg-red-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-pulse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 flex-shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c.866 1.5 2.926 2.625 5.303 2.625s4.437-1.125 5.303-2.625m0 0a3.75 3.75 0 1 1-7.5 0m7.5 0a3.75 3.75 0 1 0-7.5 0M3.375 9a6.375 6.375 0 1 1 12.75 0A6.375 6.375 0 0 1 3.375 9Z"
          ></path>
        </svg>
        <span class="flex-1">{{ errorMessage }}</span>
        <button
          @click="showErrorToast = false"
          class="text-white hover:text-red-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Hero Section -->
    <header
      class="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] bg-cover bg-center flex items-center justify-center overflow-hidden"
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
                Velora
                <span class="text-[#9c4e8b] block md:inline">Events</span>
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
                class="px-8 py-3 bg-[#9c4e8b] text-white font-semibold rounded-lg hover:bg-[#7c3a6d] transform hover:scale-105 transition duration-200 text-center shadow-lg"
              >
                Explore Events
              </NuxtLink>
              <NuxtLink
                to="/"
                class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-200 text-center"
              >
                Be Organiser😁
              </NuxtLink>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-8 md:pt-0">
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">
                  1000+
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Events</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">
                  50K+
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Users</p>
              </div>
              <div class="text-center">
                <p class="text-2xl sm:text-3xl font-bold text-[#9c4e8b]">
                  100%
                </p>
                <p class="text-xs sm:text-sm text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>

          <!-- Right Visual Element -->
          <div class="hidden md:flex justify-center">
            <div
              class="relative w-80 h-96 bg-gradient-to-br from-[#9c4e8b]/20 to-purple-600/20 rounded-3xl flex items-center justify-center border border-[#9c4e8b]/30 backdrop-blur-sm"
            >
              <div
                class="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#9c4e8b]/10 to-transparent"
              ></div>
              <Icon
                name="mdi:ticket-percent"
                class="text-8xl text-[#9c4e8b]/40 relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen">
      <!-- Loading & Error States -->
      <div
        v-if="!eventPosters.length"
        class="py-20 text-center justify-center items-center"
      >
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <skeleton-card
              :isLoading="loading"
              :hasError="error"
              errorMessage="Failed to load events. Please try again."
              errorTitle="Oops! Something went wrong"
              :showRetry="true"
              @retry="retryLoadEvents"
            />
            <skeleton-card v-if="!error" :isLoading="loading" />
            <skeleton-card v-if="!error" :isLoading="loading" />
            <skeleton-card v-if="!error" :isLoading="loading" />
          </div>
        </div>
      </div>

      <!-- Events Display -->
      <events-event-page v-else />

      <!-- Newsletter Section -->
      <section
        class="bg-gradient-to-r from-[#020f31] via-[#1a1f3a] to-[#2d1b4e]"
      >
        <subscribe />
      </section>
    </main>
  </div>
</template>

<script setup>
const { eventPosters, fetchEvents } = EventFunctions();
const { user } = useAuth();

const loading = ref(true);
const error = ref(false);
const showErrorToast = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  try {
    loading.value = true;
    error.value = false;
    await fetchEvents();
  } catch (err) {
    console.error("Error loading events:", err);
    error.value = true;
    errorMessage.value = err.message || "Failed to load events";
  } finally {
    loading.value = false;
  }
});

const retryLoadEvents = async () => {
  try {
    loading.value = true;
    error.value = false;
    showErrorToast.value = false;
    await fetchEvents();

    // Check if events were fetched
    if (!eventPosters.value || eventPosters.value.length === 0) {
      showErrorToast.value = true;
      errorMessage.value = "No events found. Please check back later.";
      loading.value = false;
      return;
    }
  } catch (err) {
    console.error("Error retrying events:", err);
    error.value = true;
    errorMessage.value = err.message || "Failed to load events";
    showErrorToast.value = true;
  } finally {
    loading.value = false;
  }
};

// Auto-hide error toast after 5 seconds
watch(showErrorToast, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showErrorToast.value = false;
    }, 5000);
  }
});
</script>
