<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 py-6 md:py-8"
  >
    <!-- Tickets Purchased -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
          Tickets Purchased
        </h2>
        <span
          class="flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:ticket" class="text-lg md:text-xl" />
        </span>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ booking?.length }}</p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Total tickets bought
      </p>
    </div>

    <!-- Free Registrations -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
          Free Registrations
        </h2>
        <span
          class="flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:calendar" class="text-lg md:text-xl" />
        </span>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        No registrations
      </p>
    </div>

    <!-- Attended Events -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
          Attended Events
        </h2>
        <span
          class="flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:account-check" class="text-lg md:text-xl" />
        </span>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ booking?.length }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Events you've joined
      </p>
    </div>

    <!-- Total Spent -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
          Total Spent
        </h2>
        <span
          class="flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full size-8 md:size-10"
        >
          <Icon name="mdi:currency-usd" class="text-lg md:text-xl" />
        </span>
      </div>

      <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        <span class="text-xs md:text-sm">ksh</span>
        {{ totalSpent }}
      </p>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        Amount spent on tickets
      </p>
    </div>
  </div>
  <UserDashboard />
</template>

<script setup>
const { booking } = useBookingData();
const totalSpent = computed(() => {
  return booking.value.reduce((total, b) => total + (b.amount || 0), 0);
});
</script>
