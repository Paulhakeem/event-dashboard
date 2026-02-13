<template>
  <div
    class="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
  >
    <!-- Header -->
    <div class="justify-between items-center gap-2">
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 class="text-sm text-gray-500 dark:text-neutral-500">Total Income</h2>
          <p
            class="text-xl sm:text-2xl font-medium text-green-500"
          >
            KES {{ (total.total || 0).toLocaleString() }}
          </p>
        </div>
        <div>
          <span
            class="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500"
          >
            <Icon name="solar:arrow-up-linear" class="text-lg" />
            0%
          </span>
        </div>
      </div>
      <div>
        <BarChart
          :data="RevenueData"
          :height="290"
          :widh="1000"
          :categories="RevenueCategoriesMultple"
          :y-axis="['events', 'users']"
          :group-padding="0"
          :bar-padding="0.2"
          :x-num-ticks="6"
          :radius="4"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
          :hide-legend="false"
          :y-grid-line="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

const RevenueData = [
  { month: "Jan", events: 186, users: 80 },
  { month: "Feb", events: 305, users: 200 },
  { month: "Mar", events: 237, users: 120 },
  { month: "Apr", events: 73, users: 190 },
  { month: "May", events: 209, users: 130 },
  { month: "June", events: 214, users: 140 },
  { month: "June", events: 204, users: 190 },
  { month: "July", events: 224, users: 200 },
  { month: "Aug", events: 154, users: 110 },
  { month: "Sep", events: 214, users: 100 },
  { month: "Oct", events: 214, users: 50 },
  { month: "Nov", events: 200, users: 214 },
  { month: "Dec", events: 214, users: 180 },
];

const RevenueCategoriesMultple = {
  events: { name: "Events", color: "#3b82f6" },
  users: { name: "Users", color: "#9c4e8b" },
};

const xFormatter = (i) => `${RevenueData[i]?.month}`;
const yFormatter = (tick) => tick.toString();

// get the total amount earned
const total = ref({ total: 0 });

onMounted(async () => {
  try {
    const res = await $fetch("/api/events/totalAmount");
    if (res?.success) {
      total.value = { total: res.total || 0 };
    }
  } catch (error) {
    console.error("Error fetching total amount:", error);
    total.value = { total: 0 };
  }
});
</script>
