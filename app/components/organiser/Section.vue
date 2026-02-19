<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    <!-- Total Income -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Total Income</span>
        <svg class="w-6 h-6 opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"/>
          <path d="M12 2v2m0 16v2m10-10h-2M4 12H2"/>
        </svg>
      </div>
      <p class="text-2xl font-bold mt-2">Ksh0</p>
      <p class="text-sm mt-1 text-green-200">+0%</p>
    </div>

    <!-- Total Events -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Total Events</span>
        <svg class="w-6 h-6 opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9H3v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <p class="text-2xl font-bold mt-2">{{ events.length }}</p>
      <p class="text-sm mt-1 text-green-200">+0%</p>
    </div>

    <!-- Booked Events -->
    <div class="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Booked Events</span>
        <svg class="w-6 h-6 opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <p class="text-2xl font-bold mt-2">0</p>
      <p class="text-sm mt-1 text-green-200">+0%</p>
    </div>

    <!-- Cancelled Events -->
    <div class="bg-linear-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:scale-105 transform transition">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Cancelled Events</span>
        <svg class="w-6 h-6 opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <p class="text-2xl font-bold mt-2">0%</p>
      <p class="text-sm mt-1 text-red-200">+0%</p>
    </div>
  </div>
</template>

<script setup>
const { events} = organiserEvents()
</script>
