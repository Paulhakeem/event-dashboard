<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <!-- HEADER -->
    <header
      class="sticky top-0 inset-x-0 z-30 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-gray-200 dark:border-neutral-800 shadow-sm"
    >
      <nav class="flex items-center gap-3 px-4 sm:px-6 py-3">
        <!-- Toggle Button (Mobile Only) -->
        <button
          class="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          @click="toggleMenu"
        >
          <Icon
            v-if="!openMenu"
            name="subway:menu"
            class="text-2xl text-[#9d4e8a]"
          />
        </button>

        <!-- Search -->
        <Dashboard-search class="flex-1" />
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <Icon
            :name="
              isDark
                ? 'material-symbols:light-mode-outline-rounded'
                : 'material-symbols:dark-mode-outline-rounded'
            "
            class="text-xl"
          />
        </button>
      </nav>
    </header>

    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="openMenu"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="toggleMenu"
      />
    </Transition>

    <!-- Sidebar (Mobile) -->
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="openMenu"
        class="fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-neutral-900 shadow-xl lg:hidden"
      >
        <Dashboard-sidebar v-model="itemSelected" />
      </aside>
    </Transition>

    <!-- Sidebar (Desktop) -->
    <aside
      class="hidden lg:block fixed inset-y-0 start-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 shadow-sm"
    >
      <Dashboard-sidebar v-model="itemSelected" />
    </aside>

    <!-- Main Content -->
    <main class="lg:ps-64">
      <div class="p-4 sm:p-6 space-y-6">
        <component
          v-if="itemSelected?.component"
          :is="itemSelected.component"
          class="animate-fade-in"
        />
      </div>
    </main>
  </div>
</template>
<script setup>
const openMenu = ref(false);
const { sidebarMenu } = dashboardSidebar();
const itemSelected = ref(sidebarMenu[0]);
const { isDark, toggleTheme } = useTheme();

const toggleMenu = () => {
  openMenu.value = !openMenu.value;
};
</script>
