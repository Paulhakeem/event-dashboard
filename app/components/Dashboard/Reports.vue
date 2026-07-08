<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Reports</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Financial overview at a glance
        </p>
      </div>
      <a
        href="#"
        class="inline-flex items-center gap-1 text-xs font-semibold text-[#9c4e8b] hover:text-[#7c3a6d] transition-colors"
      >
        View all
        <Icon name="material-symbols:arrow-forward" class="text-sm" />
      </a>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Total Revenue -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9c4e8b] to-[#7c3a6d] p-5 shadow-lg shadow-[#9c4e8b]/20 hover:-translate-y-1 transition-transform duration-200"
      >
        <!-- Background glow -->
        <div
          class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"
        ></div>
        <div
          class="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 blur-lg"
        ></div>

        <div class="relative z-10">
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4"
          >
            <Icon name="solar:wallet-money-bold" class="text-xl text-white" />
          </div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2"
          >
            Total Revenue
          </p>
          <p class="text-2xl font-bold text-white leading-none">
            <span class="text-sm font-semibold text-white/70 mr-0.5">KSH</span>
            {{ totalRevenue }}
          </p>
          <!-- Trend -->
          <div class="mt-3 flex items-center gap-1 text-xs text-white/60">
            <Icon
              name="material-symbols:trending-up"
              class="text-green-300 text-sm"
            />
            <span class="text-green-300 font-semibold">+0%</span>
            vs last month
          </div>
        </div>
      </div>

      <!-- Total Refunds -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] p-5 shadow-lg shadow-red-500/20 hover:-translate-y-1 transition-transform duration-200"
      >
        <div
          class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"
        ></div>
        <div
          class="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 blur-lg"
        ></div>

        <div class="relative z-10">
          <div
            class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4"
          >
            <Icon name="solar:refresh-bold" class="text-xl text-white" />
          </div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2"
          >
            Total Refunds
          </p>
          <p class="text-2xl font-bold text-white leading-none">
            <span class="text-sm font-semibold text-white/70 mr-0.5">KSH</span>
            {{ totalRefund }}
          </p>
          <div class="mt-3 flex items-center gap-1 text-xs text-white/60">
            <Icon
              name="material-symbols:trending-down"
              class="text-red-200 text-sm"
            />
            <span class="text-red-200 font-semibold">-0%</span>
            vs last month
          </div>
        </div>
      </div>

      <!-- Total Orders -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] p-5 shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition-transform duration-200"
      >
        <div
          class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"
        ></div>
        <div
          class="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 blur-lg"
        ></div>

        <div class="relative z-10">
          <div
            class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4"
          >
            <Icon name="solar:bag-bold" class="text-xl text-white" />
          </div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2"
          >
            Total Tickets
          </p>
          <p class="text-2xl font-bold text-white leading-none">
            {{ totalTicketCount }}
          </p>
          <div class="mt-3 flex items-center gap-1 text-xs text-white/60">
            <Icon
              name="material-symbols:trending-up"
              class="text-green-300 text-sm"
            />
            <span class="text-green-300 font-semibold">+0%</span>
            vs last month
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- graphs section -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
    <GraphsRevenueRefund
      :revenue-data="revenueByMonth"
      :refund-data="refundsByMonth"
    />
    <GraphsRefundTickets />
  </div>
  <div>
    <GraphsTraffic />
  </div>
</template>

<script setup>
const { totalTicketCount, cancelledTicketCount } = useTickets();

const { totalRevenue, loading, totalRefund } = useReport();
</script>
