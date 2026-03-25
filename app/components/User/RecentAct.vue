<template>
  <div class="w-full overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <!-- HEADER -->
        <thead>
          <tr
            class="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200"
          >
            <th class="py-3 px-4">Event</th>
            <th class="py-3 px-4">Date</th>
            <th class="py-3 px-4">Ticket</th>
            <th class="py-3 px-4 text-right">Status</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="(item, index) in booking"
            :key="index"
            class="hover:bg-gray-50 transition duration-200"
          >
            <!-- Event -->
            <td class="py-4 px-4 text-sm font-medium text-gray-800">
              {{ item.eventName }}
            </td>

            <!-- Date -->
            <td class="py-4 px-4 text-sm text-gray-500">
              {{ formatDate(item.bookedAt) }}
            </td>

            <!-- Ticket -->
            <td class="py-4 px-4 text-sm text-gray-600">
              {{ item.ticketType }}
            </td>

            <!-- Status -->
            <td class="py-4 px-4 text-right">
              <span
                :class="statusClass(item.status)"
                class="px-3 py-1 text-xs font-semibold rounded-full"
              >
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="booking.length === 0"
      class="text-center py-10 text-gray-500"
    >
      No recent activity
    </div>
  </div>
</template>

<script setup>
const { booking } = useBookingData();

// format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// dynamic status colors
const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "success":
      return "bg-green-100 text-green-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};
</script>