```vue
<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 backdrop-blur-xl shadow-xl p-6"
  >
    <!-- Decorative Glow -->
    <div
      class="absolute top-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
    ></div>

    <div
      class="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"
    ></div>

    <div class="relative z-10">
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div>
          <p
            class="uppercase tracking-[0.2em] text-xs font-semibold text-gray-500 dark:text-neutral-400"
          >
            Total Revenue
          </p>

          <h2
            class="mt-2 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
          >
            KES {{ (total.total || 0).toLocaleString() }}
          </h2>

          <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Revenue generated from all bookings
          </p>
        </div>

        <!-- Growth Badge -->
        <div
          class="mt-4 lg:mt-0 flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-100 dark:bg-green-900/20"
        >
          <Icon name="solar:arrow-up-linear" class="text-green-600 text-xl" />

          <span class="font-semibold text-green-600"> +18.2% </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="animate-pulse">
        <div class="h-80 rounded-3xl bg-gray-200 dark:bg-neutral-700"></div>
      </div>

      <!-- Chart -->
      <div
        v-else
        class="bg-white/70 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-5 border border-white/50 shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">
              Monthly Performance
            </h3>

            <p class="text-sm text-gray-500">Events vs Users</p>
          </div>
        </div>

        <BarChart
          :data="RevenueData"
          :height="320"
          :width="1000"
          :categories="RevenueCategoriesMultple"
          :y-axis="['events', 'users']"
          :group-padding="0.15"
          :bar-padding="0.25"
          :x-num-ticks="6"
          :radius="10"
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
const config = useRuntimeConfig();
const { token } = useAuth();

const RevenueData = ref([]);
const total = ref({ total: 0 });
const loading = ref(true);

const RevenueCategoriesMultple = {
  events: {
    name: "Events",
    color: "#3B82F6",
  },
  users: {
    name: "Users",
    color: "#8B5CF6",
  },
};

const xFormatter = (i) => `${RevenueData.value[i]?.month || ""}`;

const yFormatter = (tick) => tick.toString();

const totalEvents = computed(() =>
  RevenueData.value.reduce((sum, item) => sum + (item.events || 0), 0),
);

const totalUsers = computed(() =>
  RevenueData.value.reduce((sum, item) => sum + (item.users || 0), 0),
);

onMounted(async () => {
  loading.value = true;

  try {
    const res = await $fetch(config.public.totalAmountApi, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res?.success) {
      total.value = {
        total: res.total || 0,
      };
    }
  } catch (error) {
    console.error("Error fetching total amount:", error);
  }

  try {
    const stats = await $fetch(config.public.monthlyStatsApi, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (stats?.success && Array.isArray(stats.monthly)) {
      RevenueData.value = stats.monthly.map((month) => ({
        month: month.month,
        events: month.events || 0,
        users: month.users || 0,
      }));
    }
  } catch (err) {
    console.error("Failed to load monthly stats", err);
  } finally {
    loading.value = false;
  }
});
</script>
