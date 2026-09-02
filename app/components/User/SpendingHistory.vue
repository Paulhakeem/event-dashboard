<template>
  <section
    class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Spending history
        </h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400">
          Your ticket spend over the last six months.
        </p>
      </div>
      <span class="text-sm font-semibold text-emerald-600"
        >KES {{ totalSpent.toLocaleString() }}</span
      >
    </div>

    <div
      v-if="loading"
      class="mt-8 h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-700"
    ></div>
    <div
      v-else-if="error"
      class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      Unable to load spending history.
    </div>
    <div v-else class="mt-6 flex h-44 items-end gap-2 sm:gap-4">
      <div
        v-for="month in months"
        :key="month.label"
        class="flex h-full flex-1 flex-col items-center justify-end gap-2"
      >
        <span class="text-[11px] font-medium text-gray-500">{{
          month.amount ? `KES ${month.amount.toLocaleString()}` : "-"
        }}</span>
        <div
          class="flex h-28 w-full max-w-12 items-end rounded-t-lg bg-gray-100 dark:bg-neutral-700"
        >
          <div
            class="w-full rounded-t-lg bg-linear-to-t from-[#9d4e8a] to-pink-400 transition-all"
            :style="{ height: `${month.height}%` }"
          ></div>
        </div>
        <span class="text-xs text-gray-500">{{ month.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const { booking, loading, error } = useBookingData();
const totalSpent = computed(() =>
  booking.value.reduce((total, item) => total + Number(item.amount || 0), 0),
);
const months = computed(() => {
  const now = new Date();
  const values = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const amount = booking.value.reduce((total, item) => {
      const bookedAt = new Date(item.bookedAt || item.createdAt);
      return bookedAt.getFullYear() === date.getFullYear() &&
        bookedAt.getMonth() === date.getMonth()
        ? total + Number(item.amount || 0)
        : total;
    }, 0);
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      amount,
    };
  });
  const maximum = Math.max(...values.map((item) => item.amount), 1);
  return values.map((item) => ({
    ...item,
    height: item.amount ? Math.max((item.amount / maximum) * 100, 6) : 0,
  }));
});
</script>
