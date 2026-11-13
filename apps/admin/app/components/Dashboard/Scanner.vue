<template>
  <section class="space-y-5">
    <header
      class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9c4e8b]/10 text-[#9c4e8b]"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" class="text-2xl" />
        </span>
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c4e8b]"
          >
            Entry validation
          </p>
          <h1 class="mt-1 text-xl font-bold text-gray-900">Scan ticket QR</h1>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Scan each ticket once to admit the holder. A ticket is marked used
            immediately and cannot be scanned again.
          </p>
        </div>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
        :class="
          scanning
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-gray-100 text-gray-600'
        "
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="scanning ? 'animate-pulse bg-emerald-500' : 'bg-gray-400'"
        />
        {{ scanning ? "Camera live" : "Camera stopped" }}
      </span>
    </header>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900">Camera scanner</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{
                scanning
                  ? "Point the camera at the ticket QR code."
                  : "Start the camera, then hold the ticket QR inside the frame."
              }}
            </p>
          </div>
          <Icon
            name="material-symbols:camera-outline-rounded"
            class="shrink-0 text-2xl text-gray-300"
          />
        </div>

        <div class="mt-4">
          <label
            id="admin-scan-event-label"
            class="block text-sm font-semibold text-gray-800"
          >
            Event to check in
          </label>
          <div ref="eventPickerRef" class="relative mt-2">
            <button
              id="admin-scan-event"
              type="button"
              class="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left shadow-sm outline-none transition hover:border-[#9c4e8b]/50 focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15 disabled:cursor-not-allowed disabled:bg-gray-50"
              :disabled="eventPickerDisabled"
              :aria-expanded="eventPickerOpen"
              aria-haspopup="listbox"
              aria-labelledby="admin-scan-event-label"
              @click="toggleEventPicker"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#9c4e8b]/10 text-[#9c4e8b]"
              >
                <Icon
                  name="material-symbols:event-available-rounded"
                  class="text-lg"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold text-gray-900">
                  {{
                    selectedEvent?.eventName ||
                    (loadingEvents ? "Loading events..." : "Select an event")
                  }}
                </span>
                <span class="mt-0.5 block truncate text-xs text-gray-500">
                  {{
                    selectedEvent
                      ? eventDateLabel(selectedEvent)
                      : "Choose the event you are checking in"
                  }}
                </span>
              </span>
              <Icon
                name="material-symbols:expand-more-rounded"
                class="shrink-0 text-xl text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': eventPickerOpen }"
              />
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="eventPickerOpen"
                class="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
              >
                <div
                  class="max-h-72 overflow-y-auto p-1.5"
                  role="listbox"
                  aria-labelledby="admin-scan-event-label"
                >
                  <p
                    v-if="loadingEvents"
                    class="px-3 py-4 text-center text-sm text-gray-500"
                  >
                    Loading events...
                  </p>
                  <p
                    v-else-if="eventsError"
                    class="px-3 py-4 text-center text-sm text-red-600"
                  >
                    {{ eventsError }}
                  </p>
                  <p
                    v-else-if="!events.length"
                    class="px-3 py-4 text-center text-sm text-gray-500"
                  >
                    No events available.
                  </p>
                  <button
                    v-for="eventItem in events"
                    :key="eventItem.eventId"
                    type="button"
                    role="option"
                    :aria-selected="eventItem.eventId === selectedEventId"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
                    :class="
                      eventItem.eventId === selectedEventId
                        ? 'bg-[#9c4e8b]/10'
                        : 'hover:bg-gray-50'
                    "
                    @click="chooseEvent(eventItem.eventId)"
                  >
                    <span
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      :class="eventStatusClass(eventItem.status)"
                    >
                      <Icon
                        name="material-symbols:confirmation-number-outline-rounded"
                        class="text-lg"
                      />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span
                        class="block truncate text-sm font-semibold text-gray-900"
                      >
                        {{ eventItem.eventName }}
                      </span>
                      <span
                        class="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500"
                      >
                        <span>{{ eventDateLabel(eventItem) }}</span>
                        <span aria-hidden="true">·</span>
                        <span class="truncate">
                          {{ eventItem.location || "Location TBA" }}
                        </span>
                      </span>
                    </span>
                    <span class="shrink-0 text-right">
                      <span
                        class="block text-xs font-semibold text-gray-700"
                      >
                        {{ eventItem.totalTickets }} tickets
                      </span>
                      <span
                        class="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        :class="eventStatusClass(eventItem.status)"
                      >
                        {{ eventItem.status || "unknown" }}
                      </span>
                    </span>
                    <Icon
                      v-if="eventItem.eventId === selectedEventId"
                      name="material-symbols:check-circle-rounded"
                      class="shrink-0 text-lg text-[#9c4e8b]"
                    />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div
            v-if="selectedEvent"
            class="mt-3 flex flex-wrap items-center gap-2 text-xs"
          >
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600"
            >
              <Icon
                name="material-symbols:calendar-month-rounded"
                class="text-sm"
              />
              {{ eventDateLabel(selectedEvent) }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600"
            >
              <Icon
                name="material-symbols:location-on-rounded"
                class="text-sm"
              />
              {{ selectedEvent.location || "Location TBA" }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-[#9c4e8b]/10 px-2.5 py-1 font-semibold text-[#9c4e8b]"
            >
              <Icon
                name="material-symbols:confirmation-number-rounded"
                class="text-sm"
              />
              {{ selectedEvent.totalTickets }} tickets
            </span>
          </div>
        </div>

        <div
          class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900"
        >
          <div
            id="ticket-qr-reader"
            class="mx-auto min-h-64 w-full max-w-md [&_video]:rounded-xl"
          />
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-[#9c4e8b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7c3a6d] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="starting || scanning || processing || !selectedEventId"
            @click="startScanner"
          >
            <Icon
              :name="
                starting
                  ? 'svg-spinners:90-ring-with-bg'
                  : 'material-symbols:qr-code-scanner-rounded'
              "
              :class="{ 'animate-spin': starting }"
            />
            {{ starting ? "Starting..." : "Start camera" }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!scanning"
            @click="stopScanner"
          >
            Stop camera
          </button>
        </div>

        <p
          v-if="cameraError"
          role="alert"
          class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          {{ cameraError }}
        </p>
        <p class="mt-3 text-xs text-gray-400">
          Camera access requires HTTPS (or localhost) and permission in the
          browser.
        </p>

        <div class="mt-5 border-t border-gray-100 pt-5">
          <h3 class="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="material-symbols:keyboard-rounded" class="text-lg text-gray-400" />
            Manual entry
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            If the camera cannot be used, paste or type the ticket code.
          </p>
          <form class="mt-3 flex flex-col gap-2 sm:flex-row" @submit.prevent="validateCode(manualCode)">
            <label for="ticket-code-input" class="sr-only">Ticket code</label>
            <input
              id="ticket-code-input"
              v-model="manualCode"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              placeholder="TKT-XXXXXXXXXXXXXXXXXXXX"
              class="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 font-mono text-sm text-gray-900 outline-none transition focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15 disabled:bg-gray-50"
              :disabled="processing"
            />
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="processing || !manualCode.trim() || !selectedEventId"
            >
              <Icon name="material-symbols:check-circle-rounded" />
              Validate
            </button>
          </form>
        </div>
      </section>

      <section
        class="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        aria-live="polite"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900">Validation result</h2>
            <p class="mt-1 text-sm text-gray-500">
              The latest scan result appears here.
            </p>
          </div>
          <Icon
            name="material-symbols:history-rounded"
            class="shrink-0 text-2xl text-gray-300"
          />
        </div>

        <div
          class="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border px-5 py-10 text-center"
          :class="resultTheme.panel"
        >
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full"
            :class="resultTheme.badge"
          >
            <Icon
              :name="resultTheme.icon"
              class="text-4xl"
              :class="{ 'animate-spin': processing }"
            />
          </span>
          <h3 class="mt-4 text-lg font-bold" :class="resultTheme.titleClass">
            {{ resultTheme.heading }}
          </h3>
          <p class="mt-1 max-w-sm text-sm" :class="resultTheme.messageClass">
            {{ resultTheme.message }}
          </p>

          <p
            v-if="result.code"
            class="mt-3 max-w-full break-all rounded-lg bg-white/70 px-3 py-1.5 font-mono text-xs text-gray-600"
          >
            {{ result.code }}
          </p>

          <dl
            v-if="result.ticket"
            class="mt-5 grid w-full max-w-sm grid-cols-1 gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-left text-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Holder</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.userName || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Event</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.eventName || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Ticket type</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.ticketType || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Checked in</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ formatDateTime(result.ticket.usedAt) }}
              </dd>
            </div>
          </dl>

          <button
            v-if="result.status !== 'idle' && result.status !== 'checking'"
            type="button"
            class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#9c4e8b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7c3a6d] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="processing"
            @click="scanNext"
          >
            <Icon name="material-symbols:qr-code-scanner-rounded" />
            Scan next ticket
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import useTicketScanner from "~/composables/useTicketScanner";

const {
  events,
  selectedEventId,
  selectedEvent,
  loadingEvents,
  eventsError,
  loadEvents,
  starting,
  scanning,
  processing,
  cameraError,
  manualCode,
  result,
  resultTheme,
  startScanner,
  stopScanner,
  validateCode,
  scanNext,
  formatDateTime,
} = useTicketScanner();

const eventPickerRef = ref(null);
const eventPickerOpen = ref(false);
const eventPickerDisabled = computed(
  () => starting.value || scanning.value || processing.value,
);

const toggleEventPicker = () => {
  if (eventPickerDisabled.value) return;
  eventPickerOpen.value = !eventPickerOpen.value;
};

const chooseEvent = (eventId) => {
  selectedEventId.value = eventId;
  eventPickerOpen.value = false;
};

const eventDateLabel = (eventItem) => {
  const value = eventItem?.eventDate || eventItem?.date;
  if (!value) return "Date TBA";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date TBA"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const eventStatusClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "live":
    case "ongoing":
    case "approved":
    case "upcoming":
      return "bg-emerald-50 text-emerald-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "cancelled":
    case "rejected":
      return "bg-red-50 text-red-700";
    case "completed":
    case "inactive":
    case "archived":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-[#9c4e8b]/10 text-[#9c4e8b]";
  }
};

const handleClickOutside = (event) => {
  if (
    eventPickerOpen.value &&
    eventPickerRef.value &&
    !eventPickerRef.value.contains(event.target)
  ) {
    eventPickerOpen.value = false;
  }
};

const handleEscape = (event) => {
  if (event.key === "Escape") eventPickerOpen.value = false;
};

onMounted(() => {
  loadEvents();
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
});
</script>
