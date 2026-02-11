<template>
  <div class="flex flex-col space-y-6">
    <!-- Filter bar -->
    <div
      class="flex items-center justify-between bg-white shadow rounded-lg p-4"
    >
      <h2 class="text-lg font-semibold text-gray-700">Bookings Overview</h2>
      <input
        type="date"
        class="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        placeholder="Filter by date"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg shadow-lg bg-white">
      <table class="min-w-full text-left text-sm font-light">
        <thead class="bg-gradient-to-r from-purple-700 to-[#16c851] text-white">
          <tr>
            <th scope="col" class="px-6 py-4">Event</th>
            <th scope="col" class="px-6 py-4">Date</th>
            <th scope="col" class="px-6 py-4">Revenue</th>
            <th scope="col" class="px-6 py-4">Regular</th>
            <th scope="col" class="px-6 py-4">VIP</th>
            <th scope="col" class="px-6 py-4">VVIP</th>
            <th scope="col" class="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in eventsBooked"
            :key="event.eventName"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-medium capitalize">
              {{ event.eventName }}
            </td>
            <td class="px-6 py-4">-</td>
            <td class="px-6 py-4 text-green-600 font-semibold">
              KES {{ event.totalRevenue?.toLocaleString() || 0 }}
            </td>
            <td class="px-6 py-4 text-gray-700 font-semibold">
              {{ event.regular || 0 }}
            </td>
            <td class="px-6 py-4 text-gray-700 font-semibold">
              {{ event.vip || 0 }}
            </td>
            <td class="px-6 py-4 text-gray-700 font-semibold">
              {{ event.vvip || 0 }}
            </td>
            <td>
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
              >
                {{ event.status }}
              </span>
            </td>
          </tr>

          <!-- Loading / Empty states -->
          <tr v-if="loading">
            <td colspan="8" class="text-center py-6 text-gray-500">
              Loading events...
            </td>
          </tr>
          <tr v-if="!loading && eventsBooked.length === 0">
            <td colspan="8" class="text-center py-6 text-gray-500">
              No events found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { eventsBooked, loading } = eventsBooking();
</script>
