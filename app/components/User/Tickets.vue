<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:ticket" class="text-[#9d4e8a]" /> My Tickets
      </h2>
      <p class="text-sm text-gray-500">
        View and manage your upcoming and past event tickets here
      </p>
    </div>

    <!-- Tickets Card -->
    <div
      class="p-6 bg-linear-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100"
    >
      <div class="flex items-center justify-between mb-4">
        <p class="text-lg font-semibold text-gray-700">My Tickets</p>
        <NuxtLink
          to="/eventPage"
          class="px-4 py-2 text-sm font-medium text-white bg-[#9d4e8a] rounded-lg shadow transition cursor-pointer"
        >
          Explore Events
        </NuxtLink>
      </div>

      <!-- Filter Tabs -->
      <div class="flex space-x-2 mb-6">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="activeFilter = option.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            activeFilter === option.value
              ? 'bg-[#9d4e8a] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="ticketsLoading"
        class="flex flex-col items-center py-10 text-gray-500"
      >
        <Icon
          name="svg-spinners:90-ring-with-bg"
          class="mb-3 text-3xl text-[#9d4e8a]"
        />
        Loading your tickets...
      </div>

      <div
        v-else-if="ticketsError"
        class="py-10 text-center text-sm text-red-600"
      >
        {{ ticketsError }} Please refresh and try again.
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTickets.length === 0" class="text-center py-10">
        <div class="flex justify-center mb-3">
          <div
            class="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-[#9d4e8a]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2m6 18l5.447-2.724A2 2 0 0021 15.382V6.618a2 2 0 00-1.553-1.894L15 2M9 2h6v18H9V2z"
              />
            </svg>
          </div>
        </div>
        <p class="text-gray-500">
          You have no tickets yet. <br />
          <span class="text-[#9d4e8a] font-medium">Explore events</span> and
          book your tickets to see them here!
        </p>
      </div>

      <!-- Tickets List -->
      <div v-else class="space-y-4">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket._id"
          class="p-4 bg-white rounded-lg shadow border border-gray-200"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-800">
                {{ ticket.eventName }}
              </h3>
              <p class="text-sm text-gray-500">Ticket ID: {{ ticket._id }}</p>
            </div>
            <span
              class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
            >
              {{ new Date(ticket.createdAt).toLocaleDateString() }}
            </span>
            <span
              class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium uppercase"
            >
              {{ ticket.ticketType }}
            </span>
            <span
              class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
            >
              {{ ticket.amount }} Ksh
            </span>

            <span
              v-if="ticket.status == 'active'"
              class="px-3 py-1 bg-blue-100 text-green-800 rounded-full text-xs font-medium"
            >
              Active
            </span>
            <!-- cancel ticket button   -->
            <button
              v-if="ticket.status == 'active'"
              @click="handleCancel(ticket)"
              class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium hover:bg-red-200 transition cursor-pointer"
            >
              {{ cancellationLoading ? "Cancelling..." : "Cancel Ticket" }}
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium hover:bg-purple-200 transition"
              @click="openTicket(ticket)"
            >
              View / Export
            </button>
            <button
              v-if="ticket.status !== 'active'"
              class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium cursor-not-allowed"
              disabled
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>
    </div>
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
            class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9d4e8a]"
          >
            Velora Events
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
          class="flex-1 rounded-lg bg-[#9d4e8a] px-3 py-2 text-xs font-semibold text-white"
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
