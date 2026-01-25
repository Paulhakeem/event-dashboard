<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:ticket" class="text-[#9d4e8a]" />All Events
      </h2>
      <p class="text-sm text-gray-500">
       Browse and discover events from all organizations
      </p>
    </div>
  </div>
  <!-- Dropdown -->
   <div class="flex justify-start space-x-4 mt-6">
    <UserEventsDropdown />
    <UserEventsCateEvent />
    </div>
     <!-- Selected component (full width) -->
    <div class="mt-4 ">
      <component v-if="selectedItem.component" :is="selectedItem.component" class="w-full" />
    </div>
</template>

<script setup>
const { selectedItem } = userDropdown()
</script>

