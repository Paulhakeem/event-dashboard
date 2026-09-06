<template>
  <div class="flex flex-col gap-5">
    <header
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-900">Booking management</h2>
        <p class="text-sm text-gray-500">
          Review transactions, refunds, disputes, and reconciliation.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700"
          @click="exportCsv"
        >
          <Icon name="material-symbols:download" /> Export CSV
        </button>
        <button
          class="rounded-lg bg-[#9c4e8b] px-3 py-2 text-xs font-semibold text-white"
          @click="loadBookings"
        >
          <Icon name="material-symbols:refresh" /> Refresh
        </button>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
      >
        <p
          class="text-[11px] font-semibold uppercase tracking-wide text-gray-400"
        >
          {{ card.label }}
        </p>
        <p class="mt-1 text-lg font-bold text-gray-900">{{ card.value }}</p>
      </div>
    </div>

    <form
      class="grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      @submit.prevent="applyFilters"
    >
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >Search
        <input
          v-model="filters.search"
          type="search"
          placeholder="Email, event, reference..."
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
        />
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >Payment status
        <select
          v-model="filters.status"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
        >
          <option value="">All statuses</option>
          <option v-for="item in statusOptions" :key="item" :value="item">
            {{ labelize(item) }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >Refund status
        <select
          v-model="filters.refundStatus"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
        >
          <option value="">All refunds</option>
          <option v-for="item in refundOptions" :key="item" :value="item">
            {{ labelize(item) }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >Dispute status
        <select
          v-model="filters.disputeStatus"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
        >
          <option value="">All disputes</option>
          <option v-for="item in disputeOptions" :key="item" :value="item">
            {{ labelize(item) }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >Event
        <select
          v-model="filters.eventName"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
        >
          <option value="">All events</option>
          <option v-for="item in events" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >From<input
          v-model="filters.startDate"
          type="date"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
      /></label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500"
        >To<input
          v-model="filters.endDate"
          type="date"
          class="rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900"
      /></label>
      <div class="flex items-end gap-2">
        <button
          type="submit"
          class="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white"
        >
          Apply</button
        ><button
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </form>

    <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
    <div
      class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div v-if="loading" class="p-10 text-center text-sm text-gray-500">
        Loading transactions...
      </div>
      <div
        v-else-if="!bookings.length"
        class="p-10 text-center text-sm text-gray-500"
      >
        No bookings match these filters.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead
            class="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500"
          >
            <tr>
              <th class="px-4 py-3">Booking</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Payment</th>
              <th class="px-4 py-3">Refund</th>
              <th class="px-4 py-3">Dispute</th>
              <th class="px-4 py-3">Reconcile</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="booking in bookings"
              :key="booking._id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <p class="font-semibold text-gray-900">
                  {{ booking.eventName }}
                </p>
                <p class="text-xs text-gray-400">{{ booking.reference }}</p>
                <p class="text-xs text-gray-400">
                  {{ formatDate(booking.bookedAt) }}
                </p>
              </td>
              <td class="px-4 py-3">
                <p class="text-gray-800">{{ booking.userEmail }}</p>
                <p class="text-xs text-gray-400">{{ booking.ticketType }}</p>
              </td>
              <td class="px-4 py-3 font-semibold">
                KES {{ money(booking.amount) }}
              </td>
              <td class="px-4 py-3">
                <span :class="statusClass(booking.status)">{{
                  labelize(booking.status)
                }}</span>
                <p class="mt-1 text-xs text-gray-400">
                  {{
                    booking.mpesaReceiptNumber ||
                    booking.transactionId ||
                    "No receipt"
                  }}
                </p>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="statusClass(booking.refundStatus || 'not_requested')"
                  >{{ labelize(booking.refundStatus || "not_requested") }}</span
                >
                <p
                  v-if="booking.refundAmount"
                  class="mt-1 text-xs text-gray-400"
                >
                  KES {{ money(booking.refundAmount) }}
                </p>
              </td>
              <td class="px-4 py-3">
                <span :class="statusClass(booking.disputeStatus || 'none')">{{
                  labelize(booking.disputeStatus || "none")
                }}</span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="
                    statusClass(
                      booking.reconciled ? 'reconciled' : 'unreconciled',
                    )
                  "
                  >{{
                    booking.reconciled ? "Reconciled" : "Needs review"
                  }}</span
                >
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="text-xs font-semibold text-[#9c4e8b] hover:underline"
                  @click="openBooking(booking)"
                >
                  Manage
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="pagination.pages > 1"
        class="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500"
      >
        <span
          >Page {{ pagination.page }} of {{ pagination.pages }} ({{
            pagination.total
          }}
          total)</span
        >
        <div class="flex gap-2">
          <button
            :disabled="pagination.page === 1"
            class="rounded border px-2 py-1 disabled:opacity-40"
            @click="changePage(-1)"
          >
            Previous</button
          ><button
            :disabled="pagination.page === pagination.pages"
            class="rounded border px-2 py-1 disabled:opacity-40"
            @click="changePage(1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="selectedBooking"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="selectedBooking = null"
    >
      <div
        class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Manage booking</h3>
            <p class="text-xs text-gray-500">{{ selectedBooking.reference }}</p>
          </div>
          <button class="text-xl text-gray-400" @click="selectedBooking = null">
            &times;
          </button>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-xs text-gray-400">Event</p>
            <p class="font-semibold">{{ selectedBooking.eventName }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Customer</p>
            <p class="break-all font-semibold">
              {{ selectedBooking.userEmail }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Amount</p>
            <p class="font-semibold">KES {{ money(selectedBooking.amount) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Receipt</p>
            <p class="break-all font-semibold">
              {{ selectedBooking.mpesaReceiptNumber || "Not available" }}
            </p>
          </div>
        </div>
        <div class="mt-5 border-t pt-4">
          <h4 class="font-semibold text-gray-900">Refund workflow</h4>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <input
              v-model="actionForm.refundAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Refund amount"
              class="rounded-lg border p-2 text-sm"
            /><input
              v-model="actionForm.refundReference"
              placeholder="Refund reference"
              class="rounded-lg border p-2 text-sm"
            />
          </div>
          <input
            v-model="actionForm.reason"
            placeholder="Reason or operator note"
            class="mt-2 w-full rounded-lg border p-2 text-sm"
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white"
              @click="runAction('request_refund')"
            >
              Request refund</button
            ><button
              v-for="status in ['processing', 'completed', 'failed']"
              :key="status"
              class="rounded-lg border px-3 py-2 text-xs font-semibold"
              @click="runAction('update_refund', { refundStatus: status })"
            >
              Mark {{ labelize(status) }}
            </button>
          </div>
        </div>
        <div class="mt-5 border-t pt-4">
          <h4 class="font-semibold text-gray-900">Dispute resolution</h4>
          <input
            v-model="actionForm.disputeReason"
            placeholder="Dispute reason"
            class="mt-2 w-full rounded-lg border p-2 text-sm"
          /><textarea
            v-model="actionForm.disputeNote"
            placeholder="Resolution note"
            rows="2"
            class="mt-2 w-full rounded-lg border p-2 text-sm"
          ></textarea>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="status in [
                'open',
                'investigating',
                'resolved',
                'rejected',
              ]"
              :key="status"
              class="rounded-lg border px-3 py-2 text-xs font-semibold"
              @click="runAction('update_dispute', { disputeStatus: status })"
            >
              {{ labelize(status) }}
            </button>
          </div>
        </div>
        <div class="mt-5 border-t pt-4">
          <h4 class="font-semibold text-gray-900">Reconciliation</h4>
          <p class="mt-1 text-xs text-gray-500">
            Confirm that the payment receipt matches the provider statement.
          </p>
          <input
            v-model="actionForm.reconciliationNote"
            placeholder="Reconciliation note"
            class="mt-2 w-full rounded-lg border p-2 text-sm"
          /><button
            class="mt-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white"
            @click="
              runAction('reconcile', {
                reconciled: !selectedBooking.reconciled,
              })
            "
          >
            {{
              selectedBooking.reconciled
                ? "Mark unreconciled"
                : "Mark reconciled"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { token } = useAuth();
const bookings = ref([]);
const events = ref([]);
const loading = ref(false);
const error = ref("");
const selectedBooking = ref(null);
const summary = ref({});
const pagination = ref({ page: 1, pages: 1, total: 0 });
const filters = ref({
  search: "",
  status: "",
  refundStatus: "",
  disputeStatus: "",
  eventName: "",
  startDate: "",
  endDate: "",
});
const actionForm = ref({
  refundAmount: 0,
  refundReference: "",
  reason: "",
  disputeReason: "",
  disputeNote: "",
  reconciliationNote: "",
});
const statusOptions = [
  "pending",
  "success",
  "confirmed",
  "cancelled",
  "failed",
  "refunded",
];
const refundOptions = [
  "not_requested",
  "pending",
  "processing",
  "completed",
  "failed",
];
const disputeOptions = [
  "none",
  "open",
  "investigating",
  "resolved",
  "rejected",
];
const queryParams = () =>
  Object.fromEntries(
    Object.entries({
      ...filters.value,
      page: pagination.value.page,
      limit: 25,
    }).filter(([, value]) => value !== "" && value !== null),
  );
const loadBookings = async () => {
  loading.value = true;
  error.value = "";
  try {
    const data = await $fetch("/api/admin/bookings", {
      query: queryParams(),
      headers: { Authorization: `Bearer ${token.value}` },
    });
    bookings.value = data.bookings || [];
    events.value = data.events || [];
    summary.value = data.summary || {};
    pagination.value = data.pagination || pagination.value;
  } catch (err) {
    error.value = err?.data?.statusMessage || "Failed to load bookings.";
  } finally {
    loading.value = false;
  }
};
const applyFilters = () => {
  pagination.value.page = 1;
  loadBookings();
};
const resetFilters = () => {
  filters.value = {
    search: "",
    status: "",
    refundStatus: "",
    disputeStatus: "",
    eventName: "",
    startDate: "",
    endDate: "",
  };
  applyFilters();
};
const changePage = (amount) => {
  pagination.value.page += amount;
  loadBookings();
};
const openBooking = (booking) => {
  selectedBooking.value = booking;
  actionForm.value = {
    refundAmount: booking.refundAmount || booking.amount || 0,
    refundReference: booking.refundReference || "",
    reason: booking.refundReason || "",
    disputeReason: booking.disputeReason || "",
    disputeNote: booking.disputeNote || "",
    reconciliationNote: booking.reconciliationNote || "",
  };
};
const runAction = async (action, extra = {}) => {
  try {
    const body = { id: selectedBooking.value._id, action, ...extra };
    if (["request_refund", "update_refund"].includes(action))
      Object.assign(body, {
        refundAmount: actionForm.value.refundAmount,
        refundReference: actionForm.value.refundReference,
        reason: actionForm.value.reason,
      });
    if (action === "update_dispute")
      Object.assign(body, {
        reason: actionForm.value.disputeReason,
        note: actionForm.value.disputeNote,
      });
    if (action === "reconcile")
      Object.assign(body, { note: actionForm.value.reconciliationNote });
    const data = await $fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body,
    });
    await loadBookings();
    selectedBooking.value =
      bookings.value.find((item) => item._id === data.booking._id) ||
      data.booking;
  } catch (err) {
    error.value = err?.data?.statusMessage || "Booking action failed.";
  }
};
const money = (value) =>
  Number(value || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");
const labelize = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusClass = (value) =>
  ({
    success:
      "rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700",
    confirmed:
      "rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700",
    completed:
      "rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700",
    reconciled:
      "rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700",
    pending:
      "rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700",
    processing:
      "rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700",
    open: "rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700",
    investigating:
      "rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700",
    failed:
      "rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700",
    cancelled:
      "rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700",
    refunded:
      "rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700",
    rejected:
      "rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700",
    unreconciled:
      "rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700",
    not_requested:
      "rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600",
    none: "rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600",
  })[value] ||
  "rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600";
const summaryCards = computed(() => [
  { label: "Transactions", value: summary.value.successful || 0 },
  {
    label: "Gross volume",
    value: `KES ${money(summary.value.successfulAmount)}`,
  },
  { label: "Refunded", value: `KES ${money(summary.value.refundedAmount)}` },
  { label: "Pending refunds", value: summary.value.pendingRefunds || 0 },
  { label: "Open disputes", value: summary.value.openDisputes || 0 },
  { label: "Needs review", value: summary.value.unreconciled || 0 },
  { label: "All volume", value: `KES ${money(summary.value.gross)}` },
]);
const exportCsv = () => {
  const headers = [
    "Event",
    "Customer",
    "Amount",
    "Payment status",
    "Refund status",
    "Dispute status",
    "Reference",
    "Booked at",
  ];
  const rows = bookings.value.map((item) => [
    item.eventName,
    item.userEmail,
    item.amount,
    item.status,
    item.refundStatus,
    item.disputeStatus,
    item.reference,
    item.bookedAt,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "booking-transactions.csv";
  link.click();
  URL.revokeObjectURL(url);
};
onMounted(loadBookings);
</script>
