<template>
  <!-- Pending Events Section -->
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">⏳ Pending Events</h2>

    <div
      v-if="pendingEvents.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="event in pendingEvents"
        :key="event._id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition p-5 border-l-4 border-[#9d4e8a]"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-bold text-gray-900 flex-1">
            {{ event.title }}
          </h3>
          <span
            class="inline-block bg-[#ad90a7] text-gray-200 text-xs font-semibold px-3 py-1 rounded-full"
          >
            Pending Review
          </span>
        </div>

        <p class="text-sm text-gray-600 mb-3">
          {{ event.description?.substring(0, 80) || "No description" }}...
        </p>

        <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Icon name="mdi:calendar" />
          {{ event.date ? new Date(event.date).toLocaleDateString() : "N/A" }}
        </div>

        <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Icon name="mdi:map-marker" />
          {{ event.location || "Unknown location" }}
        </div>

        <div class="flex gap-2">
          <button
            :disabled="loading"
            @click="confirmApprove(event._id)"
            class="flex-1 bg-green-500 text-white text-xs font-semibold py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            ✓ Approve
          </button>

          <button
            :disabled="loading"
            @click="rejectEvent(event._id)"
            class="flex-1 bg-red-500 text-white text-xs font-semibold py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            ✗ Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center border-2 border-dashed border-blue-200"
    >
      <Icon
        name="mdi:inbox-empty"
        class="text-5xl text-blue-300 mb-3 mx-auto"
      />
      <p class="text-gray-600 font-semibold">No pending events yet</p>
      <p class="text-sm text-gray-500">
        All events have been reviewed or are already live.
      </p>
    </div>
  </div>
</template>

<script setup>
const { pendingEvents, approveEvent, rejectEvent, loading } = usePendingEvent();

const confirmApprove = (id) => {
  if (confirm("Approve this event and make it live?")) {
    approveEvent(id);
  }
};
</script>
