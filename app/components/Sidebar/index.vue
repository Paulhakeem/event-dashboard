<template>
  <section>
    <!-- Mobile Navigation -->
    <div class="md:hidden">
      <div
        class="border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl"
      >
        <div class="flex min-h-12 items-center justify-between gap-3">
          <!-- Menu Toggle -->
          <button
            @click="toggleMenu"
            class="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Icon class="text-xl" name="material-symbols:menu" />
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center" aria-label="Velora home">
            <img :src="logo" alt="Velora" class="h-11 w-auto object-contain" />
          </NuxtLink>
          <div class="flex min-w-0 items-center"></div>

          <!-- Auth Buttons -->
          <div v-if="!user" class="flex gap-2">
            <NuxtLink
              to="/login"
              class="rounded-full bg-[#9c4e8b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#7c3a6d]"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200 xs:block"
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
              class="rounded-full bg-[#9c4e8b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#7c3a6d]"
            >
              Dashboard
            </NuxtLink>
            <button
              @click="useAuth().logout()"
              class="hidden rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 xs:block"
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
          class="fixed inset-y-0 left-0 z-50 flex w-[min(86vw,22rem)] flex-col overflow-y-auto bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/30 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          <!-- Close Button -->
          <button
            @click="toggleMenu"
            class="absolute right-4 top-4 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close navigation menu"
          >
            <Icon class="text-white" size="28" name="material-symbols:close" />
          </button>

          <!-- Logo -->
          <div
            class="mb-10 mt-2 flex items-center gap-3 border-b border-white/10 pb-6"
          >
            <img
              :src="logo"
              alt="Velora"
              class="h-12 w-auto brightness-0 invert"
            />
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-white/50"
              >
                Explore
              </p>
              <p class="text-lg font-bold tracking-tight">Velora Events</p>
            </div>
          </div>

          <!-- Menu Items -->
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in menu"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              active-class="bg-white/12 text-white shadow-inner"
              @click="toggleMenu"
            >
              <Icon :name="item.icon" class="text-xl" />
              <span>{{ item.name }}</span>
              <Icon
                name="material-symbols:arrow-forward-rounded"
                class="ml-auto text-lg opacity-50"
              />
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
import logo from "~/assets/logo/VELORA.png";

const { menu, openMenu, toggleMenu } = Header();

const { user } = useAuth();
</script>
