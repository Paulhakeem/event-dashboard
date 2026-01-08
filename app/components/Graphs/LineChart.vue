<template>
  <div
    class="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
  >
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-2">
      <div>
        <h2 class="text-sm text-gray-500 dark:text-neutral-500">Event popularity</h2>
      </div>
    </div>
    <!-- End Header -->

    <!-- chart graph -->
   <div class="mt-20 flex items-center justify-center">
    <div class="flex flex-col md:flex-row items-center gap-8">
      <!-- Pie chart -->
      <div
        class="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-[conic-gradient(#9d4e8a_0_var(--p1),#3a83f6_var(--p1)_calc(var(--p1)+var(--p2)),#16c851_calc(var(--p1)+var(--p2))_100%)]"
        style="--p1: 40%; --p2: 35%; --p3: 25%"
        aria-label="Pie chart showing 3 segments"
      ></div>

      <!-- Legend -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="inline-block w-3 h-3 rounded-full bg-[#9d4e8a]"></span>
          <span class="text-gray-700 font-medium text-sm">Entertainment</span>
          <span class="text-gray-500">40%</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-block w-3 h-3 rounded-full bg-[#3a83f6]"></span>
          <span class="text-gray-700 font-medium text-sm">Arts & Culture</span>
          <span class="text-gray-500">35%</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-block w-3 h-3 rounded-full bg-[#16c851]"></span>
          <span class="text-gray-700 font-medium text-sm">Tech & Business</span>
          <span class="text-gray-500">25%</span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
</script>
