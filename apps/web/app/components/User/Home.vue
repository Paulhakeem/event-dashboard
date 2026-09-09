<template>
  <div
    v-if="error || errorMessage"
    class="mx-4 mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
  >
    <span>Some dashboard data could not be loaded.</span>
    <button
      type="button"
      class="font-semibold underline"
      @click="Promise.all([fetchBookings(), fetchUpcomingEvents()])"
    >
      Retry
    </button>
  </div>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 py-6 md:py-8"
  >
    <!-- Tickets Purchased -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 dark:text-white"
        >
          Tickets Purchased
        </h2>
        <span
          class="flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:ticket" class="text-lg md:text-xl" />
        </span>
      </div>
      <p
        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        {{ paidBookings }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Total tickets bought
      </p>
    </div>

    <!-- Free Registrations -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 dark:text-white"
        >
          Free Registrations
        </h2>
        <span
          class="flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:calendar" class="text-lg md:text-xl" />
        </span>
      </div>
      <p
        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        {{ freeRegistrations }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Free event registrations
      </p>
    </div>

    <!-- Attended Events -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 dark:text-white"
        >
          Attended Events
        </h2>
        <span
          class="flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:account-check" class="text-lg md:text-xl" />
        </span>
      </div>
      <p
        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        {{ attendedEvents }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Events with a past date
      </p>
    </div>

    <!-- Total Spent -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 dark:text-white"
        >
          Total Spent
        </h2>
        <span
          class="flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:currency-usd" class="text-lg md:text-xl" />
        </span>
      </div>

      <p
        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
      >
        <span class="text-xs md:text-sm">ksh</span>
        {{ totalSpent.toLocaleString() }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Amount spent on tickets
      </p>
    </div>
  </div>
  <SpendingHistory />
  <UserDashboard />
</template>

<script setup>
const { booking, loading, error, fetchBookings } = useBookingData();
const { events, eventsLoading, errorMessage, fetchUpcomingEvents } =
  userUpcomingEvents();

const paidBookings = computed(
  () => booking.value.filter((item) => Number(item.amount || 0) > 0).length,
);
const freeRegistrations = computed(
  () => booking.value.filter((item) => Number(item.amount || 0) === 0).length,
);
const attendedEvents = computed(
  () =>
    booking.value.filter((item) => {
      const date = item.date || item.eventDate;
      return date && new Date(date) < new Date();
    }).length,
);
const totalSpent = computed(() => {
  return booking.value.reduce((total, b) => total + (b.amount || 0), 0);
});
</script>
