<template>
  <div
    class="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
  >
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-2">
      <div>
        <h2 class="text-sm text-gray-500 dark:text-neutral-500">New Users</h2>
        <p
          class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
        >
          0.0
        </p>
      </div>
      <div>
        <span
          class="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-600 dark:bg-teal-500/10 dark:text-teal-500"
        >
          <Icon name="solar:arrow-down-linear" class="text-lg" />
          0.5%
        </span>
      </div>
    </div>
    <!-- End Header -->

    <LineChart
      :data="chartData"
      :height="300"
      x-label="Time"
      y-label="Temperature"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :x-formatter="xFormatter"
      :curve-type="CurveType.Basis"
      :legend-position="LegendPosition.Top"
      :hide-legend="false"
      :y-grid-line="true"
    />
  </div>
</template>

<script lang="ts" setup>
const chartData = [
  { month: "Jan", users: 186 },
  { month: "Feb", users: 305 },
  { month: "Mar", users: 237 },
  { month: "Apr", users: 260 },
  { month: "May", users: 209 },
  { month: "June", users: 250 },
  { month: "July", users: 200 },
  { month: "Aug", users: 150 },
  { month: "Sep", users: 250 },
  { month: "Oct", users: 50 },
  { month: "Nov", users: 100 },
  { month: "Dec", users: 270 },
];

const categories: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#3b82f6" },
};

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return chartData[tick]?.month ?? "";
};
</script>
