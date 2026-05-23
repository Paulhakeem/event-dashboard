<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Top Booked Events</h2>

    <div v-if="loading" class="py-8 flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#9c4e8b]"
      ></div>
      <p class="ml-4 text-sm text-gray-500">Loading booked events...</p>
    </div>

    <div
      v-else-if="error"
      class="rounded-lg bg-red-50 border border-red-200 p-4"
    >
      <p class="font-semibold text-red-700">Something went wrong</p>
      <p class="text-sm text-red-600 mt-1">{{ error }}</p>
      <button
        @click="fetchBookedEvents"
        class="mt-3 px-3 py-1 text-xs bg-red-600 text-white rounded"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="bookedEvents.length === 0"
      class="py-6 text-center text-gray-500"
    >
      No booked events yet. Once you receive bookings, the top events will
      appear here.
    </div>

    <div v-else class="space-y-4">
      <!-- Top event highlight -->
      <div
        class="rounded-lg p-4 bg-gradient-to-r from-purple-50 to-white border border-gray-100 flex items-center justify-between"
      >
        <div>
          <p class="text-sm text-gray-500">Top Event</p>
          <h3 class="text-lg font-bold text-gray-900">
            {{ bookedEvents[0].eventName || bookedEvents[0].name }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Booked {{ bookedEvents[0].totalBookings }} times
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">Total income</p>
          <p class="text-lg font-semibold text-gray-900">
            Ksh {{ bookedEvents[0].totalIncome ?? 0 }}
          </p>
        </div>
      </div>

      <!-- Other top events list -->
      <ul class="divide-y">
        <li
          v-for="(event, idx) in bookedEvents.slice(1)"
          :key="event.eventName || event.name || idx"
          class="py-3 flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-gray-900">
              {{ event.eventName || event.name }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Booked {{ event.totalBookings }} times
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Income</p>
            <p class="font-semibold">Ksh {{ event.totalIncome ?? 0 }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { token } = useAuth();
const bookedEvents = ref([]);
const loading = ref(false);
const error = ref("");
const config = useRuntimeConfig();

// fetch booked events data from API and get top 5 events by total bookings
const fetchBookedEvents = async () => {
  loading.value = true;
  error.value = "";
  bookedEvents.value = [];

  try {
    const res = await $fetch(`${config.public.organiserBookingEvents}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log("API response for booked events:", res);
    const bookings = Array.isArray(res)
      ? res
      : Array.isArray(res?.bookings)
        ? res.bookings
        : [];

    if (bookings.length > 0) {
      const eventMap = {};
      bookings.forEach((booking) => {
        const eventName = booking.eventName || booking.name || "Unnamed event";
        const eventId = eventName;

        if (!eventMap[eventId]) {
          eventMap[eventId] = {
            eventName: eventName,
            totalBookings: 0,
            totalIncome: 0,
          };
        }

        eventMap[eventId].totalBookings += 1;
        eventMap[eventId].totalIncome += Number(booking.amount || 0);
      });

      bookedEvents.value = Object.values(eventMap)
        .sort((a, b) => b.totalBookings - a.totalBookings)
        .slice(0, 5);
    }
  } catch (err) {
    bookedEvents.value = [];
    error.value =
      err?.message || "An error occurred while fetching booked events data";
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchBookedEvents();
});
</script>
