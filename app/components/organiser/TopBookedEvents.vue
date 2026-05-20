<template>
  <section
    class="space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm ring-1 ring-slate-100"
  >
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Top Booked Events</h2>
        <p class="max-w-2xl text-sm text-slate-500">
          See your most popular events over the last 30 days and track each
          event's booking performance.
        </p>
      </div>

      <div
        class="rounded-3xl bg-slate-50 p-4 text-slate-700 ring-1 ring-slate-200"
      >
        <p class="text-xs uppercase tracking-[0.24em] text-slate-500">
          Total bookings
        </p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">
          {{ totalBookings }}
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-slate-500"
    >
      <div
        class="mr-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700"
      ></div>
      <p class="text-base font-medium">Loading top booked events…</p>
    </div>

    <div
      v-if="!loading && errorMessage"
      class="rounded-3xl border border-rose-100 bg-rose-50 p-5 text-rose-700 shadow-sm"
    >
      <p class="font-semibold">Unable to load top booked events</p>
      <p class="mt-1 text-sm">{{ errorMessage }}</p>
    </div>

    <div
      v-if="!loading && !errorMessage && topBookedEvents.length === 0"
      class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-500"
    >
      <p class="text-lg font-semibold">No booked events yet</p>
      <p class="mt-2 text-sm">
        Once your events start receiving bookings, this list will show the
        highest-performing ones.
      </p>
    </div>

    <div
      v-if="!loading && topBookedEvents.length > 0"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article
        v-for="(event, index) in topBookedEvents"
        :key="event.title || index"
        class="group overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-5 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-400">
              Rank {{ index + 1 }}
            </p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">
              {{ event.title }}
            </h3>
          </div>
          <div
            class="rounded-2xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_15px_30px_-20px_rgba(79,70,229,0.45)]"
          >
            +{{ event.totalBookings }} bookings
          </div>
        </div>

        <div class="mt-6 rounded-3xl bg-slate-900/5 p-4">
          <div class="flex items-center justify-between text-sm text-slate-500">
            <span>Booking share</span>
            <span class="font-semibold text-slate-700"
              >{{ progressValue(event.totalBookings) }}%</span
            >
          </div>
          <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              class="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              :style="{ width: progressValue(event.totalBookings) + '%' }"
            ></div>
          </div>
        </div>

        <div
          class="mt-5 flex items-center justify-between text-sm text-slate-500"
        >
          <p class="font-medium text-slate-700">Confirmed bookings</p>
          <p class="text-slate-600">{{ event.totalBookings }}</p>
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

const totalBookings = computed(() =>
  topBookedEvents.value.reduce(
    (sum, item) => sum + (item.totalBookings || 0),
    0,
  ),
);

const progressValue = (value) => {
  const max = Math.max(
    ...topBookedEvents.value.map((item) => item.totalBookings || 0),
    1,
  );
  return Math.round(((value || 0) / max) * 100);
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/organiser/top-booked-events", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to load top booked events");
    }
    const data = await response.json();
    topBookedEvents.value = data.topBookedEvents || [];
  } catch (error) {
    errorMessage.value = error.message || "Failed to load top booked events";
  } finally {
    loading.value = false;
  }
});
</script>
