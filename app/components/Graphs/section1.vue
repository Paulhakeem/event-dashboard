<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Total users
          </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            {{ users.length }}
          </h3>
          <span class="flex items-center gap-x-1 text-green-600">
            <Icon name="streamline:graph-arrow-increase" />
            <span class="inline-block text-sm"> 0.5% </span>
          </span>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Total Events
          </p>
          <span class="flex items-center gap-x-1 text-gray-600">
            <Icon name="pixel:calender-solid" />
          </span>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            {{ events.length }}
          </h3>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Event Booking
          </p>
          <span class="flex items-center gap-x-1 text-gray-600">
            <Icon name="pixel:calender-solid" />
          </span>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            {{ eventsBooked.length }}
          </h3>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Cancelled Bookings
          </p>
          <span class="flex items-center gap-x-1 text-red-600">
            <Icon name="vaadin:close" />
          </span>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            0
          </h3>
        </div>
      </div>
    </div>
    <!-- End Card -->
  </div>
</template>

<script setup>
const { users } = totalUsers();
const { events } = totalEvents();
const { eventsBooked } = eventsBooking();
</script>
