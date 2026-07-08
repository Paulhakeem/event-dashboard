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
          <Icon
            :name="ticketTrend.startsWith('-') ? 'material-symbols:trending-down' : 'material-symbols:trending-up'"
            class="text-sm"
          />
          {{ ticketTrend }} vs last period
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
          <Icon
            :name="cancelledTrend.startsWith('-') ? 'material-symbols:trending-down' : 'material-symbols:trending-up'"
            class="text-sm"
          />
          {{ cancelledTrend }} vs last period
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

<script setup>
const {
  totalTicketCount: totalTickets,
  cancelledTicketCount: totalCancelled,
  ticketChartData,
  cancellationRate,
  cancelledTrend,
  ticketTrend,
} = useTickets();

const currentYear = new Date().getFullYear();

const categories = {
  tickets: { name: "Tickets Sold", color: "#9c4e8b" },
  cancelled: { name: "Cancelled", color: "#ef4444" },
};

const chartData = computed(() => ticketChartData.value);

const options = computed(() => ({
  data: chartData.value,
  categories,
  valueLabel: {
    label: (d) => d.y.toString(),
    labelSpacing: 16,
    labelFontSize: 10,
    color: "var(--ui-text)",
  },
  xNumTicks: chartData.value.length,
  xAxis: "month",
  groupPadding: 0,
  barPadding: 0.25,
  xFormatter: (_tick, i) =>
    chartData.value[typeof i !== "undefined" ? i : _tick]?.month ?? "",
  yFormatter: (tick) => tick.toString(),
}));
</script>
