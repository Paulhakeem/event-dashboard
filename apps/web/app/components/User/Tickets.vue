<template>
  <div class="space-y-6">
    <header
      class="overflow-hidden rounded-3xl bg-gradient-to-br from-[#101d3a] via-[#13284b] to-[#203e69] px-5 py-6 text-white shadow-lg shadow-slate-900/10 sm:px-7 sm:py-8"
    >
      <div
        class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300"
          >
            Your Happitwin collection
          </p>
          <h2 class="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Icon name="mdi:ticket" class="shrink-0 text-amber-300" />
            My Tickets
          </h2>
          <p class="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Keep your event passes close. Open a ticket to view or download its
            QR code.
          </p>
        </div>
        <NuxtLink
          to="/eventPage"
          class="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-[#101d3a] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#13284b] sm:self-auto"
        >
          <Icon name="mdi:compass-outline" class="text-lg" />
          Explore events
        </NuxtLink>
      </div>
    </header>

    <section
      class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm sm:p-6"
      aria-label="Your event tickets"
    >
      <div
        class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-bold text-slate-900">Your passes</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredTickets.length }}
            {{ filteredTickets.length === 1 ? "ticket" : "tickets" }}
          </p>
        </div>
        <div
          class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          role="group"
          aria-label="Filter tickets"
        >
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            :aria-pressed="activeFilter === option.value"
            @click="activeFilter = option.value"
            :class="[
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2',
              activeFilter === option.value
                ? 'bg-[#13284b] text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-amber-50 hover:text-[#13284b]',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div
        v-if="ticketsLoading"
        class="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-12 text-slate-500"
        role="status"
        aria-live="polite"
      >
        <Icon
          name="svg-spinners:90-ring-with-bg"
          class="mb-3 text-3xl text-[#13284b]"
        />
        Loading your tickets...
      </div>

      <div
        v-else-if="ticketsError"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700"
        role="alert"
      >
        {{ ticketsError }} Please refresh and try again.
      </div>

      <div
        v-else-if="filteredTickets.length === 0"
        class="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center"
      >
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-[#13284b]"
        >
          <Icon name="mdi:ticket-outline" class="text-3xl" />
        </div>
        <h4 class="font-semibold text-slate-900">No tickets here yet</h4>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Browse upcoming events and book a pass. Your tickets will appear here
          with their TKT code and QR access.
        </p>
        <NuxtLink
          to="/eventPage"
          class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#13284b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d3763] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          Find an event
        </NuxtLink>
      </div>

      <div v-else class="grid gap-4 xl:grid-cols-2">
        <article
          v-for="ticket in filteredTickets"
          :key="ticket._id"
          class="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
        >
          <div class="p-4 sm:p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700"
                >
                  Event pass
                </p>
                <h4
                  class="mt-1 break-words text-lg font-bold leading-snug text-slate-900"
                >
                  {{ ticket.eventName }}
                </h4>
              </div>
              <span
                class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                :class="
                  ticket.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ticket.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                "
              >
                {{
                  ticket.status === "active"
                    ? "Active"
                    : ticket.status === "cancelled"
                      ? "Cancelled"
                      : "Inactive"
                }}
              </span>
            </div>

            <div
              class="mt-4 flex min-w-0 items-center gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 px-3 py-3 sm:px-4"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#13284b] shadow-sm"
                aria-hidden="true"
              >
                <Icon name="mdi:barcode" class="text-xl" />
              </span>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
                >
                  TKT code
                </p>
                <p
                  class="mt-0.5 break-all font-mono text-sm font-bold tracking-wide text-[#13284b]"
                >
                  {{ ticket.ticketCode || "Ticket code unavailable" }}
                </p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div class="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5">
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  Booked
                </p>
                <p class="mt-1 truncate text-sm font-semibold text-slate-700">
                  {{ new Date(ticket.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5">
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  Ticket type
                </p>
                <p
                  class="mt-1 truncate text-sm font-semibold capitalize text-slate-700"
                >
                  {{ ticket.ticketType }}
                </p>
              </div>
              <div class="col-span-2 min-w-0 rounded-xl bg-slate-50 px-3 py-2.5 sm:col-span-1">
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  Amount
                </p>
                <p class="mt-1 truncate text-sm font-semibold text-slate-700">
                  KES {{ Number(ticket.amount || 0).toLocaleString() }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 min-[420px]:flex-row min-[420px]:items-center"
            >
              <button
                v-if="ticket.status === 'active'"
                type="button"
                :disabled="cancellationLoading"
                class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-wait disabled:opacity-60"
                @click="handleCancel(ticket)"
              >
                <Icon name="mdi:close-circle-outline" class="text-lg" />
                {{ cancellationLoading ? "Cancelling..." : "Cancel ticket" }}
              </button>
              <span
                v-else
                class="hidden flex-1 text-xs text-slate-400 min-[420px]:block"
              >
                This ticket is {{ ticket.status }}.
              </span>
              <button
                type="button"
                class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#13284b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d3763] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                @click="openTicket(ticket)"
              >
                <Icon name="mdi:qrcode" class="text-lg" />
                View ticket
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>

  <div
    v-if="selectedTicket"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="selectedTicket = null"
  >
    <section
      class="ticket-print w-[80mm] max-w-full rounded-xl bg-white p-4 text-gray-900 shadow-2xl"
    >
      <div
        class="flex items-start justify-between gap-3 border-b border-dashed border-gray-300 pb-3"
      >
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#13284b]"
          >
            Happitwin events
          </p>
          <h2 class="mt-1 text-base font-bold">
            {{ selectedTicket.eventName }}
          </h2>
          <p class="text-xs text-gray-500">
            {{ selectedTicket.ticketType }} ticket
          </p>
        </div>
        <button
          type="button"
          class="print-hidden text-gray-400"
          aria-label="Close ticket"
          @click="selectedTicket = null"
        >
          <Icon name="mdi:close" />
        </button>
      </div>
      <div class="flex items-center gap-4 py-4">
        <img
          v-if="ticketQr"
          :src="ticketQr"
          alt="Ticket QR code"
          class="h-24 w-24"
        />
        <div class="min-w-0 text-xs">
          <p class="font-semibold">Ticket code</p>
          <p class="mt-1 break-all text-gray-600">
            {{ selectedTicket.ticketCode || selectedTicket._id }}
          </p>
          <p class="mt-3 font-semibold">Amount</p>
          <p class="text-gray-600">
            KES {{ Number(selectedTicket.amount || 0).toLocaleString() }}
          </p>
        </div>
      </div>
      <p
        class="border-t border-dashed border-gray-300 pt-2 text-[10px] text-gray-500"
      >
        Present this QR code at the entrance.
      </p>
      <div class="print-hidden mt-4 flex gap-2">
        <button
          type="button"
          class="flex-1 rounded-lg bg-[#13284b] px-3 py-2 text-xs font-semibold text-white"
          @click="printTicket"
        >
          Print / Save PDF
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold"
          @click="downloadQr"
        >
          Download QR
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import QRCode from "qrcode";
import useTicketCancellation from "~/composables/ticketCancellation";

const { cancelTicket, cancellationLoading } = useTicketCancellation();
const {
  tickets,
  filterOptions,
  activeFilter,
  filteredTickets,
  ticketsLoading,
  ticketsError,
} = useTickets();
const selectedTicket = ref(null);
const ticketQr = ref("");

const openTicket = async (ticket) => {
  selectedTicket.value = ticket;
  const userName =
    ticket.userName ||
    ticket.name ||
    `${ticket.userId?.firstName || ""} ${ticket.userId?.lastName || ""}`.trim() ||
    "Ticket holder";
  const qrPayload = [
    `Name: ${userName}`,
    `Event: ${ticket.eventName}`,
    `Ticket type: ${ticket.ticketType}`,
    `Ticket code: ${ticket.ticketCode || ticket._id}`,
  ].join("\n");
  ticketQr.value = await QRCode.toDataURL(qrPayload, {
    width: 240,
    margin: 1,
    errorCorrectionLevel: "M",
  });
};

const printTicket = () => window.print();
const downloadQr = () => {
  const link = document.createElement("a");
  link.href = ticketQr.value;
  link.download = `${selectedTicket.value.ticketCode || selectedTicket.value._id}-qr.png`;
  link.click();
};

const handleCancel = async (ticket) => {
  await cancelTicket(ticket._id);
  ticket.status = "cancelled";
};
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }

  .ticket-print,
  .ticket-print * {
    visibility: visible;
  }

  .ticket-print {
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: none;
  }

  .print-hidden {
    display: none !important;
  }
}
</style>
