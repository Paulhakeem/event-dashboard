<template>
  <!-- Loading Skeleton -->
  <div
    v-if="isLoading"
    class="relative flex flex-col mt-6 bg-white shadow-lg bg-clip-border rounded-2xl w-full max-w-sm overflow-hidden border border-gray-100"
  >
    <!-- Image placeholder -->
    <div
      class="relative grid h-56 overflow-hidden bg-gray-200 bg-clip-border rounded-t-2xl place-items-center shimmer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        ></path>
      </svg>
    </div>

    <!-- Content placeholder -->
    <div class="p-6 space-y-3">
      <!-- Title placeholder -->
      <div class="h-6 bg-gray-200 rounded-lg w-3/4 shimmer"></div>

      <!-- Description placeholders -->
      <div class="space-y-2">
        <div class="h-3 bg-gray-200 rounded-full w-full shimmer"></div>
        <div class="h-3 bg-gray-200 rounded-full w-5/6 shimmer"></div>
        <div class="h-3 bg-gray-200 rounded-full w-4/5 shimmer"></div>
      </div>

      <!-- Price placeholder -->
      <div class="pt-2">
        <div class="h-5 bg-gray-200 rounded-lg w-1/3 shimmer"></div>
      </div>
    </div>

    <!-- Button placeholder -->
    <div class="p-6 pt-0">
      <div class="h-10 bg-gray-200 rounded-lg w-full shimmer"></div>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="hasError"
    class="relative flex flex-col items-center justify-center mt-6 bg-white shadow-lg bg-clip-border rounded-2xl w-full max-w-sm p-8 border border-red-100"
  >
    <!-- Error Icon -->
    <div
      class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 text-red-600"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c.866 1.5 2.926 2.625 5.303 2.625s4.437-1.125 5.303-2.625m0 0a3.75 3.75 0 1 1-7.5 0m7.5 0a3.75 3.75 0 1 0-7.5 0M3.375 9a6.375 6.375 0 1 1 12.75 0A6.375 6.375 0 0 1 3.375 9Z"
        ></path>
      </svg>
    </div>

    <!-- Error Message -->
    <h3 class="text-lg font-semibold text-gray-800 mb-2 text-center">
      {{ errorTitle || "No Events Found" }}
    </h3>
    <p class="text-sm text-gray-600 text-center mb-6">
      {{
        errorMessage ||
        "There are no events available at the moment. Please try again later."
      }}
    </p>

    <!-- Retry Button (optional) -->
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.995-3.746"
        ></path>
      </svg>
      Try Again
    </button>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default:
      "There are no events available at the moment. Please try again later.",
  },
  errorTitle: {
    type: String,
    default: "No Events Found",
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["retry"]);
</script>

<!-- Animated gradient overlay for shimmer effect -->
<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>
