<template>
  <!-- Team -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Grid -->
    <div
      class="flex flex-wrap justify-center items-center gap-12 md:gap-14 lg:gap-20"
    >
      <div v-for="(event, idx) in eventPosters" :key="idx" class="text-center">
        <img
          class="rounded-xl size:44 md:size-48 lg:size-80 mx-auto"
          :src="event.url"
          alt="Avatar"
        />
        <div class="mt-2 sm:mt-4 text-start">
          <div class="flex gap-4 items-center mb-1 sm:mb-2">
            <h3
              class="text-sm font-normal text-[#9c4e8b] sm:text-base lg:text-lg dark:text-neutral-200"
            >
              {{ event.about }}
            </h3>
            <div
              class="text-xs text-gray-600 sm:text-base lg:text-lg dark:text-neutral-400"
            >
              {{ event.date }}
            </div>
          </div>
          <h3
            class="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200"
          >
            {{ event.title }}
          </h3>
          <p
            class="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400"
          >
            {{ event.descrip }}
          </p>
          <button
            class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded cursor-pointer transition"
          >
            Buy Ticket - ksh{{ event.Price }}
          </button>
        </div>
      </div>
      <!-- End Col -->
    </div>
    <!-- End Grid -->
  </div>
  <!-- End Team -->
</template>
<script setup>
const { eventPosters } = EventFunctions();
</script>
