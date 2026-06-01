<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 backdrop-blur-xl shadow-xl p-6 h-5/6"
  >
    <!-- Decorative Background -->
    <div
      class="absolute top-0 right-0 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"
    ></div>

    <div
      class="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
    ></div>

    <!-- Header -->
    <div class="relative z-10 flex items-center justify-between mb-8">
      <div>
        <h2
          class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Event Popularity
        </h2>

        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Top performing events by bookings
        </p>
      </div>

      <span
        class="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold"
      >
        Top 5 Events
      </span>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="relative z-10 text-center py-8 text-red-500 font-medium"
    >
      {{ error }}
    </div>

    <!-- Content -->
    <div
      v-else
      class="relative z-10 flex flex-col lg:flex-row items-center gap-8"
    >
      <!-- Donut Chart -->
      <div class="flex-shrink-0">
        <div
          class="relative w-56 h-56 rounded-full shadow-lg transition-all duration-1000"
          :style="pieStyle"
        >
          <!-- Inner Circle -->
          <div
            class="absolute inset-[24px] bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-inner"
          >
            <div class="text-center">
              <div class="text-xs uppercase tracking-widest text-gray-500">
                Total
              </div>

              <div class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ totalBookings }}
              </div>

              <div class="text-sm text-purple-500 font-medium">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event List -->
      <div class="flex-1 w-full">
        <ul class="space-y-4">
          <!-- Loading -->
          <template v-if="loading">
            <li
              v-for="n in 5"
              :key="n"
              class="animate-pulse p-4 rounded-2xl bg-white/60 dark:bg-neutral-800/50"
            >
              <div class="h-4 bg-gray-200 rounded w-40 mb-3"></div>
              <div class="h-2 bg-gray-200 rounded"></div>
            </li>
          </template>

          <!-- Empty -->
          <li
            v-else-if="!topEvents.length"
            class="text-center text-gray-500 py-8"
          >
            No bookings available yet
          </li>

          <!-- Event Items -->
          <li
            v-else
            v-for="(e, idx) in topEvents"
            :key="e.eventName"
            class="group p-4 rounded-2xl bg-white/70 dark:bg-neutral-800/60 backdrop-blur hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex gap-3">
                <!-- Rank Badge -->
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                  :style="{ background: colors[idx % colors.length] }"
                >
                  #{{ idx + 1 }}
                </div>

                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white">
                    {{ e.eventName }}
                  </h3>

                  <p class="text-xs text-gray-500 dark:text-neutral-400">
                    {{ e.totalBookings }} bookings
                  </p>
                </div>
              </div>

              <!-- Percentage Pill -->
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow"
                :style="{ background: colors[idx % colors.length] }"
              >
                {{ e.percentage.toFixed(1) }}%
              </span>
            </div>

            <!-- Progress Bar -->
            <div
              class="mt-4 h-2.5 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-1000 ease-out"
                :style="{
                  width: e.percentage + '%',
                  background: colors[idx % colors.length],
                }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const error = ref("");
const stats = ref([]);

const colors = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B"];

try {
  const res = await $fetch("/api/events/bookedEvents");

  if (res?.success && res.events?.length) {
    const arr = res.events.map((event) => ({
      eventName: event.eventName,
      totalBookings: event.totalBookings || 0,
    }));

    const grandTotal = arr.reduce((sum, item) => sum + item.totalBookings, 0);

    stats.value = arr
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        percentage: grandTotal ? (item.totalBookings / grandTotal) * 100 : 0,
      }));
  } else {
    error.value = res?.message || "No booking statistics available.";
  }
} catch (err) {
  error.value =
    err?.data?.message || err?.message || "Failed to load booking statistics.";
} finally {
  loading.value = false;
}

const topEvents = computed(() => stats.value);

const totalBookings = computed(() =>
  stats.value.reduce((sum, item) => sum + item.totalBookings, 0),
);

/**
 * Donut Chart
 */
const pieStyle = computed(() => {
  let current = 0;
  const segments = [];

  stats.value.forEach((item, index) => {
    const next = current + item.percentage;

    segments.push(`${colors[index % colors.length]} ${current}% ${next}%`);

    current = next;
  });

  if (current < 100) {
    segments.push(`#e5e7eb ${current}% 100%`);
  }

  return {
    background: `conic-gradient(${segments.join(", ")})`,
  };
});
</script>
