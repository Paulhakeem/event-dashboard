<template>
  <div class="bg-white p-4 rounded-lg shadow flex flex-col">
    <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
    <p class="text-xl font-bold text-gray-800">{{ value }}</p>
    <span :class="changeClass">{{ change }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: String,
  change: String,
  negative: Boolean
})

const changeClass = computed(() =>
  props.negative
    ? 'text-red-500 text-sm'
    : 'text-green-500 text-sm'
)
</script>