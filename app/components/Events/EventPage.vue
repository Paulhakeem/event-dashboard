<template>
  <!-- Events Section -->
  <div
    class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-3">Featured Events</h2>
        <p class="text-gray-600 text-lg">
          Explore amazing events and book your tickets
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="pendings"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div
          class="w-12 h-12 border-4 border-[#9c4e8b] border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-500 text-lg">Loading events...</p>
      </div>

      <!-- Events Grid -->
      <template v-else-if="filteredEventPosters.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="event in filteredEventPosters"
            :key="event._id"
            class="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 bg-white"
          >
            <!-- Image Container -->
            <div class="relative h-64 overflow-hidden">
              <NuxtImg
                class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                :src="event.image"
                alt="Event Poster"
              />

              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span
                  :class="{
                    'bg-green-500': event.status === 'upcoming',
                    'bg-blue-500': event.status === 'ongoing',
                    'bg-gray-500': event.status === 'completed',
                    'bg-red-500': event.status === 'cancelled',
                  }"
                  class="px-3 py-1 rounded-full text-white text-xs font-semibold capitalize shadow-md"
                >
                  {{ event.status || "upcoming" }}
                </span>
              </div>

              <!-- Event Type Badge -->
              <div class="absolute top-4 left-4">
                <span
                  class="bg-[#9c4e8b]/90 px-3 py-1 rounded-full text-white text-xs font-semibold backdrop-blur-sm"
                >
                  {{ event.eventType || "Event" }}
                </span>
              </div>

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
              ></div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Title -->
              <h3
                class="text-xl font-bold text-gray-900 group-hover:text-[#9c4e8b] transition mb-2 line-clamp-2"
              >
                {{ event.title }}
              </h3>

              <!-- Location and Date -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-gray-600 text-sm">
                  <span class="mr-2">📍</span>
                  <p class="truncate">{{ event.location }}</p>
                </div>
                <div class="flex items-center text-gray-600 text-sm">
                  <span class="mr-2">📅</span>
                  <p>
                    {{
                      new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <p class="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                {{ event.description }}
              </p>

              <!-- Tickets Info -->
              <div
                v-if="event.customTickets?.length"
                class="grid grid-cols-3 gap-2 mb-4"
              >
                <div
                  v-for="(ticket, i) in event.customTickets"
                  :key="ticket.name + i"
                  class="text-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200 cursor-pointer"
                >
                  <p class="text-xs font-semibold text-[#9c4e8b]">
                    {{ ticket.name }}
                  </p>
                  <p class="text-sm font-bold text-gray-900">
                    Ksh {{ ticket.price }}
                  </p>
                </div>
              </div>

              <!-- Tickets Available -->
              <div
                class="flex items-center justify-between text-xs text-gray-600 mb-4"
              >
                <span>🎟️ {{ event.TicketQuantity || 0 }} tickets available</span>
              </div>

              <!-- CTA Button -->
              <NuxtLink :to="`/events/${event._id}`">
                <button
                  :disabled="
                    event.status === 'cancelled' ||
                    event.status === 'completed' ||
                    event.status === 'live'
                  "
                  class="w-full bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {{
                    event.status === "cancelled"
                      ? "Event Cancelled"
                      : event.status === "completed"
                        ? "Event Completed"
                        : event.status === "live"
                          ? "Event Live"
                          : "View & Book"
                  }}
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!pendings">
        <div
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6"
          >
            <svg
              class="w-10 h-10 text-[#9c4e8b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            No Events Yet
          </h3>
          <p class="text-gray-500 text-lg max-w-md">
            There are no events available at the moment. Check back later for new
            and exciting events.
          </p>
          <div
            v-if="errorMessage"
            class="mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {{ errorMessage }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
const { eventPosters, pendings, errorMessage } = EventFunctions();

// Computed property to filter out pending events
const filteredEventPosters = computed(() => {
  return eventPosters.value.filter((event) => event.status !== "pending");
});
</script>
