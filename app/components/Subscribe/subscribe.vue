<template>
  <!-- Subscribe -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16 mx-auto">
    <div class="grid gap-10 md:grid-cols-2 md:items-center">
      <!-- Left Text -->
      <div class="text-center md:text-left">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-200">Subscribe</h2>
        <p class="mt-3 text-gray-300">
          Stay updated with the latest events and exclusive offers. Join our
          mailing list today!
        </p>
      </div>

      <!-- Form Section -->
      <form class="w-full">
        <div class="w-full sm:max-w-lg md:ml-auto">
          <!-- Input + Button -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              v-model="email"
              name="hero-input"
              class="py-3 px-4 w-full rounded-lg bg-[#1a1a1a] border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-[#9c4e8b] outline-none"
              placeholder="Enter your email"
            />

            <button
              @click.prevent="handleSubscribe"
              class="w-full sm:w-auto py-3 px-6 text-center inline-flex justify-center items-center text-sm font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#843f75] transition"
            >
              Subscribe
            </button>
          </div>
          <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>

          <p v-if="success" class="mt-2 text-sm text-green-400">
            Successfully subscribed!
          </p>
          <p class="mt-3 text-sm text-gray-400">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </form>
    </div>
  </div>

  <!-- End Subscribe -->
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
