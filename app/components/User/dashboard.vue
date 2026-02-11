<template>
  <div class="w-full flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 md:py-10">
    <div class="w-full lg:w-11/12 xl:w-4/5">
      <!-- Flex container instead of grid -->
      <div class="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
        <!-- Recent Activity Card -->
        <div
          class="flex-1 bg-white dark:bg-neutral-800 rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-200 min-h-[250px] md:min-h-[350px] flex flex-col justify-between"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h2 class="text-base md:text-xl font-semibold text-gray-700 dark:text-white">
              Recent Activity
            </h2>
            <span
              class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-[#16c851] to-[#9d4e8a] text-white shadow-md"
            >
              <Icon name="mdi:history" class="text-lg md:text-2xl" />
            </span>
          </div>

          <!-- Loading state -->
          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-8 md:py-10 space-y-3"
          >
            <!-- Spinner -->
            <Icon
              name="svg-spinners:90-ring-with-bg"
              class="text-xl md:text-2xl text-indigo-500 animate-spin"
            />
            <!-- Text -->
            <p class="text-gray-600 text-base md:text-lg font-medium">
              Loading your data...
            </p>
          </div>

          <div
            v-else-if="booking?.length === 0"
            class="text-center mt-4 md:mt-6 flex-1 flex flex-col justify-center"
          >
            <Icon
              name="svg-spinners:clock"
              class="text-4xl md:text-6xl text-gray-300 dark:text-gray-600 mx-auto"
            />
            <p class="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
              No activity yet
            </p>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
              Your recent activities will appear here
            </p>
          </div>

          <UserRecentAct v-else />
        </div>

        <!-- Upcoming Events Card -->
        <div
          class="flex-1 bg-white dark:bg-neutral-800 rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-200 min-h-[250px] md:min-h-[350px] flex flex-col justify-between"
        >
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h2 class="text-base md:text-xl font-semibold text-gray-700 dark:text-white">
              Upcoming Events
            </h2>
            <span
              class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            >
              <Icon name="mdi:calendar" class="text-lg md:text-2xl" />
            </span>
          </div>
          <div class="text-center mt-4 md:mt-6 flex-1 flex flex-col justify-center">
            <!-- Loading state -->
            <div
              v-if="eventsLoading"
              class="flex flex-col items-center justify-center py-8 md:py-10 space-y-3"
            >
              <Icon
                name="svg-spinners:90-ring-with-bg"
                class="w-10 h-10 md:w-12 md:h-12 text-indigo-500 animate-spin"
              />
              <p class="text-gray-600 text-base md:text-lg font-medium">
                Loading your events...
              </p>
            </div>

            <!-- Empty state -->
            <div
              v-else-if="events?.length === 0"
              class="text-center flex-1 flex flex-col justify-center"
            >
              <Icon
                name="mdi:calendar-clock"
                class="text-4xl md:text-6xl text-gray-300 dark:text-gray-600 mx-auto"
              />
              <p class="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                No upcoming events
              </p>
              <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
                Browse events and get your tickets now!
              </p>
              <NuxtLink to="/eventPage" class="mt-4 md:mt-6 text-center">
                <button
                  class="py-2 px-3 md:py-2.5 md:px-4 inline-flex items-center gap-x-2 text-sm font-medium text-gray-800 bg-gray-100 hover:text-cyan-700 rounded-lg focus:outline-hidden focus:text-cyan-700 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 cursor-pointer transition-all duration-200"
                >
                  <Icon name="mdi:arrow-right-circle" class="text-lg" />
                  Explore events
                </button>
              </NuxtLink>
            </div>

            <!-- Events list -->
            <UserEvents v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { booking, loading } = useBookingData();
const { events, eventsLoading } = userUpcomingEvents();
</script>
