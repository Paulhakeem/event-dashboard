<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-amber-300/25 bg-[#101d3a]/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl"
  >
    <nav
      class="mx-auto grid min-h-[4.75rem] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex min-w-0 shrink-0 items-center gap-3"
        aria-label="Happitwin home"
      >
        <span
          class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-md ring-1 ring-amber-300/50"
        >
          <img :src="logo" alt="" class="h-full w-full object-contain" />
        </span>
        <span class="hidden min-w-0 sm:block">
          <span class="block text-sm font-black tracking-[0.18em] text-white"
            >HAPPITWIN</span
          >
          <span
            class="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300"
            >Events · From roots to reach</span
          >
        </span>
      </NuxtLink>

      <!-- Center Menu -->
      <div class="flex min-w-0 items-center justify-center gap-1">
        <NuxtLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="group relative flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-amber-200 xl:px-4"
          active-class="bg-white/10 text-amber-300"
        >
          <Icon :name="item.icon" class="text-lg text-amber-300/90" />
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Right Side Auth Buttons -->
      <div class="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <ThemeToggle />

        <!-- Not Logged In -->
        <template v-if="!user">
          <NuxtLink
            to="/login"
            class="rounded-full border border-white/25 px-3 py-2 text-xs font-bold text-white transition hover:border-amber-300/70 hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="rounded-full bg-amber-300 px-3 py-2 text-xs font-bold text-[#101d3a] shadow-md shadow-amber-950/20 transition hover:bg-amber-200 sm:px-4 sm:text-sm"
          >
            Sign Up
          </NuxtLink>
        </template>

        <!-- Logged In -->
        <template v-else>
          <NuxtLink
            :to="
              dashboardPath
            "
            class="rounded-full bg-amber-300 px-3 py-2 text-xs font-bold text-[#101d3a] shadow-md shadow-amber-950/20 transition hover:bg-amber-200 sm:px-4 sm:text-sm"
          >
            <Icon name="gg:dashboard" class="inline mr-1" />
            Dashboard
          </NuxtLink>
          <button
            type="button"
            @click="logout"
            class="rounded-full border border-red-300/40 px-3 py-2 text-xs font-bold text-red-100 transition hover:bg-red-500/15 sm:px-4 sm:text-sm"
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
import logo from "~/assets/logo/happitwin.png";

const { menu } = Header();
const { user, logout } = useAuth();
const dashboardPath = computed(() =>
  user.value?.role === "admin"
    ? "/admin/dashboard"
    : user.value?.role === "organiser"
      ? `/organiser/${user.value.id}`
      : `/user/${user.value?.id}`,
);
</script>
