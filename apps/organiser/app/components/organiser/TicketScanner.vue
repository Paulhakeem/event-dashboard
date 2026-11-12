<template>
  <section class="space-y-5">
    <header
      class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9c4e8b]/10 text-[#9c4e8b] dark:bg-[#d78ac5]/15 dark:text-[#d78ac5]"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" class="text-2xl" />
        </span>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c4e8b] dark:text-[#d78ac5]">
            Entry validation
          </p>
          <h1 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">Scan event tickets</h1>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-neutral-400">
            Only tickets for events you created can be checked in.
          </p>
        </div>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
        :class="scanning ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'"
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="scanning ? 'animate-pulse bg-emerald-500' : 'bg-gray-400 dark:bg-neutral-500'"
        />
        {{ scanning ? "Camera live" : "Camera stopped" }}
      </span>
    </header>

    <p
      v-if="eventsError"
      role="alert"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      {{ eventsError }}
      <button class="ml-2 font-semibold underline" type="button" @click="loadEvents">
        Retry
      </button>
    </p>

    <div
      v-if="loadingEvents"
      class="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
    >
      Loading your events...
    </div>
    <div
      v-else-if="!events.length"
      class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Icon name="material-symbols:event-busy-rounded" class="text-3xl text-gray-400 dark:text-neutral-500" />
      <h2 class="mt-3 font-semibold text-gray-800 dark:text-white">No events available</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
        Create an event before scanning its tickets.
      </p>
    </div>
    <div v-else class="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none sm:p-5">
        <label for="scan-event" class="block text-sm font-semibold text-gray-800 dark:text-neutral-100">
          Event to check in
        </label>
        <select
          id="scan-event"
          v-model="selectedEventId"
          class="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15 disabled:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:disabled:bg-neutral-800"
          :disabled="starting || scanning || processing"
        >
          <option
            v-for="eventItem in events"
            :key="eventItem.eventId"
            :value="eventItem.eventId"
          >
            {{ eventItem.eventName }}
          </option>
        </select>
        <p v-if="selectedEvent" class="mt-2 text-xs text-gray-500 dark:text-neutral-400">
          {{ selectedEvent.location || "Location not available" }}
          <span class="mx-1">·</span>
          {{ selectedEvent.totalTickets }} tickets
        </p>

        <div class="mt-5 flex items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Camera scanner</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              {{
                scanning
                  ? "Point the camera at a ticket QR code."
                  : "Start the camera and hold the ticket QR inside the frame."
              }}
            </p>
          </div>
          <Icon
            name="material-symbols:camera-outline-rounded"
            class="shrink-0 text-2xl text-gray-300 dark:text-neutral-600"
          />
        </div>

        <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 dark:border-neutral-700">
          <div
            id="organiser-ticket-qr-reader"
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
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            :disabled="!scanning"
            @click="stopScanner"
          >
            Stop camera
          </button>
        </div>

        <p
          v-if="cameraError"
          role="alert"
          class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          {{ cameraError }}
        </p>
        <p class="mt-3 text-xs text-gray-400 dark:text-neutral-500">
          Camera access requires HTTPS (or localhost) and browser permission.
        </p>

        <div class="mt-5 border-t border-gray-100 pt-5 dark:border-neutral-700">
          <h3 class="font-semibold text-gray-900 dark:text-white">Manual entry</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Paste or type the ticket code if the camera cannot be used.
          </p>
          <form
            class="mt-3 flex flex-col gap-2 sm:flex-row"
            @submit.prevent="validateCode(manualCode)"
          >
            <label for="organiser-ticket-code" class="sr-only">Ticket code</label>
            <input
              id="organiser-ticket-code"
              v-model="manualCode"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              placeholder="TKT-XXXXXXXXXXXXXXXXXXXX"
              class="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-mono text-sm text-gray-900 outline-none focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15 disabled:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:disabled:bg-neutral-800"
              :disabled="processing || !selectedEventId"
            />
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              :disabled="processing || !manualCode.trim() || !selectedEventId"
            >
              <Icon name="material-symbols:check-circle-rounded" />
              Validate
            </button>
          </form>
        </div>
      </section>

      <section
        class="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none sm:p-5"
        aria-live="polite"
      >
        <div>
          <h2 class="font-semibold text-gray-900 dark:text-white">Validation result</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            The latest scan result appears here.
          </p>
        </div>
        <div
          class="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border px-5 py-10 text-center"
          :class="resultTheme.theme"
        >
          <Icon
            :name="resultTheme.icon"
            class="text-5xl"
            :class="{ 'animate-spin': processing }"
          />
          <h3 class="mt-4 text-lg font-bold">{{ resultTheme.heading }}</h3>
          <p class="mt-1 max-w-sm text-sm">{{ resultTheme.message }}</p>
          <p
            v-if="result.code"
            class="mt-3 max-w-full break-all rounded-lg bg-white/70 px-3 py-1.5 font-mono text-xs text-gray-600 dark:bg-neutral-900/80 dark:text-neutral-300"
          >
            {{ result.code }}
          </p>

          <dl
            v-if="result.ticket"
            class="mt-5 grid w-full max-w-sm gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-left text-sm dark:border-emerald-900 dark:bg-neutral-900"
          >
            <div class="flex justify-between gap-3">
              <dt class="text-gray-500 dark:text-neutral-400">Holder</dt>
              <dd class="text-right font-semibold text-gray-900 dark:text-white">
                {{ result.ticket.userName || "—" }}
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-gray-500 dark:text-neutral-400">Event</dt>
              <dd class="text-right font-semibold text-gray-900 dark:text-white">
                {{ result.ticket.eventName || "—" }}
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-gray-500 dark:text-neutral-400">Ticket type</dt>
              <dd class="text-right font-semibold text-gray-900 dark:text-white">
                {{ result.ticket.ticketType || "—" }}
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-gray-500 dark:text-neutral-400">Checked in</dt>
              <dd class="text-right font-semibold text-gray-900 dark:text-white">
                {{ formatDateTime(result.ticket.usedAt) }}
              </dd>
            </div>
          </dl>

          <button
            v-if="result.status !== 'idle' && result.status !== 'checking'"
            type="button"
            class="mt-5 rounded-xl bg-[#9c4e8b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7c3a6d] disabled:opacity-50"
            :disabled="processing || !selectedEventId"
            @click="scanNext"
          >
            Scan next ticket
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import useOrganiserTicketScanner from "~/composables/useOrganiserTicketScanner";

const {
  events,
  selectedEventId,
  selectedEvent,
  loadingEvents,
  eventsError,
  starting,
  scanning,
  processing,
  cameraError,
  manualCode,
  result,
  resultTheme,
  loadEvents,
  startScanner,
  stopScanner,
  validateCode,
  scanNext,
  formatDateTime,
} = useOrganiserTicketScanner();
</script>
