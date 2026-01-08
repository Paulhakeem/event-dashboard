<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 flex-shrink-0 mr-16">
          <Icon name="mdi:emoji-panda" class="w-8 h-8 text-[#9c4e8b]" />
          <p class="text-gray-900 font-bold text-lg">Event</p>
        </div>

        <!-- Center Menu -->
        <div class="hidden md:flex md:items-center md:gap-12">
          <NuxtLink
            v-for="(item, idx) in menu"
            :key="idx"
            :to="item.path"
            class="text-gray-700 hover:text-[#9c4e8b] font-medium text-sm transition duration-200 relative group px-2"
          >
            {{ item.name }}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9c4e8b] group-hover:w-full transition-all duration-300"></span>
          </NuxtLink>
        </div>

        <!-- Right Side Auth Buttons -->
        <div class="flex items-center gap-3">
          <!-- Not Logged In -->
          <template v-if="!user">
            <NuxtLink
              to="/login"
              class="py-2 px-4 text-[#9c4e8b] font-semibold text-sm border-2 border-[#9c4e8b] rounded-lg hover:bg-[#9c4e8b]/5 transition"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="py-2 px-4 bg-[#9c4e8b] text-white font-semibold text-sm rounded-lg hover:bg-[#7c3a6d] transition shadow-md"
            >
              Sign Up
            </NuxtLink>
          </template>

          <!-- Logged In -->
          <template v-else>
            <NuxtLink
              :to="
                user && user.role === 'admin'
                  ? '/admin/dashboard'
                  : '/user/dashboard'
              "
              class="py-2 px-4 bg-[#9c4e8b] text-white font-semibold text-sm rounded-lg hover:bg-[#7c3a6d] transition shadow-md"
            >
              <Icon name="gg:dashboard" class="inline mr-1" />
              Dashboard
            </NuxtLink>
            <button
              @click="useAuth().logout()"
              class="py-2 px-4 text-red-700 font-semibold text-sm border-2 border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              <Icon name="mdi:logout" class="inline mr-1" />
              Logout
            </button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const { menu } = Header();
const { user } = useAuth();
</script>
