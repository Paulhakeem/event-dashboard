<template>
  <div id="admin-report" class="flex flex-col gap-5">
    <header
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-900">Reports & analytics</h2>
        <p class="text-sm text-gray-500">
          Financial, user, booking, payment, and event performance reporting.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportCsv"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Icon name="material-symbols:download" class="text-sm" />
          Export CSV
        </button>
        <button
          @click="handlePdfExport"
          class="flex items-center gap-1.5 rounded-lg bg-[#9c4e8b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7c3a6d] transition-colors shadow-sm"
        >
          <Icon name="material-symbols:picture-as-pdf" class="text-sm" />
          Export PDF
        </button>
      </div>
    </header>

    <form
      class="grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      @submit.prevent="loadReport"
    >
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500">
        From
        <input
          v-model="filters.startDate"
          type="date"
          class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
        />
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500">
        To
        <input
          v-model="filters.endDate"
          type="date"
          class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
        />
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500">
        Organiser
        <select
          v-model="filters.organiserId"
          class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
        >
          <option value="">All organisers</option>
          <option
            v-for="organiser in report.organisers"
            :key="organiser._id"
            :value="organiser._id"
          >
            {{ organiser.firstName }} {{ organiser.lastName }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-gray-500">
        Event
        <select
          v-model="filters.eventId"
          class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
        >
          <option value="">All events</option>
          <option
            v-for="event in report.events"
            :key="event._id"
            :value="event._id"
          >
            {{ event.title }}
          </option>
        </select>
      </label>
      <button
        type="submit"
        :disabled="loading"
        class="self-end flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg
          v-if="loading"
          class="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {{ loading ? "Loading..." : "Apply filters" }}
      </button>
    </form>

    <Transition name="fade">
      <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ error }}
      </div>
    </Transition>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <template v-if="loading">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse space-y-2"
        >
          <div class="h-3 w-16 bg-gray-100 rounded-full"></div>
          <div class="h-5 w-20 bg-gray-100 rounded-full"></div>
        </div>
      </template>
      <div
        v-else
        v-for="card in summaryCards"
        :key="card.label"
        class="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
      >
        <p class="text-xs text-gray-500">{{ card.label }}</p>
        <p class="mt-1 text-xl font-bold text-gray-900">{{ card.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section class="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 class="font-bold text-gray-900">Revenue breakdown</h3>
        <p class="mt-1 text-xs text-gray-500">
          Revenue, refunds, and net earnings for the selected range.
        </p>

        <div v-if="loading" class="mt-5 space-y-4 animate-pulse">
          <div v-for="n in 3" :key="n" class="space-y-1.5">
            <div class="h-3 w-24 bg-gray-100 rounded-full"></div>
            <div class="h-2 w-full bg-gray-100 rounded-full"></div>
          </div>
        </div>
        <p
          v-else-if="!hasRevenueData"
          class="mt-6 text-sm text-gray-400 text-center py-6"
        >
          No revenue data for this range.
        </p>
        <div v-else class="mt-5 space-y-3">
          <div v-for="item in revenueBreakdown" :key="item.label">
            <div class="mb-1 flex justify-between text-xs">
              <span>{{ item.label }}</span>
              <strong>KSH {{ item.value.toLocaleString() }}</strong>
            </div>
            <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="item.color"
                :style="{ width: `${item.width}%` }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 class="font-bold text-gray-900">Payment analytics</h3>

        <div v-if="loading" class="mt-4 space-y-2 animate-pulse">
          <div
            v-for="n in 3"
            :key="n"
            class="h-11 bg-gray-100 rounded-lg"
          ></div>
        </div>
        <div v-else class="mt-4 space-y-2">
          <div
            v-for="payment in report.payments"
            :key="payment.status"
            class="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm"
          >
            <span class="capitalize">{{ payment.status }}</span>
            <span class="font-semibold">
              {{ payment.count }} · KSH {{ payment.amount.toLocaleString() }}
            </span>
          </div>
          <p
            v-if="!report.payments.length"
            class="text-sm text-gray-400 text-center py-6"
          >
            No payment data for this range.
          </p>
        </div>
      </section>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section class="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 class="font-bold text-gray-900">User growth</h3>

        <div
          v-if="loading"
          class="mt-4 h-44 flex items-end gap-1 animate-pulse"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="flex-1 bg-gray-100 rounded-t"
            :style="{ height: `${20 + (n % 4) * 15}%` }"
          ></div>
        </div>
        <p
          v-else-if="!report.monthly.length"
          class="mt-6 text-sm text-gray-400 text-center py-14"
        >
          No user growth data for this range.
        </p>
        <div v-else class="mt-4 overflow-x-auto">
          <div
            class="flex h-44 items-end gap-1 border-b border-gray-100"
            :style="{ minWidth: `${report.monthly.length * 32}px` }"
          >
            <div
              v-for="month in report.monthly"
              :key="month.key"
              class="flex flex-1 flex-col items-center justify-end gap-1"
            >
              <span class="text-[10px] text-gray-500">{{
                month.users || ""
              }}</span>
              <div
                class="w-full rounded-t bg-blue-500 transition-all duration-500"
                :style="{ height: `${barHeight(month.users, maxUsers)}%` }"
              ></div>
              <span class="text-[10px] text-gray-400 whitespace-nowrap">
                {{ month.month.slice(0, 3) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 class="font-bold text-gray-900">Event booking trends</h3>

        <div
          v-if="loading"
          class="mt-4 h-44 flex items-end gap-1 animate-pulse"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="flex-1 bg-gray-100 rounded-t"
            :style="{ height: `${20 + (n % 3) * 18}%` }"
          ></div>
        </div>
        <p
          v-else-if="!report.monthly.length"
          class="mt-6 text-sm text-gray-400 text-center py-14"
        >
          No booking trend data for this range.
        </p>
        <div v-else class="mt-4 overflow-x-auto">
          <div
            class="flex h-44 items-end gap-1 border-b border-gray-100"
            :style="{ minWidth: `${report.monthly.length * 32}px` }"
          >
            <div
              v-for="month in report.monthly"
              :key="month.key"
              class="flex flex-1 flex-col items-center justify-end gap-1"
            >
              <span class="text-[10px] text-gray-500">{{
                month.bookings || ""
              }}</span>
              <div
                class="w-full rounded-t bg-[#9c4e8b] transition-all duration-500"
                :style="{
                  height: `${barHeight(month.bookings, maxBookings)}%`,
                }"
              ></div>
              <span class="text-[10px] text-gray-400 whitespace-nowrap">
                {{ month.month.slice(0, 3) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="rounded-2xl border border-gray-100 bg-white p-5">
      <h3 class="font-bold text-gray-900">Event performance metrics</h3>
      <div class="mt-4 overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-gray-100 text-xs uppercase text-gray-400"
            >
              <th class="px-3 py-2 whitespace-nowrap">Event</th>
              <th class="px-3 py-2 whitespace-nowrap">Bookings</th>
              <th class="px-3 py-2 whitespace-nowrap">Revenue</th>
              <th class="px-3 py-2 whitespace-nowrap">Refunds</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr
                v-for="n in 4"
                :key="n"
                class="border-b border-gray-50 animate-pulse"
              >
                <td v-for="col in 4" :key="col" class="px-3 py-3">
                  <div
                    class="h-3 bg-gray-100 rounded-full"
                    :class="col === 1 ? 'w-32' : 'w-16'"
                  ></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="item in report.eventPerformance"
                :key="item.title"
                class="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
              >
                <td class="px-3 py-3 font-semibold text-gray-800">
                  {{ item.title }}
                </td>
                <td class="px-3 py-3">{{ item.bookings }}</td>
                <td class="px-3 py-3">
                  KSH {{ item.revenue.toLocaleString() }}
                </td>
                <td class="px-3 py-3">
                  KSH {{ item.refunds.toLocaleString() }}
                </td>
              </tr>
              <tr v-if="!report.eventPerformance.length">
                <td
                  colspan="4"
                  class="px-3 py-8 text-center text-sm text-gray-400"
                >
                  No event performance data for this range.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import useReportPdf from "~/composables/useReportPdf";

const { token } = useAuth();
const { exportPdf } = useReportPdf();
const loading = ref(false);
const error = ref("");
const report = ref({
  summary: {},
  monthly: [],
  payments: [],
  events: [],
  organisers: [],
  eventPerformance: [],
});
const today = new Date().toISOString().slice(0, 10);
const filters = reactive({
  startDate: `${new Date().getFullYear()}-01-01`,
  endDate: today,
  organiserId: "",
  eventId: "",
});

const loadReport = async () => {
  loading.value = true;
  error.value = "";
  try {
    report.value = await $fetch("/api/admin/reports", {
      headers: { Authorization: `Bearer ${token.value}` },
      query: filters,
    });
  } catch (err) {
    error.value = err?.data?.statusMessage || "Unable to load report";
  } finally {
    loading.value = false;
  }
};
onMounted(loadReport);

const formatMoney = (value) => `KSH ${Number(value || 0).toLocaleString()}`;
const summaryCards = computed(() => [
  { label: "Revenue", value: formatMoney(report.value.summary.revenue) },
  { label: "Refunds", value: formatMoney(report.value.summary.refunds) },
  { label: "Net revenue", value: formatMoney(report.value.summary.netRevenue) },
  {
    label: "Bookings / users",
    value: `${report.value.summary.bookings || 0} / ${report.value.summary.users || 0}`,
  },
]);
const hasRevenueData = computed(
  () =>
    report.value.summary.revenue ||
    0 ||
    report.value.summary.refunds ||
    0 ||
    report.value.summary.netRevenue ||
    0,
);
const revenueBreakdown = computed(() => {
  const values = [
    {
      label: "Revenue",
      value: report.value.summary.revenue || 0,
      color: "bg-green-500",
    },
    {
      label: "Refunds",
      value: report.value.summary.refunds || 0,
      color: "bg-red-500",
    },
    {
      label: "Net earnings",
      value: report.value.summary.netRevenue || 0,
      color: "bg-[#9c4e8b]",
    },
  ];
  const maximum = Math.max(...values.map((item) => Math.abs(item.value)), 1);
  return values.map((item) => ({
    ...item,
    width: Math.max(2, (Math.abs(item.value) / maximum) * 100),
  }));
});

const maxUsers = computed(() =>
  Math.max(...report.value.monthly.map((item) => item.users || 0), 1),
);
const maxBookings = computed(() =>
  Math.max(...report.value.monthly.map((item) => item.bookings || 0), 1),
);
const barHeight = (value, maximum) => {
  const safeValue = value || 0;
  const safeMax = maximum || 1;
  return Math.max(safeValue ? 5 : 0, (safeValue / safeMax) * 100);
};

const exportCsv = () => {
  const rows = [
    ["Event", "Bookings", "Revenue", "Refunds"],
    ...report.value.eventPerformance.map((item) => [
      item.title,
      item.bookings,
      item.revenue,
      item.refunds,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `admin-report-${filters.startDate}-${filters.endDate}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const handlePdfExport = () => {
  exportPdf({
    reportElement: document.getElementById("admin-report"),
    startDate: filters.startDate,
    endDate: filters.endDate,
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
