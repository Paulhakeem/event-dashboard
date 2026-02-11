<template>
  <div class="flex flex-col space-y-6">
    <!-- Filter bar -->
    <div class="flex items-center justify-between bg-white shadow rounded-lg p-4">
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
            <th scope="col" class="px-6 py-4">Attend</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in eventsBooked"
            :key="event.id"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-medium capitalize">{{ event.eventName }}</td>
            <td class="px-6 py-4">{{ new Date(event.bookedAt).toLocaleDateString() }}</td>
            <td class="px-6 py-4 text-green-600 font-semibold">
              ${{ event.stats.totalRevenue.toLocaleString() }}
            </td>
            <td class="px-6 py-4 text-gray-700 font-semibold">{{ event.stats.regular }}</td>
            <td class="px-6 py-4 text-gray-700 font-semibold">{{ event.stats.vip }}</td>
            <td class="px-6 py-4 text-gray-700 font-semibold">{{ event.stats.vvip }}</td>
            <td>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  event.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ event.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 font-semibold">
              {{ event.stats.totalUsers }}
            </td>
          </tr>

          <!-- Loading / Empty states -->
          <tr v-if="loading">
            <td colspan="8" class="text-center py-6 text-gray-500">Loading events...</td>
          </tr>
          <tr v-if="!loading && eventsBooked.length === 0">
            <td colspan="8" class="text-center py-6 text-gray-500">No events found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>

const { eventsBooked, loading } = eventsBooking();
</script>