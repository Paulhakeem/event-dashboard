<template>
  <div class="w-full px-2 sm:px-0">
    <TabGroup>
      <!-- Tabs -->
      <TabList class="flex space-x-1 rounded-xl bg-[#9c4e8b] p-1">
        <Tab
          v-for="category in Object.keys(categories)"
          as="template"
          :key="category"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
            ]"
          >
            {{ category }}
          </button>
        </Tab>
      </TabList>

      <!-- Panels -->
      <TabPanels class="mt-10">
        <TabPanel
          v-for="(posts, idx) in Object.values(categories)"
          :key="idx"
          :class="[
            'rounded-xl bg-gray-200 p-3',
            'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
          ]"
        >
          <ul>
            <li
              v-for="post in posts"
              :key="post.id"
              class="relative rounded-md p-3 hover:bg-gray-100"
            >
              <!-- Show component if provided -->
              <component
                v-if="post.component"
                :is="post.component"
              />
            </li>
          </ul>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

// Import your component
import createEvent from "./createEvent.vue";

const categories = ref({
  Events: [
    {
      id: 1,
      title: "Does drinking coffee make you smarter?",
      date: "5h ago",
      commentCount: 5,
      shareCount: 2,
    },
  ],
  "Create Event": [
    {
      id: 1,
      component: createEvent, // ✅ reference the imported component
    },
  ],
  "Popular Events": [
    {
      id: 1,
      title: "Ask Me Anything: 10 answers to your questions about coffee",
      date: "2d ago",
      commentCount: 9,
      shareCount: 5,
    },
  ],
});
</script>
