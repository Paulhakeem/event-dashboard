<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-base font-semibold text-gray-900">Tickets & Revenue</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Monthly overview · {{ currentYear }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1.5 text-xs text-gray-500">
          <span
            class="w-2.5 h-2.5 rounded-full bg-[#9c4e8b] inline-block"
          ></span>
          Tickets
        </span>
        <span class="flex items-center gap-1.5 text-xs text-gray-500">
          <span
            class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"
          ></span>
          Revenue
        </span>
      </div>
    </div>

    <!-- Summary pills -->
    <div class="grid grid-cols-3 gap-3">
      <div
        class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-gray-900 leading-none">{{
          totalTickets.toLocaleString()
        }}</span>
        <span class="text-xs text-gray-400">Total Tickets</span>
      </div>
      <div
        class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-emerald-600 leading-none"
          >KES {{ totalRevenue.toLocaleString() }}</span
        >
        <span class="text-xs text-gray-400">Total Revenue</span>
      </div>
      <div
        class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-gray-900 leading-none">{{
          peakMonth
        }}</span>
        <span class="text-xs text-gray-400">Peak Month</span>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div class="flex items-end gap-1 h-40 px-2">
        <div
          v-for="n in 12"
          :key="n"
          class="flex-1 bg-gray-100 rounded-t-md animate-pulse"
          :style="{ height: 30 + (Math.floor(n * 5.3) % 60) + '%' }"
        ></div>
      </div>
      <div class="flex gap-1 px-2">
        <div
          v-for="n in 12"
          :key="n"
          class="flex-1 h-2 bg-gray-100 rounded animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-10 gap-3 text-center"
    >
      <div
        class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"
      >
        <Icon
          name="material-symbols:error-outline"
          class="text-lg text-red-400"
        />
      </div>
      <p class="text-sm text-red-500">{{ error }}</p>
      <button
        @click="fetchData"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition-colors"
      >
        <Icon name="material-symbols:refresh" class="text-sm" />
        Retry
      </button>
    </div>

    <!-- Chart -->
    <!-- FIX 1: ref="chartWrap" must bind to a local ref, not one from the composable -->
    <div v-else class="relative w-full" ref="chartWrapEl">
      <svg
        :viewBox="`0 0 ${W} ${H}`"
        preserveAspectRatio="none"
        class="w-full"
        :style="{ height: '200px' }"
      >
        <defs>
          <linearGradient id="tgTicket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9c4e8b" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#9c4e8b" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="tgRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        <line
          v-for="y in gridYs"
          :key="y"
          :x1="PL"
          :y1="y"
          :x2="W - PR"
          :y2="y"
          stroke="#f3f4f6"
          stroke-width="1"
        />

        <!-- Area fills -->
        <path :d="revenueAreaPath" fill="url(#tgRevenue)" />
        <path :d="ticketAreaPath" fill="url(#tgTicket)" />

        <!-- Lines -->
        <path
          :d="revenueLinePath"
          fill="none"
          stroke="#10b981"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          style="
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: drawLine 1.2s ease forwards;
          "
        />
        <path
          :d="ticketLinePath"
          fill="none"
          stroke="#9c4e8b"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          style="
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: drawLine 1.4s ease forwards;
          "
        />

        <!-- Ticket dots -->
        <circle
          v-for="(pt, i) in ticketPoints"
          :key="'t' + i"
          :cx="pt.x"
          :cy="pt.y"
          r="3.5"
          fill="white"
          stroke="#9c4e8b"
          stroke-width="2"
          class="cursor-pointer"
          @mouseenter="handleTip($event, i)"
          @mouseleave="hideTip"
        />

        <!-- Revenue dots -->
        <circle
          v-for="(pt, i) in revenuePoints"
          :key="'r' + i"
          :cx="pt.x"
          :cy="pt.y"
          r="3.5"
          fill="white"
          stroke="#10b981"
          stroke-width="2"
          class="cursor-pointer"
          @mouseenter="handleTip($event, i)"
          @mouseleave="hideTip"
        />

        <!-- X axis labels -->
        <!-- FIX 2: xAt was not returned from composable — use inline calculation -->
        <text
          v-for="(m, i) in MONTHS"
          :key="m"
          :x="PL + (i / 11) * (W - PL - PR)"
          :y="H - 3"
          text-anchor="middle"
          fill="#d1d5db"
          style="font-size: 8px; font-family: inherit"
        >
          {{ m }}
        </text>
      </svg>

      <!-- Tooltip -->
      <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="tip.visible"
          class="absolute z-10 bg-gray-900 text-white rounded-xl px-3 py-2.5 text-xs pointer-events-none whitespace-nowrap shadow-xl"
          :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
        >
          <p class="font-semibold text-sm mb-1.5">{{ MONTHS_FULL[tip.idx] }}</p>
          <p class="flex items-center gap-1.5 text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#9c4e8b] inline-block"></span>
            {{ monthlyData[tip.idx]?.tickets || 0 }} tickets
          </p>
          <p class="flex items-center gap-1.5 text-gray-300 mt-1">
            <span
              class="w-2 h-2 rounded-full bg-emerald-400 inline-block"
            ></span>
            KES {{ (monthlyData[tip.idx]?.revenue || 0).toLocaleString() }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
const {
  loading,
  error,
  totalTickets,
  totalRevenue,
  peakMonth,
  ticketLinePath,
  revenueLinePath,
  ticketAreaPath,
  revenueAreaPath,
  gridYs,
  tip,
  showTip,
  hideTip,
  W,
  H,
  PL,
  PR,
  MONTHS,
  MONTHS_FULL,
  currentYear,
  monthlyData,
  fetchData,
  ticketPoints,
  revenuePoints,
} = getTickets();

const chartWrapEl = ref(null);

const handleTip = (e, idx) => {
  const rect = chartWrapEl.value?.getBoundingClientRect();
  if (!rect) return;
  tip.value = {
    visible: true,
    x: e.clientX - rect.left + 14,
    y: e.clientY - rect.top - 70,
    idx,
  };
};
</script>

<style scoped>
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
