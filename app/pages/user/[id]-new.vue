<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col md:flex-row">
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
          class="p-2 md:p-1"
        >
          <NuxtLink
            class="group flex items-center gap-3 px-3 py-2 md:py-3 rounded-lg text-gray-800 dark:text-gray-200 cursor-pointer transition-all duration-200 text-sm md:text-base"
            :class="
              currentComponent === item.component
                ? 'bg-gradient-to-r from-[#9c4e8b] to-[#cb35a3] text-white dark:bg-gradient-to-r dark:from-[#9c4e8b] dark:to-[#cb35a3]'
                : 'hover:bg-gradient-to-r hover:from-[#9c4e8b]/10 hover:to-transparent dark:hover:bg-neutral-700'
            "
          >
            <Icon :name="item.icon" class="text-lg shrink-0" />
            <span
              class="text-gray-800 dark:text-gray-200 whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
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
      class="fixed inset-0 bg-black/40 md:hidden z-30"
      @click="sidebarOpen = false"
    ></div>

    <!-- Page Content -->
    <main class="flex-1 md:ml-20 p-4 sm:p-6 md:p-8">
      <!-- Mobile Menu Button -->
      <button
        class="md:hidden fixed top-4 left-4 z-50 px-3 py-2 bg-gradient-to-r from-[#9c4e8b] to-[#cb35a3] text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
        @click="sidebarOpen = !sidebarOpen"
      >
        <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
        <span class="text-sm font-semibold">Menu</span>
      </button>

      <!-- Add padding for mobile menu button -->
      <div class="mt-16 md:mt-0">
        <component :is="currentComponent" />
      </div>
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
