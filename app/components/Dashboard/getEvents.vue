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
                  <button @click="openEdit(event)" class="cursor-pointer">
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

  <!-- edit event modal -->
  <Transition name="modal">
    <div
      v-if="editingEvent"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto"
    >
      <div class="w-full max-w-2xl rounded bg-white p-6">
        <h3 class="mb-4 text-lg font-medium">Edit Event</h3>
        <div
          class="grid gap-4 md:grid-cols-2 bg-white shadow-lg rounded-lg p-6"
        >
          <!-- Title -->
          <div class="flex flex-col">
            <label for="title" class="text-sm font-medium text-gray-700 mb-1"
              >Event Title</label
            >
            <input
              id="title"
              v-model="editForm.title"
              placeholder="Enter event title"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <!-- Date -->
          <div class="flex flex-col">
            <label for="date" class="text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              id="date"
              v-model="editForm.date"
              type="date"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <!-- Location -->
          <div class="flex flex-col">
            <label for="location" class="text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <input
              id="location"
              v-model="editForm.location"
              placeholder="Enter location"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <!-- early birds-->
          <div class="flex flex-col">
            <label for="earlybirds" class="text-sm font-medium text-gray-700 mb-1"
              >Early Birds</label
            >
            <input
              id="regular"
              v-model.number="editForm.earlyBirds"
              placeholder="Early Birds"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
          <!-- Advance-->
          <div class="flex flex-col">
            <label for="advance" class="text-sm font-medium text-gray-700 mb-1"
              >Advance</label
            >
            <input
              id="regular"
              v-model.number="editForm.Advance"
              placeholder="Advance"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
          <!-- atDoor-->
          <div class="flex flex-col">
            <label for="atDoor" class="text-sm font-medium text-gray-700 mb-1"
              >At Door</label
            >
            <input
              id="regular"
              v-model.number="editForm.AtDoor"
              placeholder="at Door"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
          <!-- regular ticket -->
          <div class="flex flex-col">
            <label for="regular" class="text-sm font-medium text-gray-700 mb-1"
              >💵 Regular Price</label
            >
            <input
              id="regular"
              v-model.number="editForm.regular"
              placeholder="Regular price"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>

          <!-- VIP Price -->
          <div class="flex flex-col">
            <label for="vip" class="text-sm font-medium text-gray-700 mb-1"
              >🌟 VIP Price</label
            >
            <input
              id="vip"
              v-model.number="editForm.vip"
              placeholder="VIP price"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>

          <!-- VVIP Price -->
          <div class="flex flex-col">
            <label for="vvip" class="text-sm font-medium text-gray-700 mb-1"
              >👑 VVIP Price</label
            >
            <input
              id="vvip"
              v-model.number="editForm.vvip"
              placeholder="VVIP price"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
            />
          </div>

          <!-- Status -->
          <div class="flex flex-col">
            <label for="status" class="text-sm font-medium text-gray-700 mb-1"
              >Event Status</label
            >
            <select
              id="status"
              v-model="editForm.status"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="upcoming">📅 Upcoming</option>
              <option value="ongoing">🔴 Ongoing</option>
              <option value="completed">✅ Completed</option>
              <option value="pending">⏳ Pending</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <!-- Event Type -->
          <div class="flex flex-col">
            <label
              for="eventType"
              class="text-sm font-medium text-gray-700 mb-1"
              >Event Type</label
            >
            <select
              id="eventType"
              v-model="editForm.eventType"
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="other">📌 Select Event Type</option>
              <option value="Entertainment">🎵 Entertainment</option>
              <option value="Arts & Culture">🎨 Arts & Culture</option>
              <option value="Tech & Business">💻 Tech & Business</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          <!-- Description -->
          <div class="flex flex-col col-span-2">
            <label
              for="description"
              class="text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              id="description"
              v-model="editForm.description"
              placeholder="Event description..."
              class="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-32"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="col-span-2 bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Save Event
          </button>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeEdit" class="rounded border px-4 py-2">
            Cancel
          </button>
          <button
            @click="submitUpdate"
            class="rounded bg-[#9c4e8b] px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { events, loading } = totalEvents();
const {
  editingEvent,
  editForm,
  removeEvent,
  openEdit,
  closeEdit,
  submitUpdate,
} = updateEvent(events);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.modal-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.modal-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
