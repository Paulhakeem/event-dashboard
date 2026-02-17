<template>
  <div class="w-full">
    <!-- Pending Events Alert -->
    <div class="mb-6">
      <DashboardPendingEvent />
    </div>

    <!-- Tab Navigation -->
    <TabGroup>
      <TabList
        class="flex space-x-1 rounded-lg bg-white p-1 shadow-md border border-gray-200 sticky top-0 z-10"
      >
        <Tab
          v-for="category in Object.keys(categories)"
          as="template"
          :key="category"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'px-6 py-3 text-sm font-semibold leading-5 rounded-lg transition-all duration-200',
              'ring-white/60 focus:outline-none',
              selected
                ? 'bg-[#9c4e8b] text-white shadow-md'
                : 'text-gray-700 hover:text-[#9c4e8b] hover:bg-gray-50',
            ]"
          >
            <Icon
              v-if="category === 'Events'"
              name="material-symbols:event"
              class="inline mr-2"
            />
            <Icon
              v-else-if="category === 'Create Event'"
              name="material-symbols:add-circle"
              class="inline mr-2"
            />
            <Icon
              v-else-if="category === 'Booked Events'"
              name="material-symbols:confirmation-number"
              class="inline mr-2"
            />
            {{ category }}
          </button>
        </Tab>
      </TabList>

      <!-- Tab Content -->
      <TabPanels class="mt-6">
        <TabPanel
          v-for="(posts, idx) in Object.values(categories)"
          :key="idx"
          class="rounded-xl bg-white border border-gray-200 shadow-sm p-6 animate-fadeIn"
        >
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center py-16">
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c4e8b] mx-auto mb-4"
              ></div>
              <p class="text-gray-600 font-medium">Loading content...</p>
            </div>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <Icon
                name="material-symbols:error-outline"
                class="text-3xl text-red-500 flex-shrink-0"
              />
              <div>
                <h3 class="font-semibold text-red-800 mb-1">
                  Error Loading Content
                </h3>
                <p class="text-red-700 text-sm">{{ error }}</p>
                <button
                  @click="retryLoad"
                  class="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-else>
            <ul class="space-y-4">
              <li v-for="post in posts" :key="post.id" class="relative">
                <!-- Show component if provided -->
                <component v-if="post.component" :is="post.component" />
              </li>
            </ul>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>

    <!-- Add CSS for animation -->
  </div>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

// Import your component
import createEvent from "./createEvent.vue";
import totalEvents from "../Dashboard/getEvents.vue";
import BookedEvents from "./BookedEvents.vue";

const categories = ref({
  Events: [
    {
      id: 1,
      component: totalEvents, // reference the imported component
    },
  ],
  "Create Event": [
    {
      id: 1,
      component: createEvent, // reference the imported component
    },
  ],
  "Booked Events": [
    {
      id: 1,
      component: BookedEvents,
    },
  ],
});

// Loading and error states
const isLoading = ref(false);
const error = ref(null);

const retryLoad = () => {
  isLoading.value = false;
  error.value = null;
};

onMounted(() => {
  // Simulate any initial data loading if needed
  isLoading.value = false;
});
</script>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
