<template>
  <div class="flex flex-col space-y-6">
    <!-- Header -->
    <div
      class="flex items-center justify-between bg-white shadow rounded-lg p-4"
    >
      <h2 class="text-lg font-semibold text-gray-700">Bookings Overview</h2>
    </div>

    <!-- Error state -->
    <div
      v-if="localError"
      class="flex flex-col items-center justify-center py-12 bg-red-50 border border-red-200 rounded-xl shadow-sm text-center"
    >
      <div
        class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
      >
        <Icon
          name="material-symbols:error-outline"
          class="text-2xl text-red-500"
        />
      </div>
      <p class="text-sm font-semibold text-red-700">Something went wrong</p>
      <p class="mt-1 text-xs text-red-500 max-w-xs">{{ localError }}</p>
      <button
        @click="retry"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        <Icon name="material-symbols:refresh" class="text-sm" />
        Retry
      </button>
    </div>

    <!-- Loading: skeleton -->
    <div
      v-else-if="localLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3"
      >
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        <div class="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="eventsBooked.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm text-center"
    >
      <div
        class="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3"
      >
        <Icon
          name="material-symbols:confirmation-number"
          class="text-2xl text-[#9c4e8b]"
        />
      </div>
      <p class="text-gray-700 font-medium">No bookings yet</p>
      <p class="text-gray-400 text-sm mt-1">
        Bookings will appear here once events are booked.
      </p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-xl shadow-lg bg-white">
      <table class="min-w-full text-left text-sm font-light">
        <thead class="bg-gradient-to-r from-purple-700 to-[#16c851] text-white">
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold whitespace-nowrap">
              Event
            </th>
            <th scope="col" class="px-6 py-4 font-semibold whitespace-nowrap">
              Revenue
            </th>
            <th
              v-for="type in ticketTypes"
              :key="type.name"
              scope="col"
              class="px-6 py-4 font-semibold capitalize whitespace-nowrap"
            >
              {{ type.name }}<br />
              <span class="text-xs font-normal"
                >Ksh {{ Number(type.price || 0).toLocaleString() }}</span
              >
            </th>
            <th scope="col" class="px-6 py-4 font-semibold whitespace-nowrap">
              Attendees
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in eventsBooked"
            :key="event._id || event.eventName"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-medium capitalize">
              {{ event.eventName }}
            </td>
            <td
              class="px-6 py-4 text-green-600 font-semibold whitespace-nowrap"
            >
              KES {{ Number(event.totalRevenue || 0).toLocaleString() }}
            </td>
            <td
              v-for="type in ticketTypes"
              :key="type.name"
              class="px-6 py-4 text-gray-700 font-semibold text-center"
            >
              {{ getTicketCount(event, type.name) }}
            </td>
            <td class="px-6 py-4 text-gray-500 font-semibold">
              {{ event.totalUsers || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { eventsBooked, loading, error, fetchBookedEvents } = eventsBooking();

const localLoading = ref(true);
const localError = ref("");

const fetchData = async () => {
  localLoading.value = true;
  localError.value = "";
  try {
    await fetchBookedEvents();

    // FIX 3: composable sets error.value on failure but doesn't throw,
    // so we must check it manually after the await.
    if (error.value) {
      localError.value = error.value;
    }
  } catch (err) {
    localError.value =
      err?.data?.message ||
      err?.message ||
      "Failed to load bookings. Please try again.";
  } finally {
    localLoading.value = false;
  }
};

const retry = () => fetchData();

onMounted(fetchData);

// Collect unique ticket types across all events for dynamic columns
const ticketTypes = computed(() => {
  const seen = {};
  eventsBooked.value.forEach((event) => {
    (event.customTickets || []).forEach((t) => {
      if (!t?.name) return;
      if (!seen[t.name]) {
        seen[t.name] = { name: t.name, price: Number(t.price ?? 0) };
      }
    });
  });
  return Object.values(seen);
});

const getTicketCount = (event, typeName) => {
  const found = (event.customTickets || []).find((t) => t?.name === typeName);
  return found?.count ?? found?.ticketsSold ?? found?.quantity ?? 0;
};
</script>
