<template>
  <div
    class="bg-[#0f0f13] border border-white/5 rounded-2xl p-6 flex flex-col gap-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-base font-semibold text-white">Tickets & Revenue</h2>
        <p class="text-xs text-white/30 mt-0.5">
          Monthly overview · {{ currentYear }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1.5 text-xs text-white/50">
          <span
            class="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block shadow-[0_0_6px_#a78bfa]"
          ></span>
          Tickets
        </span>
        <span class="flex items-center gap-1.5 text-xs text-white/50">
          <span
            class="w-2.5 h-2.5 rounded-full bg-[#16C851] inline-block shadow-[0_0_6px_#22d3ee]"
          ></span>
          Revenue
        </span>
      </div>
    </div>

    <!-- Summary pills -->
    <div class="grid grid-cols-3 gap-3">
      <div
        class="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-white leading-none">{{
          totalTickets.toLocaleString()
        }}</span>
        <span class="text-xs text-white/30">Total Tickets</span>
      </div>
      <div
        class="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-[#16C851] leading-none"
          >KES {{ totalRevenue.toLocaleString() }}</span
        >
        <span class="text-xs text-white/30">Total Revenue</span>
      </div>
      <div
        class="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex flex-col gap-1"
      >
        <span class="text-lg font-bold text-white leading-none">{{
          peakMonth
        }}</span>
        <span class="text-xs text-white/30">Peak Month</span>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div class="flex items-end gap-1 h-40 px-2">
        <div
          v-for="n in 12"
          :key="n"
          class="flex-1 bg-white/5 rounded-t-md animate-pulse"
          :style="{ height: 30 + (Math.floor(n * 5.3) % 60) + '%' }"
        ></div>
      </div>
      <div class="flex gap-1 px-2">
        <div
          v-for="n in 12"
          :key="n"
          class="flex-1 h-2 bg-white/5 rounded animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-10 gap-3 text-center"
    >
      <div
        class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"
      >
        <Icon
          name="material-symbols:error-outline"
          class="text-lg text-red-400"
        />
      </div>
      <p class="text-sm text-red-400">{{ error }}</p>
      <button
        @click="fetchData"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
      >
        <Icon name="material-symbols:refresh" class="text-sm" />
        Retry
      </button>
    </div>

    <!-- Chart -->
    <div v-else class="relative w-full" ref="chartWrapEl">
      <svg
        :viewBox="`0 0 ${W} ${H}`"
        preserveAspectRatio="none"
        class="w-full"
        :style="{ height: '200px' }"
      >
        <defs>
          <!-- Ticket gradient — violet/purple glow -->
          <linearGradient id="tgTicket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
          </linearGradient>
          <!-- Revenue gradient — cyan glow -->
          <linearGradient id="tgRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#22d3ee" stop-opacity="0" />
          </linearGradient>
          <!-- Ticket line glow filter -->
          <filter id="glowViolet" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Revenue line glow filter -->
          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Grid lines — very subtle on dark -->
        <line
          v-for="y in gridYs"
          :key="y"
          :x1="PL"
          :y1="y"
          :x2="W - PR"
          :y2="y"
          stroke="rgba(255,255,255,0.04)"
          stroke-width="1"
        />

        <!-- Area fills -->
        <path :d="revenueAreaPath" fill="url(#tgRevenue)" />
        <path :d="ticketAreaPath" fill="url(#tgTicket)" />

        <!-- Revenue line with glow -->
        <path
          :d="revenueLinePath"
          fill="none"
          stroke="#22d3ee"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#glowCyan)"
          style="
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: drawLine 1.2s ease forwards;
          "
        />

        <!-- Ticket line with glow -->
        <path
          :d="ticketLinePath"
          fill="none"
          stroke="#a78bfa"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#glowViolet)"
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
          fill="#0f0f13"
          stroke="#a78bfa"
          stroke-width="2"
          filter="url(#glowViolet)"
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
          fill="#0f0f13"
          stroke="#22d3ee"
          stroke-width="2"
          filter="url(#glowCyan)"
          class="cursor-pointer"
          @mouseenter="handleTip($event, i)"
          @mouseleave="hideTip"
        />

        <!-- X axis labels -->
        <text
          v-for="(m, i) in MONTHS"
          :key="m"
          :x="PL + (i / 11) * (W - PL - PR)"
          :y="H - 3"
          text-anchor="middle"
          fill="rgba(255,255,255,0.15)"
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
          class="absolute z-10 bg-[#1a1a24] border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs pointer-events-none whitespace-nowrap shadow-2xl"
          :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
        >
          <p class="font-semibold text-sm mb-1.5 text-white">
            {{ MONTHS_FULL[tip.idx] }}
          </p>
          <p class="flex items-center gap-1.5 text-white/60">
            <span
              class="w-2 h-2 rounded-full bg-violet-400 inline-block shadow-[0_0_4px_#a78bfa]"
            ></span>
            {{ monthlyData[tip.idx]?.tickets || 0 }} tickets
          </p>
          <p class="flex items-center gap-1.5 text-white/60 mt-1">
            <span
              class="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_4px_#22d3ee]"
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
