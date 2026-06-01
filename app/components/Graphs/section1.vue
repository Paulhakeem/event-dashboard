<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    <!-- Users -->
    <div
      class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div
        class="h-full rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-500"
            >
              Total Users
            </p>

            <h2 class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
              {{ users.length }}
            </h2>

            <div
              class="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
            >
              <Icon name="streamline:graph-arrow-increase" />
              +0.5%
            </div>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center"
          >
            <Icon
              name="solar:users-group-rounded-bold"
              class="text-3xl text-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Events -->
    <div
      class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div
        class="h-full rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-500"
            >
              Total Events
            </p>

            <h2 class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
              {{ events.length }}
            </h2>

            <p class="mt-3 text-sm text-gray-500">Active events</p>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center"
          >
            <Icon name="solar:calendar-bold" class="text-3xl text-purple-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bookings -->
    <div
      class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-500 p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div
        class="h-full rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-500"
            >
              Event Bookings
            </p>

            <h2 class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
              {{ loading ? "..." : eventsBooked.length }}
            </h2>

            <p class="mt-3 text-sm text-gray-500">Total reservations</p>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center"
          >
            <Icon name="solar:ticket-bold" class="text-3xl text-green-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Cancelled -->
    <div
      class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div
        class="h-full rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-500"
            >
              Cancelled
            </p>

            <h2 class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
              {{ cancelledEvents.length }}
            </h2>

            <p class="mt-3 text-sm text-red-500">Cancelled bookings</p>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center"
          >
            <Icon
              name="solar:close-circle-bold"
              class="text-3xl text-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { users } = totalUsers();
const { events } = totalEvents();
const { cancelledEvents } = fetchCancelledEvents();

// Booking composable
const { eventsBooked, loading, error, fetchBookedEvents } = eventsBooking();

// Load bookings when component mounts
onMounted(async () => {
  await fetchBookedEvents();

  if (error.value) {
    console.error("Booking Error:", error.value);
  }
});
</script>
