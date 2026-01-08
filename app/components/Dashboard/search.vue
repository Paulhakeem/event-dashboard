<template>
  <div class="w-full flex items-center justify-between gap-4">
    <!-- Search Input - Desktop Only -->
    <div class="hidden md:block flex-1 max-w-md">
      <div class="relative">
        <Icon name="material-symbols-light:search-rounded" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search events, users..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
        />
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center justify-end gap-3">
      <!-- Notifications Button -->
      <button
        type="button"
        class="relative p-2.5 inline-flex justify-center items-center text-gray-600 hover:text-[#9c4e8b] hover:bg-gray-100 rounded-lg transition duration-200 focus:outline-none focus:bg-gray-100"
      >
        <Icon name="si:notifications-line" class="text-2xl" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        <span class="sr-only">Notifications</span>
      </button>

      <!-- Profile Section -->
      <div class="flex items-center gap-3 pl-3 border-l border-gray-200">
        <!-- User Info - Desktop -->
        <div class="hidden sm:block text-right">
          <p class="text-sm font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="text-xs text-gray-500 capitalize">{{ user.role }}</p>
        </div>

        <!-- Profile Button -->
        <button
          @click="openProfile"
          class="relative group p-0.5 rounded-full hover:bg-gray-100 transition duration-200 focus:outline-none"
        >
          <img
            class="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#9c4e8b] transition"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
            alt="User Avatar"
          />
        </button>
      </div>
    </div>

    <!-- Profile Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="profile"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="profile = false"
      >
        <!-- Modal Content -->
        <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button
            @click="profile = false"
            class="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200"
          >
            <Icon name="material-symbols:close" class="text-2xl text-gray-700" />
            <span class="sr-only">Close modal</span>
          </button>

          <!-- Admin Component -->
          <Admin />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const { user } = useAuth();
const { profile, openProfile } = useAdminMenu();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
