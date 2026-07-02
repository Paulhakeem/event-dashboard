<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-50"
    >
      <div>
        <h3 class="text-base font-bold text-gray-900">Website Visitors</h3>
        <p class="text-xs text-gray-400 mt-0.5">
          Monthly unique visitors · Jan – Dec {{ currentYear }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9c4e8b]/10 text-[#9c4e8b] text-xs font-semibold"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-[#9c4e8b] animate-pulse inline-block"
          ></span>
          Live tracking
        </span>
        <NuxtLink to="/blocks/bar-charts">
          <UButton
            icon="i-lucide-copy"
            size="sm"
            variant="soft"
            color="neutral"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Summary stats -->
    <div
      class="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-50"
    >
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Total Visitors
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ totalVisitors.toLocaleString() }}
        </p>
        <p
          class="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1.5"
        >
          <Icon name="material-symbols:trending-up" class="text-sm" />
          +22% vs last year
        </p>
      </div>
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Peak Month
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ peakMonth }}
        </p>
        <p
          class="flex items-center gap-1 text-xs text-[#9c4e8b] font-semibold mt-1.5"
        >
          <Icon name="material-symbols:star" class="text-sm" />
          {{ peakVisitors.toLocaleString() }} visitors
        </p>
      </div>
      <div class="px-6 py-4">
        <p
          class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1"
        >
          Monthly Avg
        </p>
        <p class="text-2xl font-bold text-gray-900 leading-none">
          {{ monthlyAvg.toLocaleString() }}
        </p>
        <p
          class="flex items-center gap-1 text-xs text-blue-500 font-semibold mt-1.5"
        >
          <Icon name="material-symbols:analytics" class="text-sm" />
          per month
        </p>
      </div>
    </div>

    <!-- Chart -->
    <div class="px-4 pt-4 pb-2">
      <BarChart
        :data="chartData"
        :height="260"
        :categories="categories"
        :y-axis="['visitors']"
        :x-num-ticks="12"
        :radius="6"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
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
defineOptions({
  tags: ["barcharts", "visitors"],
});

withDefaults(defineProps<{ showTitle?: boolean }>(), { showTitle: false });

const currentYear = new Date().getFullYear();

const chartData = [
  { month: "January", visitors: 1840 },
  { month: "February", visitors: 2305 },
  { month: "March", visitors: 2890 },
  { month: "April", visitors: 2430 },
  { month: "May", visitors: 3120 },
  { month: "June", visitors: 3560 },
  { month: "July", visitors: 3210 },
  { month: "August", visitors: 3870 },
  { month: "September", visitors: 4100 },
  { month: "October", visitors: 4450 },
  { month: "November", visitors: 4020 },
  { month: "December", visitors: 4800 },
];

const categories = computed(() => ({
  visitors: { name: "Visitors", color: "#9c4e8b" },
}));

const xFormatter = (i: number): string => chartData[i]?.month ?? "";
const yFormatter = (tick: number): string => tick.toLocaleString();

// Summary computeds
const totalVisitors = computed(() =>
  chartData.reduce((s, d) => s + d.visitors, 0),
);
const peakEntry = computed(() =>
  chartData.reduce(
    (max, d) => (d.visitors > max.visitors ? d : max),
    chartData[0],
  ),
);
const peakMonth = computed(() => peakEntry.value.month);
const peakVisitors = computed(() => peakEntry.value.visitors);
const monthlyAvg = computed(() =>
  Math.round(totalVisitors.value / chartData.length),
);
</script>
