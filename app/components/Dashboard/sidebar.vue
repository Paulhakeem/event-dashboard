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
        shadow-lg"
      role="dialog"
      tabindex="-1"
      aria-label="Sidebar"
    >
      <div class="relative flex flex-col h-full max-h-full">

        <!-- Header Section -->
        <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div class="flex items-center justify-between px-6 py-5">
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboard</p>
              <h2 class="text-lg font-bold text-gray-900 capitalize">{{ user.role }}</h2>
            </div>
          </div>
        </div>

        <!-- Sidebar Content -->
        <div
          class="flex-1 overflow-y-auto 
            [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300 
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          <nav class="p-5 space-y-2">
            <ul 
              v-for="menu in sidebarMenu" 
              :key="menu.name"
              @click="itemSelected(menu)"
              class="space-y-1"
            >
              <li>
                <button
                  @click="itemSelected(menu)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg
                    transition duration-200 
                    hover:bg-linear-to-r hover:from-[#9c4e8b]/10 hover:to-transparent
                    hover:text-[#9c4e8b] hover:border-l-4 hover:border-[#9c4e8b]
                    focus:outline-none focus:bg-linear-to-r focus:from-[#9c4e8b]/15 focus:to-transparent
                    active:bg-linear-to-r active:from-[#9c4e8b]/20 active:to-transparent"
                >
                  <Icon :name="menu.icon" class="text-lg shrink-0" />
                  <span class="grow text-left">{{ menu.name }}</span>
                  <Icon name="material-symbols:arrow-right-rounded" class="text-lg opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Footer Section -->
        <div class="sticky bottom-0 bg-linear-to-b from-transparent to-white border-t border-gray-200 p-4">
          <div class="flex items-center gap-3 px-2 py-3 bg-gray-50 rounded-lg">
            <div class="shrink-0">
              <img
                class="w-10 h-10 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                alt="User Avatar"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ user.firstName }}</p>
              <p class="text-xs text-gray-500 truncate capitalize">{{ user.role }}</p>
            </div>
          </div>
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
