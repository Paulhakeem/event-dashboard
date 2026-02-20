<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <Icon
            name="material-symbols:notifications-active"
            class="text-3xl text-[#9d4e8a]"
          />
          <h1 class="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>
        <p class="text-gray-600">
          You have {{ notifications.length }} notification{{
            notifications.length !== 1 ? "s" : ""
          }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9d4e8a]"
          ></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading notifications...</p>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg"
      >
        <div class="flex items-start gap-3">
          <Icon
            name="material-symbols:error-outline"
            class="text-2xl flex-shrink-0"
          />
          <div>
            <h3 class="font-semibold">Error Loading Notifications</h3>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="!loading && notifications.length === 0"
        class="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300"
      >
        <Icon
          name="material-symbols:inbox"
          class="text-6xl text-gray-300 mx-auto mb-4"
        />
        <p class="text-xl text-gray-500 font-medium">All caught up!</p>
        <p class="text-gray-400 mt-2">No new notifications at this time</p>
      </div>

      <!-- Notifications -->
      <TransitionGroup name="list" tag="div" class="space-y-4">
        <div
          v-for="notification in notifications"
          :key="notification._id"
          class="group relative flex items-start justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden"
          :class="borderColor(notification.type)"
        >
          <!-- Background gradient on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity"
            :class="bgGradient(notification.type)"
          />

          <!-- Left Section -->
          <div class="relative flex items-start gap-4 flex-1">
            <!-- Icon -->
            <div
              class="flex items-center justify-center w-12 h-12 rounded-full text-white shrink-0 shadow-md"
              :class="iconBg(notification.type)"
            >
              <Icon :name="getIcon(notification.type)" class="text-xl" />
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-800 truncate">
                {{ notification.title }}
              </h4>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                {{ notification.message }}
              </p>
              <div class="flex items-center gap-4 mt-3">
                <span class="text-xs text-gray-400">{{
                  formatTime(notification.createdAt)
                }}</span>
                <span
                  v-if="notification.sender"
                  class="text-xs text-[#9d4e8a] font-medium"
                  >from {{ notification.sender.name }}</span
                >
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="deleteNotification(notification._id)"
            class="relative ml-4 shrink-0 p-2 rounded-full text-gray-400 hover:text-[#9d4e8a] hover:bg-gray-100 transition"
          >
            <Icon name="material-symbols:close" class="text-xl" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
const {
  notifications,
  loading,
  error,
  removeNotification,
  borderColor,
  iconBg,
  bgGradient,
  getIcon,
  formatTime,
  deleteNotification,
} = Notifications();
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
