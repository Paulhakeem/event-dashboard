<template>
  <section class="space-y-5">
    <header
      class="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <button
          v-if="selectedEvent"
          type="button"
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-[#9c4e8b]/30 hover:bg-[#9c4e8b]/5 hover:text-[#9c4e8b]"
          aria-label="Back to all events"
          @click="clearSelectedEvent"
        >
          <Icon name="material-symbols:arrow-back-rounded" class="text-xl" />
        </button>
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c4e8b]"
          >
            Ticket management
          </p>
          <h1 class="mt-1 text-xl font-bold text-gray-900">
            {{ selectedEvent ? selectedEvent.eventName : "Tickets by event" }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{
              selectedEvent
                ? "All ticket holders and ticket details for this event."
                : "Select an event to view its tickets and amounts."
            }}
          </p>
          <p
            v-if="selectedEvent"
            class="mt-2 font-mono text-[11px] text-gray-400"
          >
            Event ID: {{ selectedEvent.eventId }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#9c4e8b]/30 hover:bg-[#9c4e8b]/5 hover:text-[#9c4e8b] disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="loading || ticketsLoading"
        @click="selectedEvent ? loadEventTickets(selectedEvent) : loadEvents()"
      >
        <Icon
          name="material-symbols:refresh-rounded"
          :class="{ 'animate-spin': loading || ticketsLoading }"
        />
        Refresh
      </button>
    </header>

    <div
      v-if="errorMessage"
      role="alert"
      class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <Icon
        name="material-symbols:error-outline-rounded"
        class="mt-0.5 shrink-0 text-lg"
      />
      <div class="flex-1">{{ errorMessage }}</div>
      <button
        type="button"
        class="font-semibold underline underline-offset-2"
        @click="selectedEvent ? loadEventTickets(selectedEvent) : loadEvents()"
      >
        Retry
      </button>
    </div>

    <template v-if="!selectedEvent">
      <label class="relative block max-w-md">
        <Icon
          name="material-symbols:search-rounded"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search events..."
          class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15"
          aria-label="Search events"
        />
      </label>

      <div
        v-if="loading"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Loading booked events"
      >
        <div
          v-for="item in 6"
          :key="item"
          class="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div class="h-4 w-2/3 rounded bg-gray-200"></div>
          <div class="mt-5 h-9 w-1/3 rounded bg-gray-200"></div>
          <div class="mt-3 h-3 w-1/2 rounded bg-gray-100"></div>
        </div>
      </div>

      <div
        v-else-if="filteredEvents.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <button
          v-for="eventItem in filteredEvents"
          :key="eventItem.eventId"
          type="button"
          class="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#9c4e8b]/30 hover:shadow-lg hover:shadow-[#9c4e8b]/5 focus:outline-none focus:ring-2 focus:ring-[#9c4e8b]/30"
          @click="loadEventTickets(eventItem)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9c4e8b]/10 text-[#9c4e8b] transition group-hover:bg-[#9c4e8b] group-hover:text-white"
              >
                <Icon
                  name="material-symbols:confirmation-number-outline-rounded"
                  class="text-xl"
                />
              </span>
              <div class="min-w-0">
                <h2
                  class="truncate font-bold text-gray-900 group-hover:text-[#9c4e8b]"
                >
                  {{ eventItem.eventName }}
                </h2>
                <p class="mt-1 truncate text-xs text-gray-500">
                  {{ eventItem.location || "Location not available" }}
                </p>
              </div>
            </div>
            <Icon
              name="material-symbols:arrow-forward-rounded"
              class="mt-1 shrink-0 text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#9c4e8b]"
            />
          </div>

          <div class="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
            <div>
              <p
                class="text-3xl font-bold tracking-tight text-gray-900 tabular-nums"
              >
                {{ eventItem.totalTickets }}
              </p>
              <p class="mt-1 text-xs font-medium text-gray-500">
                {{ eventItem.totalTickets === 1 ? "ticket" : "tickets" }} booked
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-700">
                {{ formatAmount(eventItem.totalAmount) }}
              </p>
              <p class="mt-1 text-xs text-gray-400">Total amount</p>
              <p class="mt-1 text-xs text-gray-400">
                {{ formatDate(eventItem.eventDate) }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 text-[11px] font-medium">
            <span
              class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700"
            >
              {{ eventItem.activeTickets }} active
            </span>
            <span
              v-if="eventItem.inactiveTickets"
              class="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600"
            >
              {{ eventItem.inactiveTickets }} inactive
            </span>
          </div>
        </button>
      </div>

      <div
        v-else
        class="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center"
      >
        <span
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9c4e8b]/10 text-[#9c4e8b]"
        >
          <Icon
            name="material-symbols:confirmation-number-outline-rounded"
            class="text-2xl"
          />
        </span>
        <h2 class="mt-4 font-semibold text-gray-800">
          {{ searchQuery ? "No matching events" : "No tickets yet" }}
        </h2>
        <p class="mt-1 max-w-sm text-sm text-gray-500">
          {{
            searchQuery
              ? "Try another event name."
              : "Booked events will appear here once tickets have been issued."
          }}
        </p>
      </div>
    </template>

    <template v-else>
      <div
        class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Event ticket summary"
      >
        <div
          v-for="summary in ticketSummary"
          :key="summary.label"
          class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
          >
            {{ summary.label }}
          </p>
          <p class="mt-1 text-xl font-bold text-gray-900">
            {{ summary.value }}
          </p>
        </div>
      </div>

      <div
        v-if="ticketsLoading"
        class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        aria-label="Loading event tickets"
      >
        <div class="animate-pulse space-y-4 p-5">
          <div v-for="item in 6" :key="item" class="flex gap-4">
            <div class="h-9 w-9 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 w-1/3 rounded bg-gray-200"></div>
              <div class="h-3 w-1/2 rounded bg-gray-100"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="tickets.length"
        class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
      >
        <div
          class="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 class="font-semibold text-gray-900">Event tickets</h2>
          <p class="text-xs text-gray-500">
            {{ tickets.length }}
            {{ tickets.length === 1 ? "ticket" : "tickets" }}
          </p>
        </div>

        <div class="divide-y divide-gray-100 md:hidden">
          <article
            v-for="ticket in tickets"
            :key="ticket._id"
            class="space-y-3 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total amount
                </p>
                <p class="mt-1 text-lg font-bold text-gray-900">
                  {{ formatAmount(ticket.amount) }}
                </p>
              </div>
              <div class="flex shrink-0 flex-col items-end gap-2">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
                  :class="statusClasses(ticketStatus(ticket))"
                >
                  {{ ticketStatus(ticket) }}
                </span>
                <label
                  class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600"
                  :class="{ 'cursor-not-allowed opacity-50': !canMarkUsed(ticket) }"
                >
                  <input
                    type="checkbox"
                    :checked="ticket.used"
                    :disabled="!canMarkUsed(ticket)"
                    :aria-label="`Mark ticket ${ticket.ticketCode} as used`"
                    class="h-4 w-4 rounded border-gray-300 accent-[#9c4e8b] focus:ring-[#9c4e8b]"
                    @change="markTicketUsed(ticket, $event.target.checked)"
                  />
                  Used
                </label>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <p>
                Type:
                <span class="font-medium text-gray-800">{{
                  ticket.ticketType
                }}</span>
              </p>
              <p>
                Code:
                <span class="font-mono font-medium text-gray-800">{{
                  ticket.ticketCode
                }}</span>
              </p>
              <p class="col-span-2 break-all">
                Ticket ID: <span class="font-mono text-gray-700">{{ ticket._id }}</span>
              </p>
              <p class="col-span-2">
                Event: <span class="font-medium text-gray-800">{{ ticket.eventName }}</span>
              </p>
              <p class="col-span-2 break-all">
                Event ID: <span class="font-mono text-gray-700">{{ ticket.eventId }}</span>
              </p>
              <p class="col-span-2 break-all">
                User ID:
                <span class="font-mono text-gray-700">{{
                  ticket.userId?._id || ticket.userId || `Guest (${ticket.userEmail})`
                }}</span>
              </p>
              <p class="col-span-2 break-all">
                Booking ID:
                <span class="font-mono text-gray-700">{{ ticket.bookingId }}</span>
              </p>
              <p class="col-span-2">
                Created: <span class="font-medium text-gray-800">{{ formatDateTime(ticket.createdAt) }}</span>
              </p>
              <p class="col-span-2">
                Updated: <span class="font-medium text-gray-800">{{ formatDateTime(ticket.updatedAt) }}</span>
              </p>
              <p class="col-span-2">
                Used at: <span class="font-medium text-gray-800">{{ formatDateTime(ticket.usedAt) }}</span>
              </p>
            </div>
          </article>
        </div>

        <div class="hidden overflow-x-auto md:block">
          <table class="min-w-full divide-y divide-gray-100 text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th scope="col" class="px-5 py-3 font-semibold">Total amount</th>
                <th scope="col" class="px-5 py-3 font-semibold">Ticket</th>
                <th scope="col" class="px-5 py-3 font-semibold">Booking</th>
                <th scope="col" class="px-5 py-3 font-semibold">Used</th>
                <th scope="col" class="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="ticket in tickets"
                :key="ticket._id"
                class="transition hover:bg-gray-50/70"
              >
                <td class="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900">
                  {{ formatAmount(ticket.amount) }}
                </td>
                <td class="px-5 py-3.5">
                  <p class="font-medium text-gray-800">{{ ticket.ticketType }}</p>
                  <p class="mt-0.5 font-mono text-xs text-gray-400">
                    {{ ticket.ticketCode }}
                  </p>
                  <p class="mt-0.5 font-mono text-[10px] text-gray-400">
                    ID: {{ ticket._id }}
                  </p>
                </td>
                <td class="max-w-64 px-5 py-3.5 text-xs text-gray-600">
                  <p>Event: {{ ticket.eventName }}</p>
                  <p>Booking: <span class="break-all font-mono">{{ ticket.bookingId }}</span></p>
                  <p class="mt-1">Created: {{ formatDateTime(ticket.createdAt) }}</p>
                  <p class="mt-1">Updated: {{ formatDateTime(ticket.updatedAt) }}</p>
                  <p class="mt-1">Event ID: <span class="break-all font-mono">{{ ticket.eventId }}</span></p>
                </td>
                <td class="px-5 py-3.5">
                  <label
                    class="inline-flex items-center gap-2 text-xs font-medium text-gray-600"
                    :class="{ 'cursor-not-allowed opacity-50': !canMarkUsed(ticket) }"
                  >
                    <input
                      type="checkbox"
                      :checked="ticket.used"
                      :disabled="!canMarkUsed(ticket)"
                      :aria-label="`Mark ticket ${ticket.ticketCode} as used`"
                      class="h-4 w-4 rounded border-gray-300 accent-[#9c4e8b] focus:ring-[#9c4e8b]"
                      @change="markTicketUsed(ticket, $event.target.checked)"
                    />
                    <span>
                      {{ ticket.used ? "Used" : "Mark used" }}
                      <span class="block text-[10px] text-gray-400">
                        {{ formatDateTime(ticket.usedAt) }}
                      </span>
                    </span>
                  </label>
                </td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
                    :class="statusClasses(ticketStatus(ticket))"
                  >
                    {{ ticketStatus(ticket) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-else-if="!ticketsLoading"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"
      >
        <p class="font-semibold text-gray-800">No tickets found for this event</p>
        <p class="mt-1 text-sm text-gray-500">
          There are currently no issued tickets to display.
        </p>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const { token } = useAuth();
const events = ref([]);
const tickets = ref([]);
const selectedEvent = ref(null);
const searchQuery = ref("");
const loading = ref(false);
const ticketsLoading = ref(false);
const errorMessage = ref("");

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return events.value;
  return events.value.filter((item) =>
    item.eventName.toLowerCase().includes(query),
  );
});

const ticketSummary = computed(() => [
  { label: "Total tickets", value: tickets.value.length },
  {
    label: "Active",
    value: tickets.value.filter((ticket) => ticketStatus(ticket) === "active")
      .length,
  },
  {
    label: "Inactive",
    value: tickets.value.filter((ticket) => ticketStatus(ticket) === "inactive")
      .length,
  },
  {
    label: "Used",
    value: tickets.value.filter((ticket) => ticket.used).length,
  },
]);

const requestHeaders = computed(() => ({
  Authorization: `Bearer ${token.value}`,
}));

function getErrorMessage(error, fallback) {
  return (
    error?.data?.statusMessage ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
}

async function loadEvents() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const result = await $fetch("/api/admin/tickets", {
      headers: requestHeaders.value,
    });
    events.value = result.events || [];
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "Failed to load ticket events.");
  } finally {
    loading.value = false;
  }
}

async function loadEventTickets(eventItem) {
  selectedEvent.value = eventItem;
  ticketsLoading.value = true;
  tickets.value = [];
  errorMessage.value = "";
  try {
    const result = await $fetch("/api/admin/tickets", {
      query: { eventId: eventItem.eventId },
      headers: requestHeaders.value,
    });
    tickets.value = result.tickets || [];
    selectedEvent.value = {
      ...eventItem,
      eventName: result.event?.title || eventItem.eventName,
      eventDate: result.event?.date || eventItem.eventDate,
      location: result.event?.location || eventItem.location,
      eventId: result.event?._id || eventItem.eventId,
      eventExpired: result.eventExpired,
    };
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "Failed to load event tickets.");
  } finally {
    ticketsLoading.value = false;
  }
}

function clearSelectedEvent() {
  selectedEvent.value = null;
  tickets.value = [];
  errorMessage.value = "";
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `KES ${amount.toLocaleString()}`;
}

function ticketStatus(ticket) {
  if (ticket.used) return "inactive";
  if (
    selectedEvent.value?.eventExpired ||
    (selectedEvent.value?.eventDate &&
      new Date(selectedEvent.value.eventDate) < new Date())
  ) {
    return "inactive";
  }
  return ticket.status || "unknown";
}

function statusClasses(status) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "inactive") return "bg-gray-100 text-gray-600";
  return "bg-amber-50 text-amber-700";
}

function canMarkUsed(ticket) {
  return (
    ticketStatus(ticket) === "active" &&
    !ticket.used &&
    !updatingTicketIds.value.includes(String(ticket._id))
  );
}

const updatingTicketIds = ref([]);

async function markTicketUsed(ticket, checked) {
  if (!checked || !canMarkUsed(ticket)) return;
  const ticketId = String(ticket._id);
  updatingTicketIds.value = [...updatingTicketIds.value, ticketId];
  errorMessage.value = "";
  try {
    const result = await $fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: requestHeaders.value,
      body: { ticketId, used: true },
    });
    Object.assign(ticket, result.ticket);
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      "Failed to mark this ticket as used.",
    );
  } finally {
    updatingTicketIds.value = updatingTicketIds.value.filter(
      (id) => id !== ticketId,
    );
  }
}

function initials(name, email) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length) return parts.map((part) => part[0]).join("").slice(0, 2);
  return String(email || "?").slice(0, 1).toUpperCase();
}

onMounted(loadEvents);
</script>
