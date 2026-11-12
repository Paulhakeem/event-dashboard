<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
    <div
      class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-neutral-900"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold">Edit Event</h3>
        <button
          @click="closeEdit"
          class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          aria-label="Close"
        >
          <Icon name="mdi:close" />
        </button>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Event Title
          </label>
          <input
            v-model="form.title"
            placeholder="Title"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Start Date
          </label>
          <input
            v-model="form.startDate"
            type="date"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            End Date
          </label>
          <input
            v-model="form.endDate"
            type="date"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Start Time
          </label>
          <input
            v-model="form.startTime"
            type="time"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            End Time
          </label>
          <input
            v-model="form.endTime"
            type="time"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Location
          </label>
          <input
            v-model="form.location"
            placeholder="Location"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Max Tickets Per User
          </label>
          <input
            v-model.number="form.maxTicketsPerUser"
            type="number"
            min="0"
            placeholder="No limit"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Status
          </label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option value="pending">Pending</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Event Type
          </label>
          <select
            v-model="form.eventType"
            class="w-full rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option value="other">Select Event Type</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Arts & Culture">Arts &amp; Culture</option>
            <option value="Tech & Business">Tech &amp; Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-semibold text-gray-500 uppercase">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Description"
            class="w-full resize-none rounded-lg border p-2.5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-xs font-semibold text-gray-500 uppercase">
              Ticket Types
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.freeEntry" type="checkbox" class="h-4 w-4" />
              Free Entry
            </label>
          </div>

          <div class="space-y-2">
            <div
              v-for="(ticket, index) in form.customTickets"
              :key="index"
              class="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_120px_120px_auto] dark:border-neutral-700"
            >
              <div>
                <label class="mb-1 block text-[10px] font-semibold text-gray-500 uppercase">
                  Ticket Name
                </label>
                <input
                  v-model="ticket.name"
                  placeholder="e.g. Regular"
                  class="w-full rounded-lg border p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="mb-1 block text-[10px] font-semibold text-gray-500 uppercase">
                  Price (KES)
                </label>
                <input
                  v-model.number="ticket.price"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="mb-1 block text-[10px] font-semibold text-gray-500 uppercase">
                  Total Tickets
                </label>
                <input
                  v-model.number="ticket.quantity"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                />
              </div>
              <button
                @click="removeTicket(index)"
                type="button"
                class="self-end rounded-lg px-3 py-2 text-lg leading-none text-gray-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove ticket type"
              >
                &times;
              </button>
            </div>
          </div>

          <button
            @click="addTicket"
            type="button"
            class="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            + Add Ticket
          </button>
        </div>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <button @click="closeEdit" class="rounded-lg border px-4 py-2 dark:border-neutral-700">
          Cancel
        </button>
        <button
          @click="submitUpdate"
          class="rounded-lg bg-[#13284b] px-4 py-2 text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  editingEvent: { type: [String, Number], default: null },
  editForm: { type: Object, default: null },
});
const emit = defineEmits(["close", "save"]);
const localEditor = updateEvent();
const form = computed(() => props.editForm || localEditor.editForm.value);

const addTicket = () => {
  if (!Array.isArray(form.value.customTickets)) form.value.customTickets = [];
  form.value.customTickets.push({ name: "", price: 0, quantity: 0 });
};

const removeTicket = (index) => {
  form.value.customTickets.splice(index, 1);
};

const closeEdit = () =>
  props.editForm ? emit("close") : localEditor.closeEdit();
const submitUpdate = () =>
  props.editForm ? emit("save") : localEditor.submitUpdate();
</script>
