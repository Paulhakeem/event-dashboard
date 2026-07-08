<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="relative overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      :style="{
        background: `linear-gradient(135deg, ${card.from}, ${card.to})`,
      }"
    >
      <div class="h-full rounded-2xl bg-white p-5">
        <div class="flex items-start justify-between gap-2">
          <!-- Text -->
          <div class="min-w-0">
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-400 truncate"
            >
              {{ card.label }}
            </p>
            <h2 class="mt-3 text-3xl font-bold text-gray-900 leading-none">
              <span
                v-if="card.loading"
                class="inline-block w-12 h-7 bg-gray-100 rounded-lg animate-pulse"
              ></span>
              <span v-else>{{ card.value }}</span>
            </h2>
            <div class="mt-2.5 flex items-center gap-1">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                :style="{ background: card.from + '18', color: card.from }"
              >
                <Icon :name="card.trendIcon" class="text-xs" />
                {{ card.trend }}
              </span>
            </div>
          </div>

          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            :style="{ background: card.from + '15' }"
          >
            <Icon
              :name="card.icon"
              class="text-2xl"
              :style="{ color: card.from }"
            />
          </div>
        </div>

        <!-- Bottom accent bar -->
        <div
          class="absolute bottom-0 left-0 h-0.5 w-full opacity-60"
          :style="{
            background: `linear-gradient(to right, ${card.from}, ${card.to})`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { users } = totalUsers();
const { events } = totalEvents();
const { cancelledEvents } = fetchCancelledEvents();
const { eventsBooked, loading, fetchBookedEvents } = eventsBooking();
const {
  totalTicketCount,
  cancelledTicketCount,
  ticketsLoading,
  cancelledLoading,
} = useTickets();

onMounted(async () => {
  await fetchBookedEvents();
});

const totalOrganisers = computed(
  () => (users.value || []).filter((u) => u.role === "organiser").length,
);

const liveEvents = computed(
  () =>
    (events.value || []).filter(
      (e) => e.status === "live" || e.status === "ongoing",
    ).length,
);

const cards = computed(() => [
  {
    label: "Total Users",
    value: users.value?.length ?? 0,
    loading: false,
    icon: "solar:users-group-rounded-bold",
    from: "#3b82f6",
    to: "#06b6d4",
    trend: "All time",
    trendIcon: "material-symbols:person",
  },
  {
    label: "Total Events",
    value: events.value?.length ?? 0,
    loading: false,
    icon: "solar:calendar-bold",
    from: "#9c4e8b",
    to: "#ec4899",
    trend: "All events",
    trendIcon: "material-symbols:event",
  },
  {
    label: "Event Bookings",
    value: loading.value ? "…" : (eventsBooked.value?.length ?? 0),
    loading: loading.value,
    icon: "solar:ticket-bold",
    from: "#10b981",
    to: "#34d399",
    trend: "Reservations",
    trendIcon: "material-symbols:confirmation-number",
  },
  {
    label: "Cancelled Events",
    value: cancelledEvents?.value?.length ?? 0,
    loading: false,
    icon: "solar:close-circle-bold",
    from: "#ef4444",
    to: "#f97316",
    trend: "Cancelled",
    trendIcon: "material-symbols:cancel",
  },
  {
    label: "Total Organisers",
    value: totalOrganisers.value,
    loading: false,
    icon: "solar:user-id-bold",
    from: "#f59e0b",
    to: "#fbbf24",
    trend: "Organisers",
    trendIcon: "material-symbols:manage-accounts",
  },
  {
    label: "Tickets Sold",
    value: totalTicketCount.value,
    loading: ticketsLoading.value,
    icon: "solar:ticket-sale-bold",
    from: "#8b5cf6",
    to: "#a78bfa",
    trend: "All tickets",
    trendIcon: "material-symbols:confirmation-number",
  },
  {
    label: "Live Events",
    value: liveEvents.value,
    loading: false,
    icon: "solar:play-circle-bold",
    from: "#06b6d4",
    to: "#67e8f9",
    trend: "Now live",
    trendIcon: "material-symbols:live-tv",
  },
  {
    label: "Cancelled Tickets",
    value: cancelledTicketCount.value,
    loading: cancelledLoading.value,
    icon: "solar:ticket-bold",
    from: "#64748b",
    to: "#94a3b8",
    trend: "Refunded",
    trendIcon: "material-symbols:cancel",
  },
]);
</script>
