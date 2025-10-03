<template>
  <main>
    <div
      id="hs-application-sidebar"
      class="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-65 h-full hidden fixed inset-y-0 start-0 z-60 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
      role="dialog"
      tabindex="-1"
      aria-label="Sidebar"
    >
      <div class="relative flex flex-col h-full max-h-full">
        <div class="px-6 pt-4 flex items-center">
          <!-- Logo -->
          <div
            class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
          >
            <h1>{{ user.role }}</h1>
          </div>
          <!-- End Logo -->

          <div class="hidden lg:block ms-2">
            <!-- Templates Dropdown -->
            <div
              class="hs-dropdown relative [--scope:window] [--auto-close:inside] inline-flex"
            >
              <button
                id="hs-dropdown-preview-sidebar"
                type="button"
                class="hs-dropdown-toggle group relative flex justify-center items-center size-8 text-xs rounded-lg text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <span class="">
                  <Icon name="meteor-icons:chevron-down" class="text-xl" />
                </span>

                <span class="absolute -top-0.5 -end-0.5">
                  <span class="relative flex">
                    <span
                      class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 dark:bg-red-600 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex size-2 bg-red-500 rounded-full"
                    ></span>
                    <span class="sr-only">Notification</span>
                  </span>
                </span>
              </button>
            </div>
            <!-- End Templates Dropdown -->
          </div>
        </div>

        <!-- Content -->
        <div
          class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <nav
            class="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
            data-hs-accordion-always-open
          >
            <ul
              v-for="menu in sidebarMenu"
              :key="menu.name"
              class="flex flex-col space-y-1"
              @click="itemSelected(menu)"
            >
              <li>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-white"
                  href="#"
                >
                  <Icon :name="menu.icon" class="text-2xl text-gray-600" />

                  {{ menu.name }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <!-- End Content -->
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
