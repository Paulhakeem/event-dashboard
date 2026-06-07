<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      <!-- Top accent bar -->
      <div
        class="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        :style="{
          background: `linear-gradient(to right, ${card.from}, ${card.to})`,
        }"
      ></div>

      <!-- Icon -->
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        :style="{ background: card.from + '15' }"
      >
        <Icon :name="card.icon" class="text-xl" :style="{ color: card.from }" />
      </div>

      <!-- Value + trend -->
      <div class="flex items-end justify-between gap-2">
        <div>
          <p
            class="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1.5"
          >
            {{ card.label }}
          </p>
          <!-- Skeleton while loading -->
          <div
            v-if="card.loading"
            class="h-7 w-16 bg-gray-100 rounded-lg animate-pulse mt-1"
          ></div>
          <p v-else class="text-2xl font-bold text-gray-900 leading-none">
            <span
              v-if="card.prefix"
              class="text-sm font-semibold text-gray-500 mr-0.5"
              >{{ card.prefix }}</span
            >
            {{ card.value }}
          </p>
        </div>
        <span
          class="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          :style="{ background: card.from + '15', color: card.from }"
        >
          <Icon :name="card.trendIcon" class="text-xs" />
          {{ card.trend }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { events } = organiserEvents();
const { token } = useAuth();
const config = useRuntimeConfig();

const { totalTickets } = getTickets();

// Local state
const cancelledEvents = ref([]);
const totalBookedEvents = ref(0);
const totalIncome = ref(0);
const cancelledTickets = ref(0);
const refundedTickets = ref(0);
const dashboardLoading = ref(true);

const loadDashboard = async () => {
  dashboardLoading.value = true;
  try {
    cancelledEvents.value = (events.value || []).filter(
      (e) => e.status === "cancelled",
    );

    const [incomeRes, bookedRes] = await Promise.all([
      $fetch(config.public.organiserTotalAmount, {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
      $fetch(config.public.organiserBookingEvents, {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
    ]);

    totalIncome.value = incomeRes?.totalIncome || 0;

    const booked =
      bookedRes?.totalBookedEvents ??
      bookedRes?.data ??
      bookedRes?.events ??
      [];
    totalBookedEvents.value = Array.isArray(booked)
      ? booked.length
      : Number(booked || 0);
  } catch (err) {
    console.error("Dashboard load error:", err);
    totalBookedEvents.value = 0;
  } finally {
    dashboardLoading.value = false;
  }
};

// Live / ongoing events
const liveEvents = computed(() =>
  (events.value || []).filter(
    (e) => e.status === "live" || e.status === "ongoing",
  ),
);

// Cards array — uses local refs, not props
const cards = computed(() => [
  {
    label: "Total Income",
    value: Number(totalIncome.value || 0).toLocaleString(),
    prefix: "KES",
    loading: dashboardLoading.value,
    icon: "solar:wallet-money-bold",
    from: "#9c4e8b",
    to: "#ec4899",
    trend: "Revenue",
    trendIcon: "material-symbols:trending-up",
  },
  {
    label: "Total Events",
    value: (events.value || []).length,
    loading: false,
    icon: "solar:calendar-bold",
    from: "#3b82f6",
    to: "#6366f1",
    trend: "All time",
    trendIcon: "material-symbols:event",
  },
  {
    label: "Booked Events",
    value: totalBookedEvents.value,
    loading: dashboardLoading.value,
    icon: "solar:ticket-bold",
    from: "#10b981",
    to: "#34d399",
    trend: "Bookings",
    trendIcon: "material-symbols:confirmation-number",
  },
  {
    label: "Cancelled Events",
    value: cancelledEvents.value.length,
    loading: false,
    icon: "solar:close-circle-bold",
    from: "#ef4444",
    to: "#f97316",
    trend: "Cancelled",
    trendIcon: "material-symbols:cancel",
  },
  {
    label: "Tickets Sold",
    value: totalTickets,
    loading: dashboardLoading.value,
    icon: "solar:ticket-sale-bold",
    from: "#8b5cf6",
    to: "#a78bfa",
    trend: "Issued",
    trendIcon: "material-symbols:sell",
  },
  {
    label: "Live Events",
    value: liveEvents.value.length,
    loading: false,
    icon: "solar:play-circle-bold",
    from: "#06b6d4",
    to: "#22d3ee",
    trend: "Now live",
    trendIcon: "material-symbols:live-tv",
  },
  {
    label: "Cancelled Tickets",
    value: cancelledTickets.value,
    loading: dashboardLoading.value,
    icon: "solar:ticket-bold",
    from: "#64748b",
    to: "#94a3b8",
    trend: "Cancelled",
    trendIcon: "material-symbols:cancel",
  },
  {
    label: "Refunded Tickets",
    value: refundedTickets.value,
    loading: dashboardLoading.value,
    icon: "solar:refresh-bold",
    from: "#f59e0b",
    to: "#fbbf24",
    trend: "Pending",
    trendIcon: "material-symbols:refresh",
  },
]);

onMounted(async () => {
  await loadDashboard();
});
</script>
