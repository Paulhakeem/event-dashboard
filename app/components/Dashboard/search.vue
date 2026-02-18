<template>
  <div class="relative w-full max-w-xl mx-auto hidden md:block">
    <!-- Search Input -->
    <form class="relative z-50">
      <Icon
        name="material-symbols-light:search-rounded"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        v-model="search"
        type="text"
        placeholder="Search events, users..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm
               focus:ring-2 focus:ring-[#9c4e8b] focus:border-[#9c4e8b]
               transition shadow-sm"
      />
    </form>

    <!-- 🔥 Overlay Results -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="search && results.length"
        class="absolute left-0 right-0 mt-2 z-[999]
               bg-white/95 backdrop-blur
               border rounded-xl shadow-2xl"
      >
        <div
          v-for="result in results"
          :key="result.id"
          class="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
        >
          <p class="text-sm font-medium">
            {{ result.name || result.title }}
          </p>
          <p class="text-xs text-gray-500">{{ result.location }}</p>

          <span
            class="inline-block mt-1 text-xs px-2 py-0.5 rounded"
            :class="{
              'bg-green-100 text-green-700': result.status === 'upcoming',
              'bg-yellow-100 text-yellow-700': result.status === 'pending',
              'bg-red-100 text-red-700': result.status === 'cancelled'
            }"
          >
            {{ result.status }}
          </span>
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
