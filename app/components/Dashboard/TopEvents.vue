<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Top Booked Events</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Top 5 events by total bookings
        </p>
      </div>
      <span
        class="px-3 py-1 rounded-full bg-purple-50 text-[#9c4e8b] text-xs font-semibold"
      >
        Top 5
      </span>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="flex flex-col gap-2">
      <!-- skeleton header -->
      <div class="grid grid-cols-3 gap-4 pb-2 border-b border-gray-100">
        <div class="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
        <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
        <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
      </div>
      <!-- skeleton rows -->
      <div
        v-for="n in 5"
        :key="n"
        class="grid grid-cols-3 gap-4 py-3 border-b border-gray-50 animate-pulse"
      >
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0"></div>
          <div class="h-3 bg-gray-100 rounded w-28"></div>
        </div>
        <div class="h-3 bg-gray-100 rounded w-12"></div>
        <div class="h-3 bg-gray-100 rounded w-20"></div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
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
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button
        @click="aggregateBookings"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <Icon name="material-symbols:refresh" class="text-sm" />
        Retry
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="aggregatedEvents.length === 0"
      class="flex flex-col items-center justify-center py-12 gap-3 text-center border border-dashed border-gray-200 rounded-xl"
    >
      <div
        class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center"
      >
        <Icon
          name="material-symbols:confirmation-number"
          class="text-xl text-[#9c4e8b]"
        />
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-700">No booked events yet</p>
        <p class="text-xs text-gray-400 mt-0.5">
          Bookings will appear here once events are booked.
        </p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="flex flex-col">
      <!-- Table header -->
      <div class="grid grid-cols-3 gap-4 px-3 pb-2 border-b border-gray-100">
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >Event</span
        >
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >Bookings</span
        >
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >Revenue</span
        >
      </div>

      <!-- Rows -->
      <ul class="flex flex-col divide-y divide-gray-50">
        <li
          v-for="(event, index) in aggregatedEvents"
          :key="index"
          class="grid grid-cols-3 gap-4 items-center px-3 py-3 hover:bg-purple-50/30 transition-colors rounded-lg group"
        >
          <!-- Event name + rank -->
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="[
                index === 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : index === 1
                    ? 'bg-gray-100 text-gray-600'
                    : index === 2
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-purple-50 text-[#9c4e8b]',
              ]"
              >{{ index + 1 }}</span
            >
            <span class="text-sm font-medium text-gray-800 truncate capitalize">
              {{ event.name }}
            </span>
          </div>

          <!-- Bookings + mini bar -->
          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-gray-900">{{
              event.totalBookings.toLocaleString()
            }}</span>
            <div class="h-1.5 rounded-full bg-gray-100 overflow-hidden w-20">
              <div
                class="h-full rounded-full bg-[#9c4e8b] transition-all duration-500"
                :style="{
                  width: (event.totalBookings / maxBookings) * 100 + '%',
                }"
              ></div>
            </div>
          </div>

          <!-- Revenue -->
          <span class="text-sm font-semibold text-emerald-600">
            KES {{ Number(event.totalIncome || 0).toLocaleString() }}
          </span>
        </li>
      </ul>

      <!-- Footer totals -->
      <div
        class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 px-3"
      >
        <span class="text-xs text-gray-400 font-medium">Total</span>
        <span class="text-xs font-bold text-gray-900">
          {{
            aggregatedEvents
              .reduce((s, e) => s + e.totalBookings, 0)
              .toLocaleString()
          }}
        </span>
        <span class="text-xs font-bold text-emerald-600">
          KES
          {{
            aggregatedEvents
              .reduce((s, e) => s + (e.totalIncome || 0), 0)
              .toLocaleString()
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { loading, aggregatedEvents, error, aggregateBookings } = eventsBooking();

onMounted(() => aggregateBookings());

// For the mini progress bars
const maxBookings = computed(() =>
  Math.max(...(aggregatedEvents.value?.map((e) => e.totalBookings) || []), 1),
);
</script>
