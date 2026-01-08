<template>
  <div class="flex flex-col">
    <!-- filter bookings by date -->

    <!-- end -->
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full text-left text-sm font-light">
            <thead
              class="border-b font-medium dark:border-neutral-500 bg-[#9c4e8b]"
            >
              <tr>
                <th scope="col" class="px-6 py-4 text-white">Event</th>
                <th scope="col" class="px-6 py-4 text-white">Date</th>
                <th scope="col" class="px-6 py-4 text-white">TotalRevenue</th>
                <th scope="col" class="px-6 py-4 text-white">Regular</th>
                <th scope="col" class="px-6 py-4 text-white">VIP</th>
                <th scope="col" class="px-6 py-4 text-white">VVIP</th>
                <th scope="col" class="px-6 py-4 text-white">Status</th>
                <th scope="col" class="px-6 py-4 text-white">Attend</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in eventsBooked"
                :key="event.id"
                class="border-b dark:border-neutral-500 hover:bg-gray-100"
              >
                <td
                  class="whitespace -nowrap px-6 py-4 font-medium first-letter:capitalize"
                >
                  {{ event.eventName }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ new Date(event.bookedAt).toLocaleDateString() }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 text-green-500 font-semibold"
                >
                  {{ event.stats.totalRevenue }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-green-500"
                >
                   {{ event.stats.regular }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-green-500"
                >
                   {{ event.stats.vip }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-green-500"
                >
                  {{ event.stats.vvip }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-green-500"
                >
                  {{ event.status }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-gray-500"
                >
                  {{  event.stats.totalUsers }}
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-4">Loading events...</td>
              </tr>
              <tr v-if="!loading && eventsBooked.length === 0">
                <td colspan="4" class="text-center py-4">No events found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {eventsBooked} = eventsBooking()
</script>
