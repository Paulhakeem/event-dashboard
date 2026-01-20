<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 w-20 hover:w-52 transition-all duration-300 ease-in-out overflow-hidden"
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
            <!-- Text label hidden until hover -->
            <span
              class="text-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {{ item.name }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Page Content -->
    <main class="flex-1 ml-20 p-6">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
const { userSidebarMenu } = userDashboardBar();

const currentComponent = ref(userSidebarMenu[0].component);
function itemSelected(menu) {
  currentComponent.value = menu.component;
}
</script>
