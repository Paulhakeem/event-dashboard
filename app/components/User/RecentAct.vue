<template>
  <div>
    <table class="border-collapse">
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(item, index) in booking"
          :key="index"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="py-3 px-3 text-sm text-gray-600">{{ item.eventName }}</td>
          <!-- date -->
          <td class="py-3 px-3 text-sm text-gray-600">{{ new Date(item.bookedAt).toLocaleDateString() }}</td>
          <td class="py-3 px-3 text-sm text-gray-600">{{ item.ticketType }}</td>
          <td class="py-3 px-3 text-sm text-gray-600">
            <span
              class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700"
            >
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { booking } = useBookingData();
</script>
