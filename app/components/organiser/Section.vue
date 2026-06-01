<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    <!-- Total Income -->
    <div
      class="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Total Income</span>
        <span class="opacity-80">💰</span>
      </div>
      <p class="text-2xl font-bold mt-2">Ksh {{ totalIncome }}</p>
    </div>

    <!-- Total Events -->
    <div
      class="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Total Events</span>
        <span class="opacity-80">📅</span>
      </div>
      <p class="text-2xl font-bold mt-2">{{ events.length }}</p>
    </div>

    <!-- Booked Events -->
    <div
      class="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Booked Events</span>
        <span class="opacity-80">✔</span>
      </div>

      <p class="text-2xl font-bold mt-2">
        {{ totalBookedEvents }}
      </p>
    </div>

    <!-- Cancelled Events -->
    <div
      class="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Cancelled Events</span>
        <span class="opacity-80">✖</span>
      </div>

      <p class="text-2xl font-bold mt-2">
        {{ cancelledEvents.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { events } = organiserEvents();
const { token } = useAuth();
const config = useRuntimeConfig();

const cancelledEvents = ref([]);
const totalBookedEvents = ref([]);
const totalIncome = ref(0);

/**
 * Load ALL dashboard data once
 */
const loadDashboard = async () => {
  try {
    // Cancelled events (local filter)
    cancelledEvents.value = events.value.filter(
      (e) => e.status === "cancelled",
    );

    // Total income
    const incomeRes = await $fetch(config.public.organiserTotalAmount, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    totalIncome.value = incomeRes?.totalIncome || 0;

    // Booked events
    const bookedRes = await $fetch(config.public.organiserBookingEvents, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    // IMPORTANT: handle different API shapes safely
    totalBookedEvents.value =
      bookedRes?.totalBookedEvents ||
      bookedRes?.data ||
      bookedRes?.events ||
      [];
  } catch (err) {
    console.error("Dashboard load error:", err);
    totalBookedEvents.value = [];
  }
};

/**
 * Run once when component is ready
 */
onMounted(async () => {
  await loadDashboard();
});
</script>
