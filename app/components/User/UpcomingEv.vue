<template>
  <div>
    <table class="border-collapse">
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(item, index) in events"
          :key="index"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="py-3 px-3 text-sm text-gray-600">{{ item.title }}</td>
          <!-- date -->
          <td class="py-3 px-3 text-sm text-gray-600">
            {{
              new Date(item.date).toLocaleDateString()
            }}
          </td>
          <td class="py-3 px-3 text-sm text-gray-600">
            {{ item.location}}
          </td>
          <td class="py-3 px-3 text-sm text-gray-600">
            <span
              :class="{
                'bg-green-500': item.status === 'upcoming',
                'bg-blue-500': item.status === 'ongoing',
                'bg-gray-500': item.status === 'completed',
                'bg-red-500': item.status === 'cancelled',
              }"
              class="px-3 py-1 text-sm rounded-full text-gray-200"
            >
              {{ item.status || "upcoming" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const events = ref([]);
onMounted(async () => {
  try {
    const res = await $fetch("/api/events/fetch");
    if (res.success) {
      events.value = res.events || [];
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    pendings.value = false;
  }
});
</script>
