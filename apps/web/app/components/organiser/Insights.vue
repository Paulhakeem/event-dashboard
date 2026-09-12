<template>
  <section class="space-y-6 pt-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Insights</h1>
      <p class="mt-1 text-gray-600">A summary of your event performance.</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Total events</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ events.length }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Successful bookings</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ bookings.length }}
        </p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Available tickets</p>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ availableTickets }}
        </p>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 class="font-semibold text-gray-900">Bookings by event</h2>
      <ul v-if="Object.keys(eventCounts).length" class="mt-4 divide-y">
        <li
          v-for="(count, eventName) in eventCounts"
          :key="eventName"
          class="flex justify-between gap-4 py-3 text-sm"
        >
          <span class="truncate text-gray-700">{{ eventName }}</span>
          <span class="font-semibold text-gray-900">{{ count }}</span>
        </li>
      </ul>
      <p v-else class="mt-4 text-sm text-gray-500">
        No successful bookings yet.
      </p>
    </div>
  </section>
</template>

<script setup>
const { events } = organiserEvents();
const { bookings, eventCounts } = organiserRecentBookings();
const availableTickets = computed(() =>
  events.value.reduce(
    (total, event) => total + Number(event.TicketQuantity || 0),
    0,
  ),
);
</script>
