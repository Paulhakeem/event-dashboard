<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-50"
    >
      <div>
        <h3 class="text-base font-bold text-gray-900">Tickets vs Cancelled</h3>
        <p class="text-xs text-gray-400 mt-0.5">
          Monthly breakdown · Jan – Dec {{ currentYear }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9c4e8b]/10 text-[#9c4e8b] text-xs font-semibold"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-[#9c4e8b] inline-block"
          ></span>
          Tickets Sold
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
          Cancelled
        </span>
      </div>
    </div>

    <!-- Summary stats -->
    <div
      class="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-50"
    >
      <!-- Total tickets -->
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Tickets Sold
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ totalTickets.toLocaleString() }}
        </p>
        <p
          class="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1.5"
        >
          <Icon name="material-symbols:trending-up" class="text-sm" />
          +18% vs last period
        </p>
      </div>

      <!-- Cancelled -->
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Cancelled
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ totalCancelled.toLocaleString() }}
        </p>
        <p
          class="flex items-center gap-1 text-xs text-red-500 font-semibold mt-1.5"
        >
          <Icon name="material-symbols:trending-down" class="text-sm" />
          -5% vs last period
        </p>
      </div>

      <!-- Cancellation rate -->
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Cancel Rate
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ cancellationRate }}%
        </p>
        <p
          class="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1.5"
        >
          <Icon name="material-symbols:info-outline" class="text-sm" />
          of total tickets
        </p>
      </div>
    </div>

    <!-- Chart -->
    <div class="px-4 pt-4 pb-2">
      <BarChart
        :height="240"
        :y-axis="['tickets', 'cancelled']"
        v-bind="options"
      />
    </div>

    <!-- Month labels -->
    <div class="flex items-center justify-between px-6 pb-5">
      <span
        v-for="item in chartData"
        :key="item.month"
        class="text-xs text-gray-400 font-medium capitalize"
      >
        {{ item.month.slice(0, 3) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  tags: ["barcharts", "tickets"],
});

type DataProps = {
  month: string;
  tickets: number;
  cancelled: number;
};

const currentYear = new Date().getFullYear();

// Replace with real API data from your tickets composable
const chartData: DataProps[] = [
  { month: "january", tickets: 320, cancelled: 40 },
  { month: "february", tickets: 480, cancelled: 55 },
  { month: "march", tickets: 390, cancelled: 38 },
  { month: "april", tickets: 520, cancelled: 70 },
  { month: "may", tickets: 410, cancelled: 48 },
  { month: "june", tickets: 580, cancelled: 62 },
  { month: "july", tickets: 490, cancelled: 53 },
  { month: "august", tickets: 620, cancelled: 44 },
  { month: "september", tickets: 540, cancelled: 67 },
  { month: "october", tickets: 710, cancelled: 80 },
  { month: "november", tickets: 650, cancelled: 72 },
  { month: "december", tickets: 830, cancelled: 95 },
];

const categories = {
  tickets: { name: "Tickets Sold", color: "#9c4e8b" },
  cancelled: { name: "Cancelled", color: "#ef4444" },
};

const options = {
  data: chartData,
  categories,
  valueLabel: {
    label: (d: { y: number }) => d.y.toString(),
    labelSpacing: 16,
    labelFontSize: 10,
    color: "var(--ui-text)",
  },
  xNumTicks: 12,
  xAxis: "month" as keyof DataProps,
  groupPadding: 0,
  barPadding: 0.25,
  xFormatter: (_tick: number, i?: number) =>
    chartData[typeof i !== "undefined" ? i : _tick]?.month ?? "",
  yFormatter: (tick: number) => tick.toString(),
};

// Summary computeds
const totalTickets = computed(() =>
  chartData.reduce((s, d) => s + d.tickets, 0),
);
const totalCancelled = computed(() =>
  chartData.reduce((s, d) => s + d.cancelled, 0),
);
const cancellationRate = computed(() =>
  totalTickets.value > 0
    ? ((totalCancelled.value / totalTickets.value) * 100).toFixed(1)
    : "0.0",
);
</script>
