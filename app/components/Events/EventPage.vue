<template>
  <!-- Team -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Grid -->
    <div
      class="flex flex-wrap justify-center items-center gap-12 md:gap-14 lg:gap-20"
    >
      <div
        v-for="event in eventPosters"
        :key="event"
        class="text-center w-full cursor-pointer sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        <NuxtLink :to="`/events/${event._id}`">
          <NuxtImg
            class="rounded-xl size:32 md:size-72 lg:size-72 mx-auto object-cover"
            :src="event.image"
            alt="Event Poster"
          />
          <div class="mt-2 sm:mt-4 text-start">
            <div class="flex gap-4 justify-between items-center mb-1 sm:mb-2">
              <p class="text-sm text-gray-500 first-letter:capitalized">
                📍 {{ event.location }}
              </p>
              <div class="text-xs text-gray-600">
                {{ new Date(event.date).toLocaleDateString() }}
              </div>
            </div>
            <h3
              class="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200 first-letter:capitalize"
            >
              {{ event.title }}
            </h3>
            <p
              class="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400"
            >
              {{ event.description }}
            </p>
            <button
              class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded cursor-pointer transition"
            >
              Buy Ticket - ksh{{ event.price }}
            </button>
          </div>
        </NuxtLink>
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
