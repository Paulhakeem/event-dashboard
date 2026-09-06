<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
  >
    <nav
      class="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-3"
        aria-label="Velora home"
      >
        <img
          :src="logo"
          alt="Velora"
          class="h-12 w-auto object-contain sm:h-14"
        />
        <span
          class="hidden text-lg font-bold tracking-tight text-slate-900 sm:block"
          >VELORA</span
        >
      </NuxtLink>

      <!-- Center Menu -->
      <div class="hidden flex-1 items-center justify-center gap-1 md:flex">
        <NuxtLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#9c4e8b]/8 hover:text-[#9c4e8b]"
          active-class="bg-[#9c4e8b]/10 text-[#9c4e8b]"
        >
          <Icon :name="item.icon" class="text-lg" />
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Right Side Auth Buttons -->
      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <!-- Not Logged In -->
        <template v-if="!user">
          <NuxtLink
            to="/login"
            class="rounded-full border border-[#9c4e8b]/40 px-3 py-2 text-xs font-bold text-[#9c4e8b] transition hover:bg-[#9c4e8b]/8 sm:px-4 sm:text-sm"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="rounded-full bg-[#9c4e8b] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#9c4e8b]/20 transition hover:bg-[#7c3a6d] sm:px-4 sm:text-sm"
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
            class="rounded-full bg-[#9c4e8b] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#9c4e8b]/20 transition hover:bg-[#7c3a6d] sm:px-4 sm:text-sm"
          >
            <Icon name="gg:dashboard" class="inline mr-1" />
            Dashboard
          </NuxtLink>
          <button
            @click="useAuth().logout()"
            class="rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 sm:px-4 sm:text-sm"
          >
            <Icon name="mdi:logout" class="inline mr-1" />
            Logout
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import logo from "~/assets/logo/VELORA.png";

const { menu } = Header();
const { user } = useAuth();
</script>
