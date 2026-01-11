<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full text-left text-sm font-light">
            <thead
              class="border-b font-medium dark:border-neutral-500 bg-[#9c4e8b]"
            >
              <tr>
                <th scope="col" class="px-6 py-4 text-white">Event</th>
                <th scope="col" class="px-6 py-4 text-white">Date</th>
                <th scope="col" class="px-6 py-4 text-white">Location</th>
                <th scope="col" class="px-6 py-4 text-white">Regular Ticket</th>
                <th scope="col" class="px-6 py-4 text-white">VIP Ticket</th>
                <th scope="col" class="px-6 py-4 text-white">VVIP Ticket</th>
                <th scope="col" class="px-6 py-4 text-white">Event Type</th>
                <th scope="col" class="px-6 py-4 text-white">Status</th>
                <th scope="col" class="px-6 py-4 text-white">Edit Event</th>
                <th scope="col" class="px-6 py-4 text-white">Delete Event</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in events"
                :key="event.id"
                class="border-b dark:border-neutral-500 hover:bg-gray-100"
              >
                <td
                  class="whitespace -nowrap px-6 py-4 font-medium first-letter:capitalize"
                >
                  {{ event.title }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ new Date(event.date).toLocaleDateString() }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ event.location }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  ksh {{ event.regular }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  ksh {{ event.vip }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  ksh {{ event.vvip }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium">
                  {{ event.eventType }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-green-500"
                >
                  {{ event.status }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-500"
                >
                  <button
                    class="cursor-pointer"
                  >
                   <Icon name="solar:pen-bold" />
                  </button>
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-red-500"
                >
                  <button
                    @click="removeEvent(event._id)"
                    class="cursor-pointer"
                  >
                    <Icon name="vaadin:close" />
                  </button>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-4">Loading events...</td>
              </tr>
              <tr v-if="!loading && events.length === 0">
                <td colspan="4" class="text-center py-4">No events found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { events, loading } = totalEvents();

const form = ref({
  status: "",
});

const removeEvent = async (id) => {
  const res = await $fetch(`/api/events/${id}`, {
    method: "DELETE",
  });
  console.log(res);
};

const UpdateEvent = async (id) => {
  const res = await $fetch(`/api/events/${id}`, {
    method: "PATCH",
    body: {
      status: form.value.status,
    },
  });
  console.log(res);
};
</script>
