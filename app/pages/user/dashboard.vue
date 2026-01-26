<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transition-transform duration-300 ease-in-out overflow-hidden w-64 md:w-20 md:hover:w-52"
      :class="{
        '-translate-x-full': !sidebarOpen && isMobile,
        'translate-x-0': sidebarOpen || !isMobile,
      }"
    >
      <div class="h-full flex flex-col">
        <!-- Sidebar Links -->
        <nav
          v-for="item in userSidebarMenu"
          :key="item.id"
          @click="itemSelected(item)"
          class="p-2"
        >
          <NuxtLink
            class="group flex items-center gap-3 p-3 rounded-lg text-gray-800 dark:text-gray-200 cursor-pointer transition-colors"
            :class="
              currentComponent === item.component
                ? 'bg-gray-500 dark:bg-neutral-700'
                : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
            "
          >
            <Icon :name="item.icon" class="text-lg shrink-0" />
            <span
              class="text-gray-800 whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            >
              {{ item.name }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Page Content -->
    <main class="flex-1 md:ml-20 p-6">
      <button
        class="md:hidden fixed top-4 left-4 z-50 px-3 py-2 bg-[#9d4e8a] text-white rounded flex items-center gap-2"
        @click="sidebarOpen = !sidebarOpen"
      >
        <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
      </button>

      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const { userSidebarMenu } = userDashboardBar();

const currentComponent = ref(userSidebarMenu[0].component);
const sidebarOpen = ref(false);
const isMobile = ref(false);

function itemSelected(menu) {
  currentComponent.value = menu.component;
  if (isMobile.value) sidebarOpen.value = false; // auto-close on mobile
}

// Track screen size
function checkMobile() {
  isMobile.value = window.innerWidth < 768; // md breakpoint
}
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
