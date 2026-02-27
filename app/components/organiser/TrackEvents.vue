<template>
  <div class="flex flex-col gap-4 pt-10">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Total Events</h2>
        <p class="text-gray-600 mt-1">
          View and manage your created events here.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c4e8b]"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-if="error && !loading"
      class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
    >
      <p class="font-semibold">Error</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && events.length === 0 && !error"
      class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300"
    >
      <p class="text-gray-500 text-lg">No events created yet</p>
      <p class="text-gray-400 text-sm">Start by creating your first event</p>
    </div>

    <!-- Events Table -->
    <div
      v-if="events.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto max-h-112"
    >
      <!-- HEADER -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b bg-gray-50"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Your Events</h3>
          <p class="text-sm text-gray-500">
            Manage and track all created events
          </p>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto max-h-104">
        <table class="w-full text-sm">
          <thead class="sticky top-0 bg-white border-b z-10">
            <tr class="text-gray-600">
              <th class="px-6 py-3 text-left font-semibold">Event</th>
              <th class="px-6 py-3 text-left font-semibold">Location</th>
              <th class="px-6 py-3 text-left font-semibold">Date</th>
              <th class="px-6 py-3 text-center font-semibold">Tickets</th>
              <th class="px-6 py-3 text-center font-semibold">Status</th>
              <th class="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr
              v-for="event in events"
              :key="event._id"
              class="hover:bg-gray-50 transition"
            >
              <!-- EVENT -->
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900 truncate max-w-55">
                  {{ event.title }}
                </p>
              </td>

              <!-- LOCATION -->
              <td class="px-6 py-4 text-gray-600">📍 {{ event.location }}</td>

              <!-- DATE -->
              <td class="px-6 py-4 text-gray-600">
                {{ formatDate(event.date) }}
              </td>

              <!-- TICKETS -->
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex min-w-10.5 justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {{ event.TicketQuantity }}
                </span>
              </td>

              <!-- STATUS -->
              <td class="px-6 py-4 text-center">
                <span
                  :class="{
                    'bg-green-100 text-green-700': event.status === 'upcoming',
                    'bg-blue-100 text-blue-700': event.status === 'ongoing',
                    'bg-gray-100 text-gray-700': event.status === 'completed',
                    'bg-red-100 text-red-700': event.status === 'cancelled',
                    'bg-yellow-100 text-yellow-700': event.status === 'pending',
                  }"
                  class="inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize"
                >
                  {{ event.status || "upcoming" }}
                </span>
              </td>

              <!-- ACTIONS -->
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <button
                    class="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7a3968] transition"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- booked event list -->

    <OrganiserBookingEvents />
  </div>
</template>

<script setup>
const { events, loading, error, formatDate } = organiserEvents();
</script>
