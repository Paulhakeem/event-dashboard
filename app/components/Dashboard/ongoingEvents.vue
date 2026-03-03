<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Ongoing Events</h2>
    <!-- LOADING -->
    <div
      v-if="pendings"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <div
        class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#9c4e8b]"
      ></div>
      <p class="mt-4 text-sm font-medium text-gray-600">
        Loading ongoing events...
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="errorMessage"
      class="flex flex-col items-center justify-center py-12 px-6 bg-red-50 border border-red-200 rounded-xl shadow-sm text-center"
    >
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg"
      >
        ⚠️
      </div>
      <p class="mt-4 text-sm font-semibold text-red-700">
        Something went wrong
      </p>
      <p class="mt-1 text-xs text-red-600">
        {{ errorMessage }}
      </p>

      <button
        @click="ongoingEvents"
        class="mt-4 px-4 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="ongoingEvents.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm text-center"
    >
      <div
        class="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xl"
      >
        🎭
      </div>
      <p class="mt-4 text-gray-700 font-medium">No ongoing events</p>
      <p class="text-sm text-gray-500">
        Your active events will appear here once they start.
      </p>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="event in eventPosters"
        :key="event._id"
        class="border p-4 rounded"
      >
        <h3 class="text-md font-medium">{{ event.name }}</h3>
        <p class="text-sm text-gray-600">
          {{ new Date(event.date).toLocaleString() }}
        </p>
        <p class="text-sm text-gray-600">
          Tickets Left: {{ event.TicketQuantity }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script setup>
const {eventPosters, errorMessage, pendings} = EventFunctions();

// get events with ongoing status
const ongoingEvents = computed(() => {
  return eventPosters.value.filter((event) => event.status === "ongoing");
});
</script>
