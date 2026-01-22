<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:px-6 md:px-8 py-8"
  >
    <!-- Tickets Purchased -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          Tickets Purchased
        </h2>
        <span
          class="flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full size-8"
        >
          <Icon name="mdi:ticket" class="text-xl" />
        </span>
      </div>
      <p class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Total tickets bought
      </p>
    </div>

    <!-- Upcoming Events -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          Upcoming Events
        </h2>
        <span
          class="flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full size-8"
        >
          <Icon name="mdi:calendar" class="text-xl" />
        </span>
      </div>
      <p class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Events you plan to attend
      </p>
    </div>

    <!-- Attended Events -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          Attended Events
        </h2>
        <span
          class="flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full size-8"
        >
          <Icon name="mdi:account-check" class="text-xl" />
        </span>
      </div>
      <p class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {{booking.length}}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Events you’ve joined
      </p>
    </div>

    <!-- Total Spent -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow hover:shadow-lg transition"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          Total Spent
        </h2>
        <span
          class="flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full size-8"
        >
          <Icon name="mdi:currency-usd" class="text-lg" />
        </span>
      </div>

      <p class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">$0</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Amount spent on tickets
      </p>
    </div>
  </div>
  <UserDashboard />
</template>

<script setup>
const {booking}=useBookingData()
const {totalSpent} = useTotalSpent()
</script>
