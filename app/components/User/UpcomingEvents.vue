<template>
  <div
    class="bg-white dark:bg-neutral-900 w-full p-4 sm:p-6 rounded-3xl shadow-md border border-gray-100 dark:border-neutral-800 transition-all duration-200"
  >
    <!-- Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white"
      >
        Upcoming Events
      </h2>

      <Icon name="mdi:calendar-month" class="text-2xl text-indigo-500" />
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-12 space-y-4"
    >
      <Icon
        name="svg-spinners:90-ring-with-bg"
        class="text-3xl text-indigo-500 animate-spin"
      />
      <p class="text-gray-600 dark:text-neutral-400 text-lg font-medium">
        Loading events...
      </p>
    </div>

    <!-- Empty -->
    <div
      v-else-if="events.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <Icon
        name="mdi:calendar-remove"
        class="text-5xl text-gray-300 dark:text-neutral-600 mb-3"
      />
      <p class="text-lg font-semibold text-gray-800 dark:text-white">
        No upcoming events
      </p>
      <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
        Events will appear here once available
      </p>
    </div>

    <!-- Events Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
    >
      <div
        v-for="event in events"
        :key="event._id"
        class="group flex flex-col min-h-72 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-3xl p-4 sm:p-5 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
      >
        <!-- Title -->
        <h3
          class="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1"
        >
          {{ event.title }}
        </h3>

        <!-- Meta -->
        <div
          class="flex flex-col space-y-2 text-sm text-gray-500 dark:text-neutral-400"
        >
          <span class="flex items-center">
            <Icon name="mdi:calendar" class="mr-2 text-indigo-500" />
            {{ formatDate(event.date) }}
          </span>

          <span class="flex items-center">
            <Icon name="mdi:map-marker" class="mr-2 text-red-500" />
            {{ event.location }}
          </span>
        </div>

        <!-- Description -->
        <p
          class="mt-3 text-gray-600 dark:text-neutral-300 text-sm line-clamp-3"
        >
          {{ event.description }}
        </p>

        <div class="mt-auto pt-4">
          <NuxtLink :to="`/events/${event._id}`" class="block">
            <button
              class="w-full py-2.5 rounded-2xl bg-linear-to-r from-[#9d4e8a] to-[#6b46c1] text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
            >
              View Details
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { events, loading } = totalEvents();

// better date format
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>
