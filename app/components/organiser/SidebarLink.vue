<template>
  <a
    href="#"
    :class="[
      'flex items-center gap-3 px-4 py-2 rounded-lg transition',
      active
        ? 'bg-white text-purple-600 font-semibold shadow'
        : 'hover:bg-white/10'
    ]"
  >
    <span class="text-lg">{{ icon }}</span>
    <span class="text-gray-700">{{ label }}</span>
  </a>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  active: Boolean
})
</script>