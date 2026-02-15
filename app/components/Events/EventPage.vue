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

      <!-- Events Grid -->
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
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div
                class="text-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <p class="text-xs font-semibold text-[#9c4e8b]">Regular</p>
                <p class="text-sm font-bold text-gray-900">
                  Ksh {{ event.regular }}
                </p>
              </div>
              <div
                class="text-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <p class="text-xs font-semibold text-[#9c4e8b]">VIP</p>
                <p class="text-sm font-bold text-gray-900">
                  Ksh {{ event.vip }}
                </p>
              </div>
              <div
                class="text-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <p class="text-xs font-semibold text-[#9c4e8b]">VVIP</p>
                <p class="text-sm font-bold text-gray-900">
                  Ksh {{ event.vvip }}
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
                :disabled="event.status === 'cancelled'"
                class="w-full bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {{
                  event.status === "cancelled"
                    ? "Event Cancelled"
                    : "View & Book"
                }}
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEventPosters.length === 0" class="text-center py-12">
        <p class="text-2xl text-gray-600">No events available at the moment</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const { eventPosters } = EventFunctions();

// Computed property to filter out pending events
const filteredEventPosters = computed(() => {
  return eventPosters.value.filter((event) => event.status !== "pending");
});
</script>
