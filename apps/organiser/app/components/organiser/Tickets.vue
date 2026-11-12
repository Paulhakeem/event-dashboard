<template>
  <section class="space-y-5">
    <header
      class="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c4e8b] dark:text-[#d78ac5]">
          Ticket management
        </p>
        <h1 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          {{ selectedEvent?.eventName || "Tickets by event" }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {{
            selectedEvent
              ? "View ticket holders and check-in status for this event."
              : "Select one of your events to track its tickets."
          }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="selectedEvent"
          type="button"
          class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          @click="selectEvent('')"
        >
          All events
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          :disabled="loading"
          @click="loadTickets(selectedEventId)"
        >
          <Icon
            name="material-symbols:refresh-rounded"
            :class="{ 'animate-spin': loading }"
          />
          Refresh
        </button>
      </div>
    </header>

    <p
      v-if="errorMessage"
      role="alert"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="loading && !events.length"
      class="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
      aria-live="polite"
    >
      Loading your event tickets...
    </div>

    <template v-else-if="!selectedEvent">
      <div
        v-if="events.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <button
          v-for="eventItem in events"
          :key="eventItem.eventId"
          type="button"
          class="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#9c4e8b]/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9c4e8b]/30 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none dark:hover:border-[#d78ac5]/40 dark:hover:shadow-none"
          @click="selectEvent(eventItem.eventId)"
        >
          <div class="flex items-start gap-3">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9c4e8b]/10 text-[#9c4e8b] dark:bg-[#d78ac5]/15 dark:text-[#d78ac5]"
            >
              <Icon
                name="material-symbols:confirmation-number-outline-rounded"
                class="text-xl"
              />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="truncate font-bold text-gray-900 group-hover:text-[#9c4e8b] dark:text-white dark:group-hover:text-[#e3a9d2]">
                {{ eventItem.eventName }}
              </h2>
              <p class="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">
                {{ eventItem.location || "Location not available" }}
              </p>
              <p class="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                {{ formatDate(eventItem.eventDate) }}
              </p>
            </div>
            <Icon
              name="material-symbols:arrow-forward-rounded"
              class="mt-1 text-lg text-gray-300 group-hover:text-[#9c4e8b] dark:text-neutral-600 dark:group-hover:text-[#d78ac5]"
            />
          </div>
          <div class="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 dark:border-neutral-700">
            <div>
              <p class="text-xl font-bold text-gray-900 tabular-nums dark:text-white">
                {{ eventItem.totalTickets }}
              </p>
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Tickets</p>
            </div>
            <div>
              <p class="text-xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                {{ eventItem.activeTickets }}
              </p>
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Available</p>
            </div>
            <div>
              <p class="text-xl font-bold text-gray-700 tabular-nums dark:text-neutral-200">
                {{ eventItem.usedTickets }}
              </p>
              <p class="text-[11px] text-gray-500 dark:text-neutral-400">Checked in</p>
            </div>
          </div>
        </button>
      </div>

      <div
        v-else-if="!loading"
        class="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-neutral-700 dark:bg-neutral-900"
      >
        <Icon
          name="material-symbols:confirmation-number-outline-rounded"
          class="text-3xl text-[#9c4e8b] dark:text-[#d78ac5]"
        />
        <h2 class="mt-3 font-semibold text-gray-800 dark:text-white">No events to track yet</h2>
        <p class="mt-1 max-w-sm text-sm text-gray-500 dark:text-neutral-400">
          Tickets for events you create will appear here after they are booked.
        </p>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="summary in ticketSummary"
          :key="summary.label"
          class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none"
        >
          <p class="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
            {{ summary.label }}
          </p>
          <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ summary.value }}</p>
        </div>
      </div>

      <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
        <div
          class="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Ticket holders</h2>
            <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              {{ visibleTickets.length }} of {{ tickets.length }} tickets
            </p>
          </div>
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
            Check-in status
            <select
              v-model="statusFilter"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#9c4e8b] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">All tickets</option>
              <option value="active">Not checked in</option>
              <option value="used">Checked in</option>
            </select>
          </label>
        </div>

        <div v-if="loading" class="p-8 text-center text-sm text-gray-500 dark:text-neutral-400">
          Loading ticket holders...
        </div>
        <div
          v-else-if="visibleTickets.length"
          class="divide-y divide-gray-100 dark:divide-neutral-700"
        >
          <article
            v-for="ticket in visibleTickets"
            :key="ticket._id"
            class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="min-w-0">
              <p class="truncate font-semibold text-gray-900 dark:text-white">
                {{ ticket.holderName }}
              </p>
              <p class="truncate text-sm text-gray-500 dark:text-neutral-400">
                {{ ticket.holderEmail || "No email available" }}
              </p>
              <p class="mt-1 font-mono text-xs text-gray-400 dark:text-neutral-500">
                {{ ticket.ticketCode }}
              </p>
            </div>
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div class="text-left sm:text-right">
                <p class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                  {{ ticket.ticketType }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  {{ formatAmount(ticket.amount) }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  ticket.used
                    ? 'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-200'
                    : ticket.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                "
              >
                {{ ticket.used ? "Checked in" : ticket.status }}
              </span>
            </div>
          </article>
        </div>
        <div v-else class="px-5 py-12 text-center text-sm text-gray-500 dark:text-neutral-400">
          {{ tickets.length ? "No tickets match this status." : "No tickets booked for this event yet." }}
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const { token } = useAuth();
const events = ref([]);
const tickets = ref([]);
const selectedEventId = ref("");
const loading = ref(false);
const errorMessage = ref("");
const statusFilter = ref("all");

const selectedEvent = computed(
  () => events.value.find((item) => item.eventId === selectedEventId.value) || null,
);
const visibleTickets = computed(() => {
  if (statusFilter.value === "used") {
    return tickets.value.filter((ticket) => ticket.used);
  }
  if (statusFilter.value === "active") {
    return tickets.value.filter(
      (ticket) => !ticket.used && ticket.status === "active",
    );
  }
  return tickets.value;
});
const ticketSummary = computed(() => [
  { label: "Total tickets", value: selectedEvent.value?.totalTickets || 0 },
  { label: "Not checked in", value: selectedEvent.value?.activeTickets || 0 },
  { label: "Checked in", value: selectedEvent.value?.usedTickets || 0 },
  { label: "Ticket revenue", value: formatAmount(selectedEvent.value?.totalAmount) },
]);

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not set"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatAmount(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

async function loadTickets(eventId = "") {
  loading.value = true;
  errorMessage.value = "";
  try {
    const query = eventId ? `?eventId=${encodeURIComponent(eventId)}` : "";
    const response = await $fetch(`/api/organiser/tickets${query}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    events.value = response.events || [];
    tickets.value = response.tickets || [];
  } catch (error) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.message ||
      "Failed to load tickets.";
  } finally {
    loading.value = false;
  }
}

function selectEvent(eventId) {
  selectedEventId.value = eventId;
  statusFilter.value = "all";
  loadTickets(eventId);
}

onMounted(() => loadTickets());
</script>
