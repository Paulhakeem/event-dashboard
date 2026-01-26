<template>
  <div class="bg-white w-full p-6 rounded-lg shadow">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-10 space-y-3"
    >
      <!-- Spinner -->
      <Icon
        name="svg-spinners:90-ring-with-bg"
        class="text-2xl text-indigo-500 animate-spin"
      />
      <!-- Text -->
      <p class="text-gray-600 text-lg font-medium">Loading your data...</p>
    </div>
    <!-- error  -->
    <div v-else>
      <div v-if="events.length === 0" class="text-center text-gray-500">
        No upcoming events.
      </div>

      <!-- Flex grid of event cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in events"
          :key="event.id"
          class="flex flex-col border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <!-- Event header -->
          <h3 class="font-semibold text-lg text-gray-800 mb-2">
            {{ event.title }}
          </h3>

          <!-- Event details -->
          <div class="flex flex-col space-y-1 text-sm text-gray-600">
            <span class="flex items-center">
              <Icon name="mdi:calendar" class="mr-2 text-indigo-500" />
              {{ new Date(event.date).toLocaleDateString() }}
            </span>
            <span class="flex items-center">
              <Icon name="mdi:map-marker" class="mr-2 text-red-500" />
              {{ event.location }}
            </span>
          </div>

          <!-- Description -->
          <p class="mt-3 text-gray-700 text-sm line-clamp-3">
            {{ event.description }}
          </p>

          <!-- Action button -->
          <NuxtLink :to="`/events/${event._id}`">
            <button
              class="mt-4 self-start px-4 py-2 bg-[#9d4e8a] text-white text-sm rounded cursor-pointer transition"
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
</script>
