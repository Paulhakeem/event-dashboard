<template>
  <div
    class="p-4 md:p-5 min-h-40 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Event popularity</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-500">Top events by bookings (percentage of total bookings)</p>
      </div>
      <div class="text-sm text-gray-600 dark:text-neutral-400">Top 5</div>
    </div>

    <!-- chart graph -->
    <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
      <!-- Pie chart (CSS conic) -->
      <div class="flex-shrink-0">
        <div
          role="img"
          :aria-label="`Top events pie chart`"
          class="relative w-44 h-44 md:w-56 md:h-56 rounded-full shadow-inner"
          :style="pieStyle"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-neutral-300">Bookings</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalBookings }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- List of top events -->
      <div class="flex-1 w-full">
        <ul class="space-y-3">
          <li v-if="loading" class="text-sm text-gray-500">Loading…</li>
          <li v-else-if="!topEvents.length" class="text-sm text-gray-500">No bookings yet</li>
          <li v-else v-for="(e, idx) in topEvents" :key="e.eventName" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span :style="{background: colors[idx % colors.length]}" class="inline-block w-3 h-3 rounded-full"></span>
              <div>
                <div class="font-medium text-gray-800 dark:text-neutral-100">{{ e.eventName }}</div>
                <div class="text-xs text-gray-500">{{ e.totalBookings }} bookings</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm text-gray-600 dark:text-neutral-300">{{ e.percentage.toFixed(1) }}%</div>
              <div class="w-32 bg-gray-100 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div :style="{ width: e.percentage + '%', background: colors[idx % colors.length] }" class="h-full"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const loading = ref(true);
const stats = ref([]);

// colors for bars / pie segments
const colors = ['#9d4e8a', '#3a83f6', '#16c851', '#f59e0b', '#ef4444'];

// fetch booking stats from server
const { data, pending, error } = await useFetch('/api/events/bookedEvents');
loading.value = pending.value;
if (data.value && data.value.events) {
  // `events` is a deduplicated summary per event from the server
  const arr = data.value.events.map((s) => {
    const totalBookings = (s.regular || 0) + (s.vip || 0) + (s.vvip || 0);
    return { eventName: s.eventName, totalBookings };
  });

  const grandTotal = arr.reduce((s, it) => s + it.totalBookings, 0);
  stats.value = arr
    .sort((a, b) => b.totalBookings - a.totalBookings)
    .slice(0, 5)
    .map((it) => ({ ...it, percentage: grandTotal ? (it.totalBookings / grandTotal) * 100 : 0 }));
}
loading.value = false;

const topEvents = computed(() => stats.value);
const totalBookings = computed(() => stats.value.reduce((s, it) => s + it.totalBookings, 0));

// pie CSS: build conic-gradient from top three percentages
const pieStyle = computed(() => {
  const percents = stats.value.slice(0, 3).map((s) => Math.max(0, Math.min(100, s.percentage || 0)));
  const stops = [];
  let acc = 0;
  for (let i = 0; i < 3; i++) {
    const pct = percents[i] || 0;
    const start = acc;
    const end = acc + pct;
    stops.push(`${colors[i] || '#ddd'} ${start}% ${end}%`);
    acc = end;
  }
  // remainder
  if (acc < 100) stops.push(`#e6e6e6 ${acc}% 100%`);

  return { background: `conic-gradient(${stops.join(',')})` };
});
</script>
