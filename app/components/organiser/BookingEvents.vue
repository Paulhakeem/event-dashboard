<template>
  <div
    class="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
  >
    <div class="flex items-center justify-between px-6 py-4 bg-white">
      <div>
        <h3 class="text-xl font-semibold text-gray-900">Recent Bookings</h3>
        <p class="text-sm text-gray-500 mt-0.5">Overview of booked tickets</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="getBookings"
          class="px-3 py-1.5 text-sm font-medium rounded-md bg-[#9c4e8b] text-white hover:bg-[#7a3968] transition"
        >
          Refresh
        </button>
      </div>
    </div>

    <div class="divide-y">
      <div v-if="loadingBookings" class="p-6 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9c4e8b]"
        ></div>
        <p class="ml-4 text-sm text-gray-500">Loading bookings...</p>
      </div>

      <div v-else-if="errorBookings" class="p-6">
        <div class="rounded-md bg-red-50 border border-red-200 p-4">
          <p class="font-semibold text-red-700">Something went wrong</p>
          <p class="text-sm text-red-600 mt-1">{{ errorBookings }}</p>
        </div>
      </div>

      <div
        v-else-if="bookings.length === 0"
        class="p-8 text-center text-gray-500"
      >
        <div class="text-3xl">🎟️</div>
        <p class="mt-4 font-medium text-gray-700">No bookings yet</p>
        <p class="text-sm text-gray-500">
          Bookings will appear here once users reserve tickets
        </p>
      </div>

      <ul v-else class="max-h-96 overflow-y-auto">
        <li
          v-for="b in bookings"
          :key="b._id"
          class="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
        >
          <div class="flex gap-4 items-center text-center">
            <div class="flex-shrink-0 mt-1">
              <div
                class="h-10 w-10 rounded-md bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 font-semibold"
              >
                E
              </div>
            </div>
            <div>
              <p class="font-medium text-gray-900 truncate max-w-md">
                {{ b.eventName }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-sm text-gray-600">
              {{ formatDate(b.bookedAt) }}
            </div>
            <div>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
              >
                {{
                  eventCounts[b.eventName] ?? b.ticketsBooked ?? b.quantity ?? 1
                }}
              </span>
            </div>
            <button
              class="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              View
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { bookings, loadingBookings, errorBookings, formatDate, eventCounts } =
  organiserRecentBookings();
</script>
