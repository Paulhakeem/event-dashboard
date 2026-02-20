<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-8">
      <div
        class="bg-gradient-to-r from-[#9c4e8b] to-[#7a3968] rounded-xl p-6 text-white shadow-lg"
      >
        <h1 class="text-3xl font-bold mb-2">Notifications</h1>
        <p class="text-purple-100">
          Stay updated with your event updates and approval status
        </p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
      >
        <p class="text-sm text-gray-600">Total Notifications</p>
        <p class="text-3xl font-bold text-[#9c4e8b]">
          {{ notifications.length }}
        </p>
      </div>
      <div
        class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
      >
        <p class="text-sm text-gray-600">Unread</p>
        <p class="text-3xl font-bold text-blue-600">{{ unreadCount }}</p>
      </div>
      <div
        class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
      >
        <p class="text-sm text-gray-600">Last Updated</p>
        <p class="text-lg font-semibold text-gray-800">{{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Action Bar -->
    <div
      class="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center"
    >
      <div class="flex gap-2 flex-wrap">
        <button
          @click="filterType = 'all'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            filterType === 'all'
              ? 'bg-[#9c4e8b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          All
        </button>
        <button
          @click="filterType = 'approved'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            filterType === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Approvals
        </button>
        <button
          @click="filterType = 'submitted'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            filterType === 'submitted'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Submitted
        </button>
        <button
          @click="filterType = 'cancelled'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            filterType === 'cancelled'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Cancelled
        </button>
      </div>
      <button
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition text-sm"
      >
        Mark All as Read
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c4e8b] mx-auto mb-4"
        ></div>
        <p class="text-gray-600 font-medium">Loading notifications...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6"
    >
      <div class="flex items-start gap-4">
        <Icon
          name="material-symbols:error-outline"
          class="text-3xl text-red-500 flex-shrink-0"
        />
        <div>
          <h3 class="font-semibold text-red-800 mb-1">
            Error Loading Notifications
          </h3>
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          <button
            @click="retryLoad"
            class="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredNotifications.length === 0"
      class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300"
    >
      <Icon
        name="material-symbols:notifications-none"
        class="text-6xl text-gray-300 mx-auto mb-4"
      />
      <p class="text-gray-500 text-lg font-medium">No notifications</p>
      <p class="text-gray-400 text-sm">
        You're all caught up! Check back later for updates.
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-3">
      <div
        v-for="notif in filteredNotifications"
        :key="notif._id || Math.random()"
        @click="markAsRead(notif)"
        :class="[
          'group bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer',
          notif.read
            ? 'border-gray-200 bg-white'
            : 'border-blue-300 bg-blue-50',
        ]"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
              getIconBg(notif),
            ]"
          >
            <Icon
              :name="getIcon(notif)"
              :class="['text-xl', getIconColor(notif)]"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 mb-1">
              <h3
                :class="[
                  'font-semibold truncate',
                  notif.read ? 'text-gray-800' : 'text-gray-900 font-bold',
                ]"
              >
                {{ notif.title }}
              </h3>
              <span
                v-if="!notif.read"
                class="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"
              ></span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ notif.message }}
            </p>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-xs text-gray-500">{{
                formatTime(notif.createdAt)
              }}</span>
              <span
                :class="[
                  'text-xs font-medium px-2 py-1 rounded-full',
                  getTypeBadge(notif),
                ]"
              >
                {{ getTypeLabel(notif) }}
              </span>
            </div>
          </div>

          <!-- Delete Action -->
          <button
            @click.stop="deleteNotification(notif._id)"
            class="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600"
          >
            <Icon name="material-symbols:close" class="text-xl" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  notifications,
  filteredNotifications,
  formatTime,
  loading,
  errorMessage,
  filterType,
  unreadCount,
  lastUpdated,
  getIcon,
  getIconBg,
  getIconColor,
  getTypeBadge,
  getTypeLabel,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  retryLoad,
} = orgNotifications();
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
