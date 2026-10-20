<template>
  <!-- Footer Section -->
  <div
    class="sticky bottom-0 bg-linear-to-b from-transparent to-white dark:to-neutral-900 border-t border-gray-200 dark:border-neutral-700 p-3 sm:p-4"
  >
    <div
      class="flex items-center gap-3 px-2 sm:px-3 py-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
    >
      <div class="shrink-0">
        <img
          v-if="user?.profileImage"
          class="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover"
          :src="user.profileImage"
          alt="User Avatar"
        />
        <div
          v-else
          class="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-[#13284b] flex items-center justify-center text-white text-sm font-semibold"
        >
          {{ (user?.firstName?.[0] || '?').toUpperCase() }}
        </div>
      </div>
      <div class="flex-1 min-w-0 hidden sm:block">
        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ user?.firstName || 'User' }}
        </p>
        <p class="text-xs text-gray-500 dark:text-neutral-400 truncate capitalize">{{ user?.role || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
</script>
