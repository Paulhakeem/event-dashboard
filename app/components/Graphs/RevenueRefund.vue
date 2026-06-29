<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-50"
    >
      <div>
        <h3 class="text-base font-bold text-gray-900">Revenue vs Refunds</h3>
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
          Revenue
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
          Refunds
        </span>
      </div>
    </div>

    <!-- Net summary pill -->
    <div class="px-6 pt-4 flex items-center gap-2">
      <span class="text-xs text-gray-400 font-medium">Net earnings:</span>
      <span
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold"
      >
        <Icon name="material-symbols:check-circle" class="text-sm" />
        KSH {{ netTotal.toLocaleString() }}
      </span>
      <span class="text-xs text-gray-400">(after refunds)</span>
    </div>

    <!-- Chart -->
    <div class="px-4 pt-2 pb-4">
      <LineChart
        :data="chartData"
        :height="240"
        y-label="KSH"
        :x-num-ticks="2"
        :categories="categories"
        :x-formatter="xFormatter"
        :y-grid-line="true"
        :curve-type="CurveType.MonotoneX"
        :legend-position="LegendPosition.TopRight"
        :hide-legend="true"
      />
    </div>

    <!-- Month labels -->
    <div class="flex items-center justify-between px-6 pb-5">
      <span
        v-for="item in chartData"
        :key="item.month"
        class="text-xs text-gray-400 font-medium"
      >
        {{ item.month.slice(0, 3) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const currentYear = new Date().getFullYear();

const chartData = [
  { month: "January", revenue: 1500, refunds: 100 },
  { month: "February", revenue: 1800, refunds: 200 },
  { month: "March", revenue: 1400, refunds: 180 },
  { month: "April", revenue: 2200, refunds: 150 },
  { month: "May", revenue: 1900, refunds: 210 },
  { month: "June", revenue: 2500, refunds: 190 },
  { month: "July", revenue: 2100, refunds: 170 },
  { month: "August", revenue: 2700, refunds: 230 },
  { month: "September", revenue: 2400, refunds: 195 },
  { month: "October", revenue: 3100, refunds: 260 },
  { month: "November", revenue: 2900, refunds: 240 },
  { month: "December", revenue: 3600, refunds: 310 },
];

const categories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Revenue", color: "#9c4e8b" },
  refunds: { name: "Refunds", color: "#ef4444" },
};

const xFormatter = (tick: number): string => chartData[tick]?.month ?? "";

const totalRevenue = computed(() =>
  chartData.reduce((s, d) => s + d.revenue, 0),
);
const totalRefunds = computed(() =>
  chartData.reduce((s, d) => s + d.refunds, 0),
);
const netTotal = computed(() => totalRevenue.value - totalRefunds.value);
</script>
