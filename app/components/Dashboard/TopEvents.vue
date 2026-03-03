<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Top Events Booked Events</h2>
    <table class="w-full text-sm text-left">
      <thead>
        <tr class="text-gray-500 border-b">
          <th>Event Name</th>
          <th>Total Booking</th>
          <th>Total Income (Ksh)</th>
        </tr>
      </thead>
      <tbody>
        <!-- LOADING STATE -->
        <tr v-if="loading">
          <td colspan="3" class="px-6 py-12">
            <div
              class="flex flex-col items-center justify-center text-gray-500"
            >
              <div
                class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#9c4e8b]"
              ></div>
              <p class="mt-3 text-sm font-medium">Loading booked events...</p>
            </div>
          </td>
        </tr>

        <!-- if length is 0 -->
        <tr v-else-if="eventsBooked.length === 0">
          <td colspan="3" class="px-6 py-10">
            <div
              class="flex flex-col items-center justify-center text-gray-500"
            >
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
              >
                📋
              </div>
              <p class="mt-3 text-sm font-medium">No booked events found</p>
            </div>
          </td>
        </tr>

        <!-- ERROR STATE -->
        <tr v-else-if="error">
          <td colspan="3" class="px-6 py-10">
            <div
              class="flex flex-col items-center justify-center rounded-lg bg-red-50 border border-red-200 p-6"
            >
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg"
              >
                ⚠️
              </div>

              <p class="mt-3 text-sm font-semibold text-red-700">
                Something went wrong
              </p>
              <p class="text-xs text-red-600 mt-1 text-center">
                {{ error }}
              </p>

              <button
                @click="aggregateBookings()"
                class="mt-4 px-4 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition"
              >
                Retry
              </button>
            </div>
          </td>
        </tr>

        <!-- booked events data -->
        <tr
          v-else
          v-for="(event, index) in eventsBooked"
          :key="index"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-2">{{ event.name }}</td>
          <td class="py-2">{{ event.totalBookings }}</td>
          <td class="py-2">{{ event.totalIncome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// get top 5 booked events
const { loading, eventsBooked, error, aggregateBookings } = eventsBooking();

onMounted(() => {
  aggregateBookings();
});
</script>
