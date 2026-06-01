<template>
  <div
    class="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
        Activities
      </h2>

      <span
        class="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      >
        Ongoing Events
      </span>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div
        class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-purple-500"
      ></div>
      <p class="mt-4 text-sm text-gray-500">Loading ongoing events...</p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-12 px-6 bg-red-50 border border-red-200 rounded-xl text-center"
    >
      <div class="text-2xl">⚠️</div>

      <p class="mt-3 text-sm font-semibold text-red-700">
        Something went wrong
      </p>

      <p class="mt-1 text-xs text-red-600">
        {{ error }}
      </p>

      <button
        @click="getOngoingEvents"
        class="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="ongoingEvents.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        class="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xl"
      >
        🎭
      </div>

      <p class="mt-4 text-gray-700 font-medium">No ongoing events</p>

      <p class="text-sm text-gray-500">
        Your active events will appear here once they start.
      </p>
    </div>

    <!-- LIST -->
    <div v-else class="space-y-4">
      <div
        v-for="event in ongoingEvents"
        :key="event._id"
        class="group p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <!-- LEFT -->
          <div>
            <h3 class="text-md font-semibold text-gray-800 dark:text-white">
              {{ event.title }}
            </h3>

            <p class="text-xs text-gray-500 mt-1">
              {{ new Date(event.date).toLocaleString() }}
            </p>

            <p class="text-xs text-gray-500 mt-1">
              Tickets Left:
              <span class="font-medium text-gray-700 dark:text-gray-300">
                {{ event.TicketQuantity }}
              </span>
            </p>
          </div>

          <!-- STATUS -->
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(event.status)"
          >
            {{ event.status }}
          </span>
        </div>

        <!-- PROGRESS BAR (optional visual boost) -->
        <div
          class="mt-3 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-purple-500 rounded-full transition-all duration-500"
            :style="{ width: getProgress(event) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { events, loading, error } = organiserEvents();

const ongoingEvents = computed(() => {
  return events.value.filter(
    (event) => event.status === "ongoing" || event.status === "live",
  );
});

/**
 * Status styling
 */
const getStatusClass = (status) => {
  switch (status) {
    case "live":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "ongoing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * Fake progress (you can replace with real logic)
 */
const getProgress = (event) => {
  if (!event.capacity || !event.TicketQuantity) return 40;

  const sold = event.capacity - event.TicketQuantity;
  return Math.min(100, (sold / event.capacity) * 100);
};
</script>
