<template>
  <section
    class="space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Top Booked Events</h2>
        <p class="text-sm text-slate-500 max-w-2xl">
          Track your best-performing events based on bookings over time.
        </p>
      </div>

      <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p class="text-xs uppercase tracking-widest text-slate-500">
          Total bookings
        </p>
        <p class="text-3xl font-semibold text-slate-900 mt-2">
          {{ totalBookings }}
        </p>
      </div>
    </div>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10"
    >
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"
      ></div>
      <p class="ml-4 text-slate-600 font-medium">
        Loading top booked events...
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="errorMessage"
      class="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700"
    >
      <p class="font-semibold">Failed to load data</p>
      <p class="text-sm mt-1">{{ errorMessage }}</p>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="topBookedEvents.length === 0"
      class="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500"
    >
      <p class="font-semibold text-lg">No booked events yet</p>
      <p class="text-sm mt-2">
        Bookings will appear here once users start registering.
      </p>
    </div>

    <!-- GRID -->
    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="(event, index) in topBookedEvents"
        :key="event.title || index"
        class="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
      >
        <!-- TOP -->
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">
              Rank {{ index + 1 }}
            </p>
            <h3 class="mt-2 text-lg font-semibold text-slate-900">
              {{ event.title }}
            </h3>
          </div>

          <div
            class="rounded-xl bg-indigo-600 px-3 py-1 text-sm font-semibold text-white"
          >
            {{ event.totalBookings }} bookings
          </div>
        </div>

        <!-- PROGRESS -->
        <div class="mt-5">
          <div class="flex justify-between text-xs text-slate-500">
            <span>Booking share</span>
            <span class="font-semibold text-slate-700">
              {{ progressValue(event.totalBookings) }}%
            </span>
          </div>

          <div class="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              :style="{ width: progressValue(event.totalBookings) + '%' }"
            ></div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="mt-4 flex justify-between text-sm text-slate-500">
          <span class="font-medium text-slate-700">Confirmed</span>
          <span>{{ event.totalBookings }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const { token } = useAuth();

const topBookedEvents = ref([]);
const loading = ref(false);
const errorMessage = ref("");

/**
 * PRE-CALCULATED max (fix performance issue)
 */
const maxBookings = computed(() => {
  return Math.max(...topBookedEvents.value.map((e) => e.totalBookings || 0), 1);
});

/**
 * total bookings
 */
const totalBookings = computed(() =>
  topBookedEvents.value.reduce(
    (sum, item) => sum + (item.totalBookings || 0),
    0,
  ),
);

/**
 * progress %
 */
const progressValue = (value) => {
  return Math.round(((value || 0) / maxBookings.value) * 100);
};

/**
 * FETCH DATA
 */
onMounted(async () => {
  loading.value = true;

  try {
    const data = await $fetch("/api/organiser/top-booked-events", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    topBookedEvents.value = data?.topBookedEvents || [];
  } catch (err) {
    errorMessage.value =
      err?.data?.message || err?.message || "Failed to load data";
  } finally {
    loading.value = false;
  }
});
</script>
