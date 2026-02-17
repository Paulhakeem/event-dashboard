<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Total Events</h2>
        <p class="text-gray-600 mt-1">View and manage your created events here.</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-600">Total Events</p>
        <p class="text-3xl font-bold text-[#9c4e8b]">{{ events.length }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c4e8b]"></div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
      <p class="font-semibold">Error</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && events.length === 0 && !error" class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 text-lg">No events created yet</p>
      <p class="text-gray-400 text-sm">Start by creating your first event</p>
    </div>

    <!-- Events Table -->
    <div v-if="events.length > 0" class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Title</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Tickets</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Regular</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">VIP</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">VVIP</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="event in events" :key="event._id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900 line-clamp-1">{{ event.title }}</p>
                <p class="text-xs text-gray-500 line-clamp-1">{{ event.description }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ event.location }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(event.date) }}</td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {{ event.TicketQuantity }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-sm font-medium text-gray-900">KES {{ (event.regular || 0).toLocaleString() }}</td>
              <td class="px-6 py-4 text-center text-sm font-medium text-gray-900">KES {{ (event.vip || 0).toLocaleString() }}</td>
              <td class="px-6 py-4 text-center text-sm font-medium text-gray-900">KES {{ (event.vvip || 0).toLocaleString() }}</td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="{
                    'bg-green-50 text-green-700': event.status === 'upcoming',
                    'bg-blue-50 text-blue-700': event.status === 'ongoing',
                    'bg-gray-50 text-gray-700': event.status === 'completed',
                    'bg-red-50 text-red-700': event.status === 'cancelled',
                    'bg-yellow-50 text-yellow-700': event.status === 'pending',
                  }"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {{ event.status || 'upcoming' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <button class="px-3 py-1 bg-[#9c4e8b] text-white text-xs font-medium rounded hover:bg-[#7a3968] transition">
                    Edit
                  </button>
                  <button class="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { events, loading, error, formatDate } = organiserEvents()
</script>