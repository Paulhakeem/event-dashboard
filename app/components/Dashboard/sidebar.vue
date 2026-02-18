<template>
  <main>
    <div
      id="hs-application-sidebar"
      :class="[
        'fixed inset-y-0 start-0 z-40 transition-transform duration-300 transform',
        'w-64 h-full bg-white border-e border-gray-200 shadow-lg',
        'flex flex-col max-h-full',
        'flex lg:relative lg:z-auto',
      ]"
      role="dialog"
      tabindex="-1"
      aria-label="Sidebar"
    >
      <div class="relative flex flex-col h-screen">

        <!-- Header Section -->
        <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div class="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
            <div class="flex-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboard</p>
              <h2 class="text-base sm:text-lg font-bold text-gray-900 capitalize truncate">{{ user.role }}</h2>
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
          <nav class="p-4 sm:p-5 space-y-2">
            <ul 
              v-for="menu in sidebarMenu" 
              :key="menu.name"
              @click="handleMenuClick(menu)"
              class="space-y-1"
            >
              <li>
                <button
                  @click="handleMenuClick(menu)"
                  class="group w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-sm sm:text-base font-medium text-gray-700 rounded-lg
                    transition duration-200 
                    hover:bg-linear-to-r hover:from-[#9c4e8b]/10 hover:to-transparent
                    hover:text-[#9c4e8b] hover:border-l-4 hover:border-[#9c4e8b]
                    focus:outline-none focus:bg-linear-to-r focus:from-[#9c4e8b]/15 focus:to-transparent
                    active:bg-linear-to-r active:from-[#9c4e8b]/20 active:to-transparent"
                >
                  <div class="relative flex-shrink-0">
                    <Icon :name="menu.icon" class="text-lg sm:text-xl" />
                    <div 
                      v-if="menu.name === 'Notifications' && notificationCount > 0"
                      class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse"
                    >
                      {{ notificationCount > 99 ? '99+' : notificationCount }}
                    </div>
                  </div>
                  <span class="grow text-left truncate">{{ menu.name }}</span>
                  <Icon name="material-symbols:arrow-right-rounded" class="text-lg opacity-0 group-hover:opacity-100 transition duration-200 flex-shrink-0 hidden sm:block" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Footer Section -->
        <div class="sticky bottom-0 bg-linear-to-b from-transparent to-white border-t border-gray-200 p-3 sm:p-4">
          <div class="flex items-center gap-3 px-2 sm:px-3 py-3 bg-gray-50 rounded-lg">
            <div class="shrink-0">
              <img
                class="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover"
                :src="user.profileImage || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'"
                alt="User Avatar"
              />
            </div>
            <div class="flex-1 min-w-0 hidden sm:block">
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
const { user, token } = useAuth()
const notificationCount = ref(0)

const handleMenuClick = (menu) => {
  itemSelected(menu);
  emit("close");
};

const itemSelected = (menu) => {
  emit("update:modelValue", menu);
};

const fetchNotificationCount = async () => {
  try {
    const res = await $fetch("/api/notification/notifications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    notificationCount.value = res.notifications?.length || 0
  } catch (err) {
    console.error("Failed to fetch notifications:", err)
  }
}

onMounted(() => {
  fetchNotificationCount()
  // Poll for new notifications every 30 seconds
  setInterval(fetchNotificationCount, 30000)
})
</script>
