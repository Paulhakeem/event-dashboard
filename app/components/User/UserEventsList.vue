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

    <!-- Dropdown -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
      <div class="w-full sm:w-48">
        <UserEventsDropdown />
      </div>
      <div class="w-full sm:w-48">
        <UserEventsCateEvent />
      </div>
    </div>

    <!-- Selected component (full width) -->
    <div class="mt-4">
      <component
        v-if="selectedItem.component"
        :is="selectedItem.component"
        class="w-full"
      />
      <div
        v-else
        class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-400"
      >
        <p class="font-semibold text-slate-900 dark:text-slate-100">
          Content not available yet
        </p>
        <p class="mt-2">
          The <span class="font-medium">{{ selectedItem.name }}</span> view is
          not yet implemented.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userDropdown } from "~/composables/userDropdown";
const { selectedItem } = userDropdown();
</script>
