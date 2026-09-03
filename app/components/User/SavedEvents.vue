<template>
  <section class="space-y-5">
    <div
      class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Events
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Keep the events you are considering close at hand.
        </p>
      </div>
      <NuxtLink
        to="/eventPage"
        class="inline-flex items-center gap-2 text-sm font-semibold text-[#9d4e8a] hover:underline"
      >
        <Icon name="mdi:compass-outline" /> Discover events
      </NuxtLink>
    </div>

    <div v-if="loading" class="py-12 text-center text-sm text-gray-500">
      Loading saved events...
    </div>
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <div
      v-else-if="favorites.length === 0"
      class="rounded-2xl border border-dashed border-gray-300 p-10 text-center"
    >
      <Icon
        name="mdi:heart-outline"
        class="mx-auto mb-3 text-4xl text-gray-300"
      />
      <p class="font-semibold text-gray-700">No saved events yet</p>
      <p class="mt-1 text-sm text-gray-500">
        Tap the heart on an event you want to revisit.
      </p>
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="event in favorites"
        :key="event._id"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      >
        <NuxtImg
          :src="event.image"
          :alt="event.title"
          class="h-40 w-full object-cover"
        />
        <div class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ event.title }}
            </h3>
            <button
              v-if="canFavorite"
              type="button"
              class="text-pink-600"
              aria-label="Remove saved event"
              @click="toggleFavorite(event._id)"
            >
              <Icon name="mdi:heart" />
            </button>
          </div>
          <p class="text-sm text-gray-500">
            {{ formatDate(event.date) }} · {{ event.location }}
          </p>
          <NuxtLink
            :to="`/events/${event._id}`"
            class="block rounded-xl bg-[#9d4e8a] px-4 py-2 text-center text-sm font-semibold text-white"
            >View event</NuxtLink
          >
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const { favorites, loading, error, toggleFavorite } = useFavorites();
const { user } = useAuth();
const canFavorite = computed(() => user.value?.role === "user");
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
</script>
