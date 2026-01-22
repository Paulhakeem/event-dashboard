<template>
  <div class="w-full flex items-center justify-center px-4 py-10">
    <div class="w-full lg:w-3/4">
      <!-- Flex container instead of grid -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Recent Activity Card -->
        <div
          class="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 min-h-[250px] justify-between"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-700 dark:text-white">
              Recent Activity
            </h2>
            <span
              class="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-r from-[#16c851] to-[#9d4e8a] text-white shadow-md"
            >
              <Icon name="mdi:history" class="text-2xl" />
            </span>
          </div>
          
          <!-- Body -->
          <div
            v-if="booking?.length > 0"
            class="text-center mt-6 flex-1 flex flex-col justify-center"
          >
            <Icon
              name="svg-spinners:clock"
              class="text-6xl text-gray-300 dark:text-gray-600 mx-auto"
            />
            <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              No activity yet
            </p>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">
              Your recent activities will appear here
            </p>
          </div>
          <UserRecentAct v-else/>
        </div>

        <!-- Upcoming Events Card -->
        <div
          class="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 min-h-[250px] flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-700 dark:text-white">
              Upcoming Events
            </h2>
            <span
              class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            >
              <Icon name="mdi:calendar" class="text-2xl" />
            </span>
          </div>
          <div class="text-center mt-6 flex-1 flex flex-col justify-center">
            <Icon
              name="mdi:calendar-clock"
              class="text-6xl text-gray-300 dark:text-gray-600 mx-auto"
            />
            <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              No upcoming events
            </p>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">
              Browse events and get your tickets now!
            </p>
            <!-- Footer (Optional CTA) -->
            <div class="mt-6 text-center">
              <button
                class="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm text-gray-800 bg-gray-100 hover:text-cyan-700 rounded-lg focus:outline-hidden focus:text-cyan-700 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              >
                <Icon name="mdi:arrow-right-circle" class="text-lg" />
                Explore events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
