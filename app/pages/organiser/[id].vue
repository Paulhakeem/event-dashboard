<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Mobile Header -->
    <header
      class="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm lg:hidden"
    >
      <h1 class="text-lg font-bold text-gray-900">Organiser Dashboard</h1>

      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Icon
          :name="sidebarOpen ? 'material-symbols:close' : 'material-symbols:menu'"
          class="text-2xl text-gray-700"
        />
      </button>
    </header>

    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        @click="toggleSidebar"
      />
    </Transition>

    <!-- Sidebar (Mobile) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="sidebarOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
      >
        <div class="h-full px-3 py-4 overflow-y-auto">
          <!-- Logo -->
          <div class="flex items-center gap-2 mb-6 px-2">
            <Icon name="material-symbols:dashboard" class="text-2xl text-[#9c4e8b]" />
            <span class="text-lg font-semibold">Organiser</span>
          </div>

          <!-- Menu -->
          <ul class="space-y-1">
            <li v-for="menu in sidebar" :key="menu.title">
              <button
                @click="selectMenu(menu)"
                class="flex w-full items-center gap-3 px-3 py-2 rounded-lg transition"
                :class="
                  activeName === menu.component
                    ? 'bg-neutral-tertiary text-fg-brand'
                    : 'hover:bg-neutral-tertiary hover:text-fg-brand'
                "
              >
                <Icon :name="menu.icon" class="text-xl" />
                <span>{{ menu.title }}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </Transition>

    <!-- Sidebar (Desktop) -->
    <aside
      class="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200"
    >
      <div class="h-full px-3 py-4 overflow-y-auto">
        <!-- Logo -->
        <div class="flex items-center gap-2 mb-6 px-2">
          <Icon name="material-symbols:dashboard" class="text-2xl text-[#9c4e8b]" />
          <span class="text-lg font-semibold">Organiser</span>
        </div>

        <!-- Menu -->
        <ul class="space-y-1">
          <li v-for="menu in sidebar" :key="menu.title">
            <button
              @click="selectMenu(menu)"
              class="flex w-full items-center gap-3 px-3 py-2 rounded-lg transition"
              :class="
                activeName === menu.component
                  ? 'bg-neutral-tertiary text-fg-brand'
                  : 'hover:bg-neutral-tertiary hover:text-fg-brand'
              "
            >
              <Icon :name="menu.icon" class="text-xl" />
              <span>{{ menu.title }}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:pl-64">
      <div class="px-4 sm:px-6 pt-4 pb-6">
        <component :is="currentComponent" class="animate-fade-in" />
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import useOrganiserSidebar from "~/composables/organiserSidebar";

// organiser components
import OrganiserDashboard from "~/components/organiser/Dashboard.vue";
import OrganiserCreateEvents from "~/components/organiser/CreateEvents.vue";
import OrganiserTrackEvents from "~/components/organiser/TrackEvents.vue";
import OrganiserNotifications from "~/components/organiser/Notifications.vue";
import OrganiserInsights from "~/components/organiser/Insights.vue";

const { sidebar } = useOrganiserSidebar();

const componentsMap = {
  OrganiserDashboard,
  OrganiserCreateEvents,
  OrganiserTrackEvents,
  OrganiserNotifications,
  OrganiserInsights,
};

const activeName = ref(sidebar.value?.[0]?.component || "OrganiserDashboard");
const currentComponent = computed(
  () => componentsMap[activeName.value] || OrganiserDashboard,
);
const sidebarOpen = ref(false);
const isMobile = ref(false);

function selectMenu(menu) {
  activeName.value = menu.component;
  // Close sidebar on mobile after selection
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

// Detect screen size changes
function checkMobile() {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
  if (!isMobile.value) {
    sidebarOpen.value = false; // Reset sidebar state on desktop
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
