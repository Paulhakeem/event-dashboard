<template>
  <!-- Newsletter Section -->
  <div class="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-72 h-72 bg-[#9c4e8b] rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
    </div>

    <!-- Content -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Left Section -->
        <div class="space-y-6">
          <div class="space-y-3">
            <span class="inline-block px-4 py-2 bg-[#9c4e8b]/20 text-[#9c4e8b] rounded-full text-sm font-semibold">
              Stay Connected
            </span>
            <h2 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Never Miss an Event
            </h2>
            <p class="text-lg text-gray-300 leading-relaxed">
              Subscribe to our newsletter and get notified about upcoming events, special offers, and exclusive deals delivered right to your inbox.
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-3 pt-4">
            <div class="flex items-center gap-3">
              <Icon name="mdi:check-circle" class="text-[#9c4e8b] text-xl flex-shrink-0" />
              <span class="text-gray-300">Exclusive event updates</span>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="mdi:check-circle" class="text-[#9c4e8b] text-xl flex-shrink-0" />
              <span class="text-gray-300">Early access to bookings</span>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="mdi:check-circle" class="text-[#9c4e8b] text-xl flex-shrink-0" />
              <span class="text-gray-300">Special discounts & offers</span>
            </div>
          </div>
        </div>

        <!-- Right Section - Form -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10">
          <form @submit.prevent="handleSubscribe" class="space-y-5">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-3">
                Email Address
              </label>
              <input
                type="email"
                v-model="email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:border-transparent transition"
              />
            </div>

            <!-- Subscribe Button -->
            <button
              type="submit"
              class="w-full px-6 py-3 bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#9c4e8b]/50 transform hover:scale-105 transition duration-200"
            >
              Subscribe Now
            </button>

            <!-- Privacy Text -->
            <p class="text-xs text-gray-400 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>

          <!-- Messages -->
          <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p class="text-sm text-red-300 flex items-center gap-2">
              <Icon name="mdi:alert-circle" />
              {{ error }}
            </p>
          </div>

          <div v-if="success" class="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p class="text-sm text-green-300 flex items-center gap-2">
              <Icon name="mdi:check-circle" />
              {{ success }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const error = ref("");
const success = ref("");

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
const handleSubscribe = () => {
  error.value = "";
  success.value = "";

  if (!validateEmail(email.value)) {
    error.value = "Please enter a valid email address.";
    return;
  }

  // Simulate successful subscription
  success.value = "Thank you for subscribing!";
  email.value = "";
};
</script>
