<template>
  <button
    type="button"
    @click="toggleTheme"
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101d3a] text-amber-300 shadow-lg shadow-slate-950/20 ring-1 ring-amber-300/40 transition hover:bg-[#13284b] hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
    aria-label="Toggle dark and light mode"
    title="Toggle dark and light mode"
  >
    <ClientOnly>
      <Icon
        :name="isDark ? 'mdi:white-balance-sunny' : 'mdi:weather-night'"
        class="text-xl"
      />
      <template #fallback>
        <Icon name="mdi:weather-night" class="text-xl" />
      </template>
    </ClientOnly>
  </button>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme();
</script>
