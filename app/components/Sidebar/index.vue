<template>
  <section>
    <!-- Mobile Navigation -->
    <div class="pb-4 md:hidden lg:hidden">
      <div class="bg-white border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Menu Toggle -->
          <button
            @click="toggleMenu"
            class="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Icon
              class="text-gray-700"
              size="28"
              name="material-symbols:menu"
            />
          </button>

          <!-- Logo -->
          <div class="flex items-center text-lg">
            <Icon name="mdi:emoji-panda" class="w-7 h-7 text-[#9c4e8b]" />
            <p class="text-gray-900 font-bold ml-2">Event</p>
          </div>

          <!-- Auth Buttons -->
          <div v-if="!user" class="flex gap-2">
            <NuxtLink
              to="/login"
              class="py-2 px-3 bg-[#9c4e8b] text-white text-xs font-semibold rounded-lg hover:bg-[#7c3a6d] transition"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="py-2 px-3 bg-gray-200 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </NuxtLink>
          </div>

          <div v-else class="flex gap-2">
            <NuxtLink
              :to="
                user && user.role === 'admin'
                  ? '/admin/dashboard'
                  : '/user/dashboard'
              "
              class="py-2 px-3 bg-[#9c4e8b] text-white text-xs font-semibold rounded-lg hover:bg-[#7c3a6d] transition"
            >
              Dashboard
            </NuxtLink>
            <button
              @click="useAuth().logout()"
              class="py-2 px-3 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-full"
      >
        <div
          v-if="openMenu"
          class="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#9c4e8b] to-[#7c3a6d] shadow-2xl z-50 p-6 overflow-y-auto"
        >
          <!-- Close Button -->
          <button
            @click="toggleMenu"
            class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
          >
            <Icon
              class="text-white"
              size="28"
              name="material-symbols:close"
            />
          </button>

          <!-- Logo -->
          <div class="flex items-center mb-12 mt-2">
            <Icon name="mdi:emoji-panda" class="w-8 h-8 text-white" />
            <p class="text-white font-bold ml-3 text-xl">Event</p>
          </div>

          <!-- Menu Items -->
          <nav class="space-y-3">
            <NuxtLink
              v-for="(item, idx) in menu"
              :key="idx"
              :to="item.path"
              class="flex items-center gap-3 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition font-medium"
              @click="toggleMenu"
            >
              <Icon name="gg:chevron-right" />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>

      <!-- Mobile Overlay -->
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="openMenu"
          @click="toggleMenu"
          class="fixed inset-0 bg-black/50 z-40"
        ></div>
      </Transition>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:block lg:block">
      <SidebarMain />
    </div>
  </section>
</template>

<script setup>
const { menu, openMenu, toggleMenu } = Header();

const { user } = useAuth();
</script>
