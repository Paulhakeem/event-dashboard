<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <!-- Top Navigation (Mobile Only) -->
    <div
      class="lg:hidden sticky top-0 inset-x-0 z-50 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between"
    >
      <h1 class="text-lg font-semibold dark:text-white">Dashboard</h1>

      <!-- Mobile Menu Button -->
      <button @click="openSidebar = true" class="p-2 text-xl">
        <Icon name="gg:menu-round" class="text-xl" />
      </button>
    </div>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-80 w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transform transition-transform duration-300 lg:translate-x-0"
      :class="openSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-full flex flex-col">
        <!-- Sidebar Header (Mobile Close Btn) -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700 lg:hidden"
        >
          <h2 class="text-lg font-semibold dark:text-white">Menu</h2>

          <button @click="openSidebar = false" class="p-2">
            <Icon name="zondicons:close-solid" class="text-xl" />
          </button>
        </div>

        <!-- Sidebar Links -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          <a
            href="#"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-800 bg-gray-100 dark:bg-neutral-700 dark:text-white"
          >
            <Icon name="ic:baseline-home" class="size-6" /> Dashboard
          </a>

          <button
            class="flex items-center w-full text-left gap-3 p-3 rounded-lg text-gray-800 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-200"
          >
            <Icon name="ic:baseline-account-circle" class="size-6" />
            Account
          </button>
        </nav>
      </div>
    </div>

    <!-- Overlay (mobile) -->
    <div
      v-if="openSidebar"
      @click="openSidebar = false"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
    ></div>

    <!-- Page Content -->
    <div class="lg:ml-64 px-4 sm:px-6 md:px-8 py-6">
      <h1 class="text-2xl font-bold dark:text-white">User Dashboard Content</h1>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const openSidebar = ref(false);
</script>
