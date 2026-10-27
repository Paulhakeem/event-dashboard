<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute inset-0 bg-[#9d4e8a]/20 blur-xl rounded-full"></div>
              <div class="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9d4e8a] to-[#7a3968] shadow-lg shadow-[#9d4e8a]/30">
                <Icon
                  name="material-symbols:notifications-active"
                  class="text-3xl text-white"
                />
              </div>
            </div>
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Notifications</h1>
              <p class="text-gray-600 mt-1">
                {{ notifications.length === 0 ? "You're all caught up" : `You have ${notifications.length} notification${notifications.length !== 1 ? "s" : ""}` }}
              </p>
            </div>
          </div>
          <div v-if="notifications.length > 0" class="flex items-center gap-2">
            <button
              @click="markAllRead"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#9d4e8a] bg-[#9d4e8a]/10 hover:bg-[#9d4e8a]/20 transition-all duration-200"
            >
              <Icon name="material-symbols:done-all" class="text-lg" />
              Mark all as read
            </button>
            <button
              @click="deleteAll"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
            >
              <Icon name="material-symbols:delete-sweep" class="text-lg" />
              Clear all
            </button>
          </div>
        </div>
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
        class="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
      >
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-green-100/50 blur-2xl rounded-full"></div>
          <div class="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <Icon
              name="material-symbols:check-circle-outline"
              class="text-5xl text-green-500"
            />
          </div>
        </div>
        <p class="text-2xl text-gray-800 font-semibold">All caught up!</p>
        <p class="text-gray-500 mt-2 max-w-sm mx-auto">No new notifications. We'll notify you when something important happens.</p>
      </div>

      <!-- Notifications -->
      <TransitionGroup name="list" tag="div" class="space-y-3">
        <div
          v-for="(notification, idx) in notifications"
          :key="notification._id"
          class="group relative flex items-start justify-between p-5 lg:p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-[1.01] hover:-translate-y-0.5"
        >
          <!-- Accent bar -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            :class="iconBg(notification.type || getNotificationType(notification))"
          />

          <!-- Background gradient on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-[0.03] transition-opacity"
            :class="bgGradient(notification.type || getNotificationType(notification))"
          />

          <!-- Left Section -->
          <div class="relative flex items-start gap-4 flex-1 pl-2">
            <!-- Icon -->
            <div
              class="flex items-center justify-center w-12 h-12 rounded-xl text-white shrink-0 shadow-lg"
              :class="iconBg(notification.type || getNotificationType(notification))"
            >
              <Icon :name="getIcon(notification.type || getNotificationType(notification))" class="text-2xl" />
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-semibold text-gray-900 text-base leading-tight">
                  {{ notification.title }}
                </h4>
                <span class="text-xs text-gray-400 whitespace-nowrap">{{
                  formatTime(notification.createdAt)
                }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1.5 leading-relaxed">
                {{ notification.message }}
              </p>
              <div class="flex items-center gap-3 mt-3" v-if="notification.sender?.name || notification.meta?.bookerName">
                <span
                  v-if="notification.sender?.name"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9d4e8a]/10 text-[#9d4e8a] text-xs font-medium"
                >
                  <Icon name="material-symbols:person" class="text-sm" />
                  {{ notification.sender.name }}
                </span>
                <span
                  v-if="notification.meta?.bookerName"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  <Icon name="material-symbols:confirmation-number" class="text-sm" />
                  {{ notification.meta.bookerName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="deleteNotification(notification._id, idx)"
            class="relative ml-4 shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Dismiss notification"
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
  borderColor,
  iconBg,
  bgGradient,
  getIcon,
  getNotificationType,
  formatTime,
  deleteNotification,
  markAllRead,
  deleteAll,
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
