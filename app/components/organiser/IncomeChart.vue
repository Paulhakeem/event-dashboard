<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Monthly Income</h2>
    <div class="text-gray-500">
      <div :class="showTitle ? 'p-6' : ''">
        <div class="flex items-center justify-between">
          <NuxtLink to="/blocks/bar-charts">
            <UButton
              icon="i-lucide-copy"
              size="sm"
              variant="soft"
              color="neutral"
            />
          </NuxtLink>
        </div>
        <BarChart
          :data="IncomeData"
          :height="300"
          :categories="IncomeCategories"
          :y-axis="['total']"
          :x-num-ticks="6"
          :radius="4"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  tags: ["barcharts", "vertical"],
});

withDefaults(
  defineProps<{
    showTitle?: boolean;
  }>(),
  {
    showTitle: false,
  },
);

const IncomeData = [
  { month: "January", total: 186 },
  { month: "February", total: 305 },
  { month: "March", total: 237 },
  { month: "April", total: 73 },
  { month: "May", total: 209 },
  { month: "June", total: 214 },
  { month: "July", total: 500 },
  { month: "August", total: 300 },
  { month: "September", total: 150 },
];

const IncomeCategories = computed(() => ({
  total: {
    name: "Total",
    color: "#22c55e",
  },
}));

const xFormatter = (i: number): string => `${IncomeData[i]?.month}`;
const yFormatter = (tick: number) => tick.toString();
</script>
