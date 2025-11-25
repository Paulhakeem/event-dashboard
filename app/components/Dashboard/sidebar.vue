<template>
  <main>
  <div
    id="hs-application-sidebar"
    class="hs-overlay [--auto-close:lg] 
      hs-overlay-open:translate-x-0
      -translate-x-full lg:translate-x-0
      transition-all duration-300 transform 
      w-64 h-full fixed inset-y-0 start-0 z-60 
      bg-white border-e border-gray-200 
      hidden lg:block lg:end-auto lg:bottom-0
      dark:bg-neutral-800 dark:border-neutral-700"
    role="dialog"
    tabindex="-1"
    aria-label="Sidebar"
  >
    <div class="relative flex flex-col h-full max-h-full">

      <!-- Header (logo + close btn mobile) -->
      <div class="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-700">
        <h1 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
          {{ user.role }}
        </h1>

        <!-- Close Button (Mobile only) -->
      </div>

      <!-- Sidebar Content -->
      <div
        class="h-full overflow-y-auto 
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-track]:bg-gray-100 
          [&::-webkit-scrollbar-thumb]:bg-gray-300 
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <nav class="p-4 space-y-1">
          <ul 
            v-for="menu in sidebarMenu" 
            :key="menu.name"
            @click="itemSelected(menu)"
            class="space-y-1"
          >
            <li>
              <a
                class="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-700 rounded-lg
                  hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                href="#"
              >
                <Icon :name="menu.icon" class="text-xl" />
                {{ menu.name }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  </div>
</main>

</template>

<script setup>
const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue"]);

const { sidebarMenu } = dashboardSidebar();
const {user}= useAuth()

const itemSelected = (menu) => {
  emit("update:modelValue", menu);
};
</script>
