<template>
  <aside
    id="top-bar-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div
      class="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default"
    >
      <a href="https://flowbite.com/" class="flex items-center ps-2.5 mb-5">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="h-6 me-3"
          alt="Flowbite Logo"
        />
        <span
          class="self-center text-lg text-heading font-semibold whitespace-nowrap"
          >Organiser</span
        >
      </a>
      <ul class="space-y-2 font-medium">
        <li v-for="menu in sidebar" :key="menu.title">
          <a
            href="#"
            @click.prevent="selectMenu(menu)"
            :class="[
              'flex items-center px-2 py-1.5 text-body rounded-base group',
              activeName === menu.component ? 'bg-neutral-tertiary text-fg-brand' : 'hover:bg-neutral-tertiary hover:text-fg-brand'
            ]"
          >
            <icon
              :name="menu.icon"
              class="shrink-0 text-2xl transition duration-75"
            />
            <span class="ms-3">{{ menu.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <!-- body -->
  <div class="p-4 sm:ml-64 mt-14">
    <main class="flex-1 p-6 space-y-6 overflow-y-auto">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useOrganiserSidebar from "~/composables/organiserSidebar";

// organiser components
import OrganiserDashboard from '~/components/organiser/Dashboard.vue';
import OrganiserCreateEvents from '~/components/organiser/CreateEvents.vue';
import OrganiserTrackEvents from '~/components/organiser/TrackEvents.vue';
import OrganiserNotifications from '~/components/organiser/Notifications.vue';
import OrganiserInsights from '~/components/organiser/Insights.vue';

const { sidebar } = useOrganiserSidebar();

const componentsMap = {
  OrganiserDashboard,
  OrganiserCreateEvents,
  OrganiserTrackEvents,
  OrganiserNotifications,
  OrganiserInsights,
};

const activeName = ref(sidebar.value?.[0]?.component || 'OrganiserDashboard');
const currentComponent = computed(() => componentsMap[activeName.value] || OrganiserDashboard);

function selectMenu(menu) {
  activeName.value = menu.component;
}

</script>
