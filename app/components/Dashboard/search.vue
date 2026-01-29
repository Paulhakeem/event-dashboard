<template>
  <div class="w-full flex items-center justify-between gap-4">
    <!-- Search Input - Desktop Only -->
    <div class="hidden md:block flex-1 max-w-md">
      <form class="relative">
        <Icon
          name="material-symbols-light:search-rounded"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search events, users..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
        />
      </form>
      <!-- loading -->
      <div v-if="isLoading" class="mt-2 text-sm text-gray-500">
        Searching...
      </div>

      <!-- results -->
      <div
        v-if="results.length && search"
        class="absolute top-full mt-2 w-96 rounded-lg shadow-xl z-50 space-y-1 border"
      >
        <div
          v-for="result in results"
          :key="result.id"
          class="p-2 bg-white rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer"
        >
          <h3 class="text-sm font-medium text-gray-900">
            {{ result.name || result.title }}
          </h3>
          <!-- location -->
          <p class="text-sm text-gray-500">{{ result.location }}</p>
          <!-- status -->

          <span
            class="inline-block mt-2 text-xs px-2 py-1 rounded"
            :class="{
              'bg-yellow-100 text-yellow-700': result.status === 'pending',
              'bg-green-100 text-green-700': result.status === 'upcoming',
              'bg-red-100 text-red-700': result.status === 'cancelled',
              'bg-blue-100 text-blue-700': result.status === 'completed',
            }"
          >
            {{ result.status }}
          </span>
        </div>
      </div>

      <!-- empty -->
      <div
        v-if="!results.length && search && !isLoading"
        class="mt-2 text-sm text-gray-500"
      >
        No results found.
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center justify-end gap-3">
      <!-- Profile Section -->
      <div class="flex items-center gap-3 pl-3 border-l border-gray-200">
        <!-- User Info - Desktop -->
        <div class="hidden sm:block text-right">
          <p class="text-sm font-semibold text-gray-900">
            {{ user.firstName }} {{ user.lastName }}
          </p>
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
        <div
          class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- Close Button -->
          <button
            @click="profile = false"
            class="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200"
          >
            <Icon
              name="material-symbols:close"
              class="text-2xl text-gray-700"
            />
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
const { search, results, isLoading } = useEventSearch();
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
