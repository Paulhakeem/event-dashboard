<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Top Events Booked Events</h2>
    <table class="w-full text-sm text-left">
      <thead>
        <tr class="text-gray-500 border-b">
          <th>Event Name</th>
          <th>Total Booking</th>
          <th>Total Income (Ksh)</th>
        </tr>
      </thead>
      <tbody>
        <!-- LOADING STATE -->
        <tr v-if="loading">
          <td colspan="3" class="px-6 py-12">
            <div
              class="flex flex-col items-center justify-center text-gray-500"
            >
              <div
                class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#9c4e8b]"
              ></div>
              <p class="mt-3 text-sm font-medium">Loading booked events...</p>
            </div>
          </td>
        </tr>

        <!-- ERROR STATE -->
        <tr v-else-if="BookedEvent.length === 0 && error">
          <td colspan="3" class="px-6 py-10">
            <div
              class="flex flex-col items-center justify-center rounded-lg bg-red-50 border border-red-200 p-6"
            >
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg"
              >
                ⚠️
              </div>

              <p class="mt-3 text-sm font-semibold text-red-700">
                Something went wrong
              </p>
              <p class="text-xs text-red-600 mt-1 text-center">
                {{ error }}
              </p>

              <button
                @click="fetchBookedEvents"
                class="mt-4 px-4 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition"
              >
                Retry
              </button>
            </div>
          </td>
        </tr>

        <!-- booked events data -->
        <tr
          v-else
          v-for="(event, index) in BookedEvent"
          :key="index"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-2">{{ event.name }}</td>
          <td class="py-2">{{ event.totalBookings }}</td>
          <td class="py-2">{{ event.totalIncome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { token } = useAuth();
const BookedEvent = ref([]);
const loading = ref(false);
const error = ref("");
const config = useRuntimeConfig()

// fetch booked events data from API and get top 5 events by total bookings
const fetchBookedEvents = async () => {
  try {
    loading.value = true;
    const res = await $fetch(`${config.public.organiserBookingEvents}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res.success && res.bookings) {
      // aggregate total bookings and income by event
      const eventMap = {};
      res.bookings.forEach((booking) => {
        const eventId = booking.event._id;
        if (!eventMap[eventId]) {
          eventMap[eventId] = {
            name: booking.event.name,
            totalBookings: 0,
            totalIncome: 0,
          };
        }
        eventMap[eventId].totalBookings += 1;
        eventMap[eventId].totalIncome += booking.amount;
      });
      // convert map to array and sort by total bookings
      BookedEvent.value = Object.values(eventMap)
        .sort((a, b) => b.totalBookings - a.totalBookings)
        .slice(0, 5); // get top 5 events
    } else {
      error.value = "Failed to fetch booked events data";
    }
  } catch (err) {
    error.value = "An error occurred while fetching booked events data";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookedEvents();
});
</script>
