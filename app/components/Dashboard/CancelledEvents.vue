<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Cancelled Events
        </h2>
        <p class="text-sm text-gray-500">
          Showing {{ (cancelledEvents || []).length }} cancelled events
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="loadCancelledEvents"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          <svg
            v-if="loading"
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-opacity="0.25"
              stroke-width="4"
            ></circle>
            <path
              d="M22 12a10 10 0 00-10-10"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
            ></path>
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <svg
        class="w-12 h-12 text-indigo-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>

    <div v-else>
      <div
        v-if="!(cancelledEvents && cancelledEvents.length)"
        class="text-center py-12 text-gray-500"
      >
        No cancelled events found.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(event, index) in cancelledEvents"
          :key="index"
          class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden flex flex-col"
        >
          <div class="relative h-44 bg-gray-100">
            <img
              v-if="event.image"
              :src="event.image"
              alt=""
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              No image
            </div>
            <span
              class="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >Cancelled</span
            >
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ event.title || "Untitled event" }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ formatDate(event.date || event.startDate) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ event.location }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-1">
              {{ (event.description || event.summary || "").slice(0, 140)
              }}<span v-if="(event.description || '').length > 140">...</span>
            </p>

            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Seats: {{ event.TicketQuantity }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { cancelledEvents, loading, loadCancelledEvents } =
  fetchCancelledEvents();

const formatDate = (val) => {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleString();
  } catch (e) {
    return String(val);
  }
};
</script>
