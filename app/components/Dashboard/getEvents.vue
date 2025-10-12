<template>
  <div class="flex flex-col">
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
                <th scope="col" class="px-6 py-4 text-white">Location</th>
                <th scope="col" class="px-6 py-4 text-white">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in events"
                :key="event.id"
                class="border-b dark:border-neutral-500 hover:bg-gray-100"
              >
                <td
                  class="whitespace -nowrap px-6 py-4 font-medium first-letter:capitalize"
                >
                  {{ event.title }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ new Date(event.date).toLocaleDateString() }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ event.location }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  ksh {{ event.price }}
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-4">Loading events...</td>
              </tr>
              <tr v-if="!loading && events.length === 0">
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
const { events, loading } = totalEvents();
</script>
