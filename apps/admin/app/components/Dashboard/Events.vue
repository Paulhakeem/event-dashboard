<template>
  <div class="w-full min-h-screen bg-gray-50 font-sans">
    <!-- Pending Events Alert -->
    <div class="px-4 pt-6 sm:px-6 lg:px-8">
      <DashboardPendingEvent />
    </div>

    <!-- Tab Navigation -->
    <TabGroup>
      <!-- Sticky Tab Bar -->
      <div
        class="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8 pt-4 pb-0"
      >
        <TabList class="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2">
          <Tab
            v-for="category in Object.keys(categories)"
            as="template"
            :key="category"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-all duration-200 border-b-2 focus:outline-none flex-shrink-0',
                selected
                  ? 'border-[#9c4e8b] text-[#9c4e8b] bg-white shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-[#9c4e8b] hover:border-[#9c4e8b]/30 hover:bg-white/60',
              ]"
            >
              <Icon
                v-if="category === 'Events'"
                name="material-symbols:event"
                class="text-base flex-shrink-0"
              />
              <Icon
                v-else-if="category === 'Create Event'"
                name="material-symbols:add-circle"
                class="text-base flex-shrink-0"
              />
              <Icon
                v-else-if="category === 'Booked Events'"
                name="material-symbols:confirmation-number"
                class="text-base flex-shrink-0"
              />
              <Icon
                v-else-if="category === 'Cancelled Events'"
                name="material-symbols:cancel"
                class="text-base flex-shrink-0"
              />
              <!-- On mobile, show short label -->
              <span class="hidden sm:inline">{{ category }}</span>
              <span class="sm:hidden">{{ shortLabel(category) }}</span>
            </button>
          </Tab>
        </TabList>
      </div>

      <!-- Tab Panels -->
      <TabPanels class="px-4 sm:px-6 lg:px-8 py-6">
        <TabPanel
          v-for="(posts, idx) in Object.values(categories)"
          :key="idx"
          class="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 sm:p-6 animate-fadeIn focus:outline-none"
        >
          <!-- Content -->
          <div>
            <ul class="space-y-4">
              <li v-for="post in posts" :key="post.id" class="relative">
                <component v-if="post.component" :is="post.component" />
              </li>
            </ul>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

import createEvent from "./createEvent.vue";
import totalEvents from "../Dashboard/getEvents.vue";
import BookedEvents from "./BookedEvents.vue";
import CancelledEvents from "./CancelledEvents.vue";

const categories = ref({
  Events: [{ id: 1, component: totalEvents }],
  "Create Event": [{ id: 1, component: createEvent }],
  "Booked Events": [{ id: 1, component: BookedEvents }],
  "Cancelled Events": [{ id: 1, component: CancelledEvents }],
});

// Short labels for mobile tab bar
const shortLabel = (category) => {
  const map = {
    Events: "Events",
    "Create Event": "Create",
    "Booked Events": "Booked",
    "Cancelled Events": "Cancelled",
  };
  return map[category] ?? category;
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

/* Hide scrollbar on tab list for mobile */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
