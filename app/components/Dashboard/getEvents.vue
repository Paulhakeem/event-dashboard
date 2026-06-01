<template>
  <div class="flex flex-col gap-4">
    <!-- ───────────────────────────────────────────
         MOBILE: Card Layout  (< sm)
    ─────────────────────────────────────────────── -->
    <div class="block sm:hidden space-y-4">
      <!-- Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3"
        >
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          <div class="flex gap-2 pt-1">
            <div class="h-8 bg-gray-200 rounded-lg w-20"></div>
            <div class="h-8 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="events.length === 0"
        class="bg-white rounded-xl border border-gray-200 py-12 text-center"
      >
        <div
          class="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <Icon
            name="material-symbols:event-busy"
            class="text-2xl text-[#9c4e8b]"
          />
        </div>
        <p class="text-gray-500 text-sm font-medium">No events found.</p>
      </div>

      <!-- Cards -->
      <template v-else>
        <div
          v-for="event in events"
          :key="event._id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
        >
          <!-- Title + Status -->
          <div class="flex items-start justify-between gap-2">
            <p
              class="font-semibold text-gray-900 text-sm leading-snug capitalize line-clamp-2"
            >
              {{ event.title }}
            </p>
            <span
              :class="statusBadgeClass(event.status)"
              class="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
            >
              {{ event.status }}
            </span>
          </div>

          <!-- Meta grid -->
          <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:calendar-today"
                class="text-[#9c4e8b] flex-shrink-0"
              />
              {{ new Date(event.date).toLocaleDateString() }}
            </div>
            <div class="flex items-center gap-1.5 min-w-0">
              <Icon
                name="material-symbols:location-on"
                class="text-[#9c4e8b] flex-shrink-0"
              />
              <span class="truncate">{{ event.location }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:category"
                class="text-[#9c4e8b] flex-shrink-0"
              />
              {{ event.eventType }}
            </div>
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:confirmation-number"
                class="text-[#9c4e8b] flex-shrink-0"
              />
              <span :class="capacityClass(event)">
                {{ event.ticketsSold || 0 }}/{{ event.TicketQuantity || 0 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-1">
            <button
              @click="openEdit(event)"
              :disabled="isEditDisabled(event.status)"
              :class="[
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition duration-200',
                isEditDisabled(event.status)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95',
              ]"
            >
              <Icon name="solar:pen-bold" />
              Edit
            </button>
            <button
              @click="removeEvent(event._id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition duration-200"
            >
              <Icon name="vaadin:close" />
              Delete
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- ───────────────────────────────────────────
         DESKTOP: Table Layout  (≥ sm)
    ─────────────────────────────────────────────── -->
    <div
      class="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm"
    >
      <table class="min-w-full text-left text-sm">
        <thead class="bg-[#9c4e8b]">
          <tr>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Event
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Date
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Location
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Type
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Capacity
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Status
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Edit
            </th>
            <th
              class="px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wide"
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <!-- Skeleton rows -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="n" class="animate-pulse">
              <td v-for="col in 8" :key="col" class="px-5 py-4">
                <div class="h-3 bg-gray-200 rounded-full w-24"></div>
              </td>
            </tr>
          </template>

          <!-- Empty -->
          <tr v-else-if="events.length === 0">
            <td colspan="8" class="text-center py-16">
              <div class="flex flex-col items-center gap-2 text-gray-400">
                <Icon
                  name="material-symbols:event-busy"
                  class="text-3xl text-[#9c4e8b]/40"
                />
                <p class="text-sm font-medium">No events found.</p>
              </div>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <tr
              v-for="event in events"
              :key="event._id"
              class="hover:bg-purple-50/40 transition duration-150"
            >
              <td
                class="px-5 py-4 font-semibold text-gray-900 capitalize max-w-[180px] truncate"
              >
                {{ event.title }}
              </td>
              <td class="px-5 py-4 text-gray-600 whitespace-nowrap">
                {{ new Date(event.date).toLocaleDateString() }}
              </td>
              <td class="px-5 py-4 text-gray-600 max-w-[140px] truncate">
                {{ event.location }}
              </td>
              <td class="px-5 py-4 text-gray-600 whitespace-nowrap">
                {{ event.eventType }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="capacityClass(event)" class="font-bold">
                  {{ event.ticketsSold || 0 }}/{{ event.TicketQuantity || 0 }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span
                  :class="statusBadgeClass(event.status)"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                >
                  {{ event.status }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <button
                  @click="openEdit(event)"
                  :disabled="isEditDisabled(event.status)"
                  :class="[
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition duration-200',
                    isEditDisabled(event.status)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-sm',
                  ]"
                >
                  <Icon name="solar:pen-bold" />
                  Edit
                </button>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <button
                  @click="removeEvent(event._id)"
                  class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 hover:shadow-sm transition duration-200"
                >
                  <Icon name="vaadin:close" />
                  Delete
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- ───────────────────────────────────────────
         EDIT MODAL
    ─────────────────────────────────────────────── -->
    <Transition name="modal">
      <div
        v-if="editingEvent"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          >
            <h3 class="text-lg font-bold text-gray-900">Edit Event</h3>
            <button
              @click="closeEdit"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
              <Icon name="vaadin:close" class="text-sm" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 grid gap-4 md:grid-cols-2">
            <!-- Title -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1"
                >Event Title</label
              >
              <input
                v-model="editForm.title"
                placeholder="Enter event title"
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition"
              />
            </div>

            <!-- Date -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                v-model="editForm.date"
                type="date"
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition"
              />
            </div>

            <!-- Location -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1"
                >Location</label
              >
              <input
                v-model="editForm.location"
                placeholder="Enter location"
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition"
              />
            </div>

            <!-- Status -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1"
                >Event Status</label
              >
              <select
                v-model="editForm.status"
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition"
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
              <label class="text-sm font-medium text-gray-700 mb-1"
                >Event Type</label
              >
              <select
                v-model="editForm.eventType"
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition"
              >
                <option value="other">📌 Select Event Type</option>
                <option value="Entertainment">🎵 Entertainment</option>
                <option value="Arts & Culture">🎨 Arts & Culture</option>
                <option value="Tech & Business">💻 Tech & Business</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <!-- Description -->
            <div class="flex flex-col col-span-full">
              <label class="text-sm font-medium text-gray-700 mb-1"
                >Description</label
              >
              <textarea
                v-model="editForm.description"
                placeholder="Event description..."
                class="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b] outline-none transition h-28 resize-none"
              ></textarea>
            </div>

            <!-- Custom Tickets -->
            <div class="flex flex-col col-span-full">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700"
                  >🎟️ Ticket Types</label
                >
                <button
                  @click="addTicket"
                  type="button"
                  class="text-sm text-[#9c4e8b] hover:text-[#7c3a6d] font-semibold transition"
                >
                  + Add Ticket
                </button>
              </div>
              <div
                v-for="(ticket, i) in editForm.customTickets"
                :key="i"
                class="flex items-center gap-2 mb-2"
              >
                <input
                  v-model="ticket.name"
                  placeholder="Ticket name"
                  class="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] outline-none"
                />
                <input
                  v-model.number="ticket.price"
                  type="number"
                  min="0"
                  placeholder="Price"
                  class="w-28 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9c4e8b] outline-none"
                />
                <button
                  @click="removeTicket(i)"
                  type="button"
                  class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100"
          >
            <button
              @click="closeEdit"
              class="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              @click="submitUpdate"
              class="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] rounded-lg hover:shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
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
  addTicket,
  removeTicket,
} = updateEvent(events);

// Disable edit for cancelled, completed, live
const isEditDisabled = (status) =>
  ["cancelled", "completed", "live"].includes(status?.toLowerCase());

// Capacity colour
const capacityClass = (event) => {
  if (event.ticketsRemaining === 0) return "text-red-500";
  if (event.ticketsRemaining < 10) return "text-yellow-500";
  return "text-green-600";
};

// Status badge colour map
const statusBadgeClass = (status) => {
  const map = {
    upcoming: "bg-green-100 text-green-700",
    ongoing: "bg-blue-100 text-blue-700",
    live: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-orange-100 text-orange-600",
  };
  return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-500";
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
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
