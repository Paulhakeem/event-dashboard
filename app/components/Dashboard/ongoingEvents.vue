<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Ongoing Events</h2>
        <p class="text-xs text-gray-400 mt-0.5">Events currently in progress</p>
      </div>
      <!-- live count badge -->
      <span
        v-if="!pendings && !errorMessage"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        :class="
          ongoingEvents.length > 0
            ? 'bg-green-50 text-green-700'
            : 'bg-gray-100 text-gray-500'
        "
      >
        <span
          v-if="ongoingEvents.length > 0"
          class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"
        ></span>
        {{ ongoingEvents.length }} Live
      </span>
    </div>

    <!-- Skeleton -->
    <div v-if="pendings" class="flex flex-col gap-3">
      <div
        v-for="n in 3"
        :key="n"
        class="rounded-xl border border-gray-100 p-4 animate-pulse flex gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="errorMessage"
      class="flex flex-col items-center justify-center py-10 gap-3 text-center bg-red-50 border border-red-100 rounded-xl"
    >
      <div
        class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
      >
        <Icon
          name="material-symbols:error-outline"
          class="text-lg text-red-500"
        />
      </div>
      <div>
        <p class="text-sm font-semibold text-red-700">Something went wrong</p>
        <p class="text-xs text-red-500 mt-0.5">{{ errorMessage }}</p>
      </div>
      <button
        @click="fetchEvents"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <Icon name="material-symbols:refresh" class="text-sm" />
        Retry
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="ongoingEvents.length === 0"
      class="flex flex-col items-center justify-center py-12 gap-3 text-center border border-dashed border-gray-200 rounded-xl"
    >
      <div
        class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center"
      >
        <Icon name="material-symbols:event" class="text-xl text-[#9c4e8b]" />
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-700">No ongoing events</p>
        <p class="text-xs text-gray-400 mt-0.5">
          Active events will appear here once they start.
        </p>
      </div>
    </div>

    <!-- Event list -->
    <ul v-else class="flex flex-col gap-3">
      <li
        v-for="event in ongoingEvents"
        :key="event._id"
        class="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#9c4e8b]/30 hover:bg-purple-50/30 transition-all duration-200"
      >
        <!-- Icon block -->
        <div
          class="w-11 h-11 rounded-xl bg-[#9c4e8b]/10 flex items-center justify-center flex-shrink-0"
        >
          <Icon name="material-symbols:event" class="text-lg text-[#9c4e8b]" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-900 capitalize truncate">
              {{ event.title }}
            </h3>
            <!-- live pill -->
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold flex-shrink-0"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"
              ></span>
              Live
            </span>
          </div>

          <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Icon
                name="material-symbols:calendar-today"
                class="text-[#9c4e8b] text-xs"
              />
              {{
                new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            </span>
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Icon
                name="material-symbols:confirmation-number"
                class="text-[#9c4e8b] text-xs"
              />
              {{ event.ticketsRemaining ?? event.TicketQuantity ?? 0 }} tickets
              left
            </span>
            <span
              v-if="event.location"
              class="flex items-center gap-1 text-xs text-gray-400"
            >
              <Icon
                name="material-symbols:location-on"
                class="text-[#9c4e8b] text-xs"
              />
              <span class="truncate max-w-[120px]">{{ event.location }}</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { eventPosters, errorMessage, pendings, fetchEvents } = EventFunctions();

onMounted(() => fetchEvents());

const ongoingEvents = computed(() =>
  eventPosters.value.filter((event) => event.status === "ongoing"),
);
</script>
