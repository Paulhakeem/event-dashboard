<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <!-- HEADER -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b bg-gray-50"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Recent Bookings</h3>
        <p class="text-sm text-gray-500">
          Overview of booked tickets per event
        </p>
      </div>

      <button
        @click="getBookings"
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7a3968] transition"
      >
        Refresh
      </button>
    </div>

    <!-- TABLE -->
    <div class="overflow-y-auto max-h-104">
      <table class="w-full text-sm">
        <thead class="sticky top-0 z-10 bg-white border-b">
          <tr class="text-gray-600">
            <th class="px-6 py-3 text-left font-semibold">Event</th>
            <th class="px-6 py-3 text-left font-semibold">Location</th>
            <th class="px-6 py-3 text-left font-semibold">Date</th>
            <th class="px-6 py-3 text-center font-semibold">Tickets</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr
            v-for="booking in booking"
            :key="booking._id"
            class="hover:bg-gray-50 transition"
          >
            <!-- EVENT -->
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900 truncate max-w-55">
                {{ booking.name }}
              </p>
            </td>

            <!-- LOCATION -->
            <td class="px-6 py-4 text-gray-600">
              📍 {{ booking.location }}
            </td>

            <!-- DATE -->
            <td class="px-6 py-4 text-gray-600">
              {{ formatDate(booking.bookedAt) }}
            </td>

            <!-- TICKETS -->
            <td class="px-6 py-4 text-center">
              <span
                class="inline-flex items-center justify-center min-w-10 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
              >
                {{ booking.ticketsBooked }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- LOADING -->
      <div
        v-if="loadingBookings"
        class="flex flex-col items-center justify-center py-14 text-gray-500"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9c4e8b]"
        ></div>
        <p class="mt-3 text-sm">Loading bookings...</p>
      </div>

      <!-- ERROR -->
      <div
        v-if="errorBookings"
        class="mx-6 my-6 rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <p class="font-semibold text-red-700">Something went wrong</p>
        <p class="text-sm text-red-600 mt-1">{{ errorBookings }}</p>

        <button
          @click="getBookings"
          class="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!loadingBookings && booking.length === 0 && !errorBookings"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div
          class="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xl"
        >
          🎟️
        </div>
        <p class="mt-4 text-gray-700 font-medium">No bookings yet</p>
        <p class="text-sm text-gray-500">
          Bookings will appear here once users reserve tickets
        </p>

        <button
          @click="getBookings"
          class="mt-5 px-4 py-1.5 bg-[#9c4e8b] text-white text-xs rounded-lg hover:bg-[#7a3968] transition"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { token } = useAuth();
const booking = ref([]);
const loadingBookings = ref(false);
const errorBookings = ref(null);
const config = useRuntimeConfig()
const getBookings = async () => {
  loadingBookings.value = true;
  errorBookings.value = null;
  try {
    const response = await $fetch(`${config.public.organiserBookingEvents}`, {
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
    });
    booking.value = response.bookings;
  } catch (err) {
    errorBookings.value = "An error occurred while fetching bookings";
  } finally {
    loadingBookings.value = false;
  }
};

onMounted(() => {
  getBookings();
});
</script>
