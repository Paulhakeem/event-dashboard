<template>
  <div class="flex flex-col gap-4 font-[system-ui]">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="rounded-xl bg-white border border-gray-100 p-4">
        <p class="text-xs text-gray-400">Total events</p>
        <p class="text-xl font-bold text-gray-900">{{ events.length }}</p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4">
        <p class="text-xs text-gray-400">Bookings</p>
        <p class="text-xl font-bold text-gray-900">{{ totalBookings }}</p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4">
        <p class="text-xs text-gray-400">Revenue</p>
        <p class="text-xl font-bold text-gray-900">
          KSH {{ totalRevenue.toLocaleString() }}
        </p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4">
        <p class="text-xs text-gray-400">Pending review</p>
        <p class="text-xl font-bold text-orange-600">{{ pendingCount }}</p>
      </div>
    </div>
    <div
      class="flex flex-col sm:flex-row gap-3 rounded-xl bg-white border border-gray-100 p-4"
    >
      <input
        v-model="searchQuery"
        placeholder="Search events"
        class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
      />
      <select
        v-model="organiserFilter"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:w-48 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
      >
        <option value="all">All organisers</option>
        <option
          v-for="organiser in organisers"
          :key="organiser"
          :value="organiser"
        >
          {{ organiser }}
        </option>
      </select>
      <select
        v-model="statusFilter"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:w-48 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
      >
        <option value="all">All statuses</option>
        <option v-for="status in eventStatuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>
    <!-- ── MOBILE CARDS ──────────────────────────────── -->
    <div class="block lg:hidden space-y-3">
      <!-- Skeleton -->
      <template v-if="loading">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3 shadow-sm"
        >
          <div class="flex justify-between">
            <div class="h-4 bg-gray-100 rounded-full w-1/2"></div>
            <div class="h-5 bg-gray-100 rounded-full w-16"></div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="h-3 bg-gray-100 rounded-full w-full"></div>
            <div class="h-3 bg-gray-100 rounded-full w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded-full w-2/3"></div>
            <div class="h-3 bg-gray-100 rounded-full w-1/2"></div>
          </div>
          <div class="flex gap-2 pt-1">
            <div class="h-9 bg-gray-100 rounded-xl flex-1"></div>
            <div class="h-9 bg-gray-100 rounded-xl flex-1"></div>
          </div>
        </div>
      </template>

      <!-- Empty -->
      <div
        v-else-if="filteredEvents.length === 0"
        class="bg-white rounded-2xl border border-dashed border-gray-200 py-14 text-center px-4"
      >
        <div
          class="w-14 h-14 bg-[#f5eef9] rounded-2xl flex items-center justify-center mx-auto mb-3"
        >
          <Icon
            name="material-symbols:event-busy"
            class="text-2xl text-[#9c4e8b]"
          />
        </div>
        <p class="text-gray-500 text-sm font-medium">No events found</p>
        <p class="text-gray-400 text-xs mt-1">
          Events will appear here once created.
        </p>
      </div>

      <!-- Cards -->
      <template v-else>
        <div
          v-for="event in filteredEvents"
          :key="event._id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 hover:shadow-md hover:border-[#9c4e8b]/20 transition-all duration-200"
        >
          <!-- Title + status -->
          <div class="flex items-start justify-between gap-2">
            <p
              class="font-semibold text-gray-900 text-sm leading-snug capitalize line-clamp-2 flex-1"
            >
              {{ event.title }}
            </p>
            <span
              :class="statusBadgeClass(event.status)"
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
            >
              {{ event.status }}
            </span>
          </div>

          <!-- Meta grid -->
          <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-500">
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:calendar-today"
                class="text-[#9c4e8b] flex-shrink-0 text-sm"
              />
              {{
                new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            </div>
            <div class="flex items-center gap-1.5 min-w-0">
              <Icon
                name="material-symbols:location-on"
                class="text-[#9c4e8b] flex-shrink-0 text-sm"
              />
              <span class="truncate">{{ event.location }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:category"
                class="text-[#9c4e8b] flex-shrink-0 text-sm"
              />
              {{ event.eventType }}
            </div>
            <div class="flex items-center gap-1.5">
              <Icon
                name="material-symbols:confirmation-number"
                class="text-[#9c4e8b] flex-shrink-0 text-sm"
              />
              <span :class="capacityClass(event)" class="font-semibold">
                {{ event.ticketsSold || 0 }}/{{ event.TicketQuantity || 0 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="grid gap-2 pt-1"
            :class="event.status === 'pending' ? 'grid-cols-2' : 'grid-cols-2'"
          >
            <button
              @click="openEdit(event)"
              :disabled="isEditDisabled(event.status)"
              :class="[
                'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                isEditDisabled(event.status)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#3b82f6] text-white hover:bg-blue-600 active:scale-95 shadow-sm',
              ]"
            >
              <Icon name="solar:pen-bold" class="text-sm" />
              Edit
            </button>
            <button
              @click="removeEvent(event._id)"
              class="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <Icon name="vaadin:close" class="text-sm" />
              Delete
            </button>
            <button
              v-if="event.status === 'pending'"
              @click="moderateEvent(event, 'approve')"
              class="flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-semibold bg-green-500 text-white hover:bg-green-600 active:scale-95 transition-all duration-200 shadow-sm"
            >
              Approve
            </button>
            <button
              v-if="event.status === 'pending'"
              @click="moderateEvent(event, 'reject')"
              class="flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-sm"
            >
              Reject
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- ── DESKTOP TABLE ──────────────────────────────── -->
    <div
      class="hidden lg:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm"
    >
      <div class="max-h-[70vh] overflow-y-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="sticky top-0 z-10">
            <tr class="bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d]">
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Event
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Date
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Location
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Type
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Capacity
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Organiser
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Performance
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Moderation
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Edit
              </th>
              <th
                class="px-5 py-4 text-white/90 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <!-- Skeleton -->
            <template v-if="loading">
              <tr v-for="n in 5" :key="n" class="animate-pulse">
                <td v-for="col in 11" :key="col" class="px-5 py-4">
                  <div
                    class="h-3 bg-gray-100 rounded-full"
                    :class="col === 1 ? 'w-32' : 'w-20'"
                  ></div>
                </td>
              </tr>
            </template>

            <!-- Empty -->
            <tr v-else-if="events.length === 0">
              <td colspan="11" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-14 h-14 bg-[#f5eef9] rounded-2xl flex items-center justify-center"
                  >
                    <Icon
                      name="material-symbols:event-busy"
                      class="text-2xl text-[#9c4e8b]/60"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-600">
                      No events found
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">
                      Events will appear here once created.
                    </p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <template v-else-if="filteredEvents.length">
              <tr
                v-for="event in filteredEvents"
                :key="event._id"
                class="hover:bg-[#f5eef9]/40 transition-colors duration-150 group"
              >
                <td
                  class="px-5 py-4 font-semibold text-gray-900 capitalize max-w-[200px] truncate"
                >
                  {{ event.title }}
                </td>
                <td class="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                  {{
                    new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                </td>
                <td
                  class="px-5 py-4 text-gray-500 max-w-[140px] truncate text-xs"
                >
                  {{ event.location }}
                </td>
                <td class="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                  {{ event.eventType }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span :class="capacityClass(event)" class="font-bold text-xs">
                    {{ event.bookings || event.ticketsSold || 0 }}/{{
                      event.TicketQuantity || 0
                    }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                  {{ event.organiser?.firstName || "-" }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                  {{ event.bookings || 0 }} / KSH
                  {{ (event.revenue || 0).toLocaleString() }}
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
                  <div class="flex gap-1.5">
                    <button
                      v-if="event.status === 'pending'"
                      @click="moderateEvent(event, 'approve')"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      v-if="event.status === 'pending'"
                      @click="moderateEvent(event, 'reject')"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      @click="setStatus(event, 'inactive')"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Inactive
                    </button>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <button
                    @click="openEdit(event)"
                    :disabled="isEditDisabled(event.status)"
                    :class="[
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                      isEditDisabled(event.status)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md',
                    ]"
                  >
                    <Icon name="solar:pen-bold" />
                    Edit
                  </button>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <button
                    @click="removeEvent(event._id)"
                    class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 hover:shadow-md transition-all duration-200"
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
    </div>

    <!-- ── EDIT MODAL ──────────────────────────────────── -->
    <Transition name="modal">
      <div
        v-if="editingEvent"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      >
        <div class="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-gray-100"
          >
            <div>
              <h3 class="text-lg font-bold text-gray-900">Edit Event</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Update event details below
              </p>
            </div>
            <button
              @click="closeEdit"
              class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              aria-label="Close"
            >
              <Icon name="vaadin:close" class="text-sm" />
            </button>
          </div>

          <!-- Modal body -->
          <div
            class="p-4 sm:p-6 grid gap-4 md:grid-cols-2 max-h-[65vh] overflow-y-auto"
          >
            <!-- Title -->
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Event Title</label
              >
              <input
                v-model="editForm.title"
                placeholder="Enter event title"
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>

            <!-- Date -->
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Date</label
              >
              <input
                v-model="editForm.date"
                type="date"
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>

            <!-- Location -->
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Location</label
              >
              <input
                v-model="editForm.location"
                placeholder="Enter location"
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>

            <!-- Status -->
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Status</label
              >
              <select
                v-model="editForm.status"
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
              >
                <option value="upcoming">📅 Upcoming</option>
                <option value="ongoing">🔴 Ongoing</option>
                <option value="completed">✅ Completed</option>
                <option value="pending">⏳ Pending</option>
                <option value="cancelled">❌ Cancelled</option>
                <option value="inactive">⏸ Inactive</option>
                <option value="archived">🗄 Archived</option>
              </select>
            </div>

            <!-- Event type -->
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Event Type</label
              >
              <select
                v-model="editForm.eventType"
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
              >
                <option value="other">📌 Select Event Type</option>
                <option value="Entertainment">🎵 Entertainment</option>
                <option value="Arts & Culture">🎨 Arts & Culture</option>
                <option value="Tech & Business">💻 Tech & Business</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5 col-span-full">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Description</label
              >
              <textarea
                v-model="editForm.description"
                placeholder="Event description..."
                class="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all h-28 resize-none"
              ></textarea>
            </div>

            <!-- Ticket types -->
            <div class="flex flex-col gap-2 col-span-full">
              <div class="flex items-center justify-between">
                <label
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >🎟️ Ticket Types</label
                >
                <button
                  @click="addTicket"
                  type="button"
                  class="text-xs font-semibold text-[#9c4e8b] hover:text-[#7c3a6d] flex items-center gap-1 transition-colors"
                >
                  + Add Ticket
                </button>
              </div>
              <div
                v-for="(ticket, i) in editForm.customTickets"
                :key="i"
                class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  v-model="ticket.name"
                  placeholder="Ticket name"
                  class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
                />
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="ticket.price"
                    type="number"
                    min="0"
                    placeholder="Price"
                    class="flex-1 sm:w-28 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/30 focus:border-[#9c4e8b] outline-none transition-all"
                  />
                  <button
                    @click="removeTicket(i)"
                    type="button"
                    class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all text-lg leading-none flex-shrink-0"
                    aria-label="Remove ticket type"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div
            class="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-100"
          >
            <button
              @click="closeEdit"
              class="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="submitUpdate"
              class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] rounded-xl hover:shadow-lg hover:shadow-[#9c4e8b]/25 transition-all duration-200"
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
const { token } = useAuth();
const events = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const organiserFilter = ref("all");
const statusFilter = ref("all");
const eventStatuses = [
  "upcoming",
  "ongoing",
  "live",
  "completed",
  "pending",
  "cancelled",
  "inactive",
  "archived",
];

const loadEvents = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/admin/events", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    events.value = response.events || [];
  } catch (error) {
    window.alert(error?.data?.statusMessage || "Unable to load events");
  } finally {
    loading.value = false;
  }
};
onMounted(loadEvents);

const { editingEvent, editForm, openEdit, closeEdit, addTicket, removeTicket } =
  updateEvent(events);

const filteredEvents = computed(() =>
  events.value.filter((event) => {
    const query = searchQuery.value.trim().toLowerCase();
    const organiser =
      `${event.organiser?.firstName || ""} ${event.organiser?.lastName || ""}`.trim();
    return (
      (!query || event.title?.toLowerCase().includes(query)) &&
      (organiserFilter.value === "all" ||
        organiser === organiserFilter.value) &&
      (statusFilter.value === "all" || event.status === statusFilter.value)
    );
  }),
);
const organisers = computed(() => [
  ...new Set(
    events.value
      .map((event) =>
        `${event.organiser?.firstName || ""} ${event.organiser?.lastName || ""}`.trim(),
      )
      .filter(Boolean),
  ),
]);
const totalBookings = computed(() =>
  events.value.reduce((sum, event) => sum + (event.bookings || 0), 0),
);
const totalRevenue = computed(() =>
  events.value.reduce((sum, event) => sum + (event.revenue || 0), 0),
);
const pendingCount = computed(
  () => events.value.filter((event) => event.status === "pending").length,
);

const mutateEvent = async (event, action, update = {}) => {
  try {
    const response = await $fetch("/api/admin/events", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { id: event._id, action, update },
    });
    const index = events.value.findIndex((item) => item._id === event._id);
    if (index !== -1 && response.updatedEvent)
      events.value[index] = {
        ...events.value[index],
        ...response.updatedEvent,
      };
    return true;
  } catch (error) {
    window.alert(error?.data?.statusMessage || "Unable to update event");
    return false;
  }
};
const removeEvent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this event?")) return;
  try {
    await $fetch("/api/admin/events", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { id },
    });
    events.value = events.value.filter((item) => item._id !== id);
  } catch (error) {
    window.alert(error?.data?.statusMessage || "Unable to delete event");
  }
};
const moderateEvent = (event, action) => mutateEvent(event, action);
const setStatus = (event, status) => mutateEvent(event, "status", { status });
const submitUpdate = async () => {
  if (
    await mutateEvent(
      events.value.find((event) => event._id === editingEvent.value),
      "update",
      { ...editForm.value },
    )
  )
    closeEdit();
};

const isEditDisabled = () => false;

const capacityClass = (event) => {
  if (event.ticketsRemaining === 0) return "text-red-500";
  if (event.ticketsRemaining < 10) return "text-yellow-500";
  return "text-green-600";
};

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
  transform: translateY(-10px) scale(0.97);
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
  transform: translateY(-10px) scale(0.97);
}
</style>
