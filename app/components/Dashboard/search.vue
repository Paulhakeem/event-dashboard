<template>
  <div class="relative w-full max-w-2xl mx-auto hidden md:block">
    <!-- Search Bar -->
    <form class="relative group z-50">
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500"
      ></div>

      <div class="relative">
        <Icon
          name="material-symbols-light:search-rounded"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
        />

        <input
          v-model="search"
          type="text"
          placeholder="Search events, users, bookings..."
          class="w-full h-14 pl-12 pr-20 rounded-2xl border border-gray-200 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl text-sm text-gray-800 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
        />

        <!-- Keyboard Shortcut -->
        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          <kbd
            class="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-500"
          >
            Ctrl K
          </kbd>
        </div>
      </div>
    </form>

    <!-- Results -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="search"
        class="absolute left-0 right-0 mt-3 z-[999] overflow-hidden rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-gray-200 dark:border-neutral-700 shadow-2xl"
      >
        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="svg-spinners:180-ring" class="text-3xl text-purple-500" />
        </div>

        <!-- Empty -->
        <div v-else-if="!results.length" class="py-10 text-center">
          <Icon
            name="solar:magnifer-linear"
            class="text-5xl mx-auto text-gray-300"
          />

          <p class="mt-3 text-sm text-gray-500">No results found</p>
        </div>

        <!-- Results -->
        <div v-else class="max-h-[450px] overflow-y-auto">
          <div
            v-for="result in results"
            :key="result.id"
            class="group flex items-start justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-neutral-800 dark:hover:to-neutral-700 transition-all cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar/Icon -->
              <div
                class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold"
              >
                {{ (result.name || result.title)?.charAt(0) }}
              </div>

              <div>
                <p class="font-semibold text-gray-800 dark:text-white">
                  {{ result.name || result.title }}
                </p>

                <p class="text-xs text-gray-500 mt-1">
                  {{ result.location }}
                </p>
              </div>
            </div>

            <!-- Status -->
            <div>
              <span
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': result.status === 'upcoming',

                  'bg-yellow-100 text-yellow-700': result.status === 'pending',

                  'bg-red-100 text-red-700': result.status === 'cancelled',
                }"
              >
                <span class="w-2 h-2 rounded-full bg-current"></span>

                {{ result.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-5 py-3 border-t border-gray-100 dark:border-neutral-700 bg-gray-50/70 dark:bg-neutral-800/40"
        >
          <p class="text-xs text-gray-500">
            {{ results.length }} result(s) found
          </p>
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
