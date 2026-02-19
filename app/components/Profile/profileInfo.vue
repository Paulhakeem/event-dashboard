<template>
  <!-- Footer Section -->
  <div
    class="sticky bottom-0 bg-linear-to-b from-transparent to-white border-t border-gray-200 p-3 sm:p-4"
  >
    <div
      class="flex items-center gap-3 px-2 sm:px-3 py-3 bg-gray-50 rounded-lg"
    >
      <div class="shrink-0">
        <img
          class="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover"
          :src="
            user.profileImage ||
            'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
          "
          alt="User Avatar"
        />
      </div>
      <div class="flex-1 min-w-0 hidden sm:block">
        <p class="text-sm font-semibold text-gray-900 truncate">
          {{ user.firstName }}
        </p>
        <p class="text-xs text-gray-500 truncate capitalize">{{ user.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
</script>
