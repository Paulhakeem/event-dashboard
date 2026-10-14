<template>
  <section>
    <!-- Mobile Navigation -->
    <div class="md:hidden">
      <div
        class="border-b border-amber-300/25 bg-[#101d3a] px-4 py-3 text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl"
      >
        <div class="flex min-h-12 items-center justify-between gap-3">
          <!-- Menu Toggle -->
          <button
            @click="toggleMenu"
            class="rounded-xl p-2 text-amber-300 transition hover:bg-white/10 hover:text-amber-200"
            aria-label="Open navigation menu"
            :aria-expanded="openMenu"
          >
            <Icon class="text-xl" name="material-symbols:menu" />
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center" aria-label="Happitwin home">
            <span
              class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 ring-1 ring-amber-300/50"
            >
              <img :src="logo" alt="Happitwin" class="h-full w-full object-contain" />
            </span>
          </NuxtLink>

          <!-- Auth Buttons -->
          <div v-if="!user" class="flex gap-2">
            <NuxtLink
              to="/login"
              class="rounded-full border border-white/25 px-3 py-2 text-xs font-bold text-white transition hover:border-amber-300/70 hover:bg-white/10"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="hidden rounded-full bg-amber-300 px-3 py-2 text-xs font-bold text-[#101d3a] transition hover:bg-amber-200 xs:block"
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
              class="rounded-full bg-amber-300 px-3 py-2 text-xs font-bold text-[#101d3a] transition hover:bg-amber-200"
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
          class="fixed inset-y-0 left-0 z-50 flex w-[min(86vw,22rem)] flex-col overflow-y-auto bg-[#101d3a] p-5 text-white shadow-2xl shadow-slate-950/40 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          <!-- Close Button -->
          <button
            @click="toggleMenu"
            class="absolute right-4 top-4 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-amber-200"
            aria-label="Close navigation menu"
            :aria-expanded="openMenu"
          >
            <Icon class="text-white" size="28" name="material-symbols:close" />
          </button>

          <!-- Logo -->
          <div
            class="mb-8 mt-2 flex items-center gap-3 border-b border-amber-300/20 pb-6"
          >
            <span
              class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-lg ring-1 ring-amber-300/60"
            >
              <img :src="logo" alt="" class="h-full w-full object-contain" />
            </span>
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300"
              >
                Welcome to
              </p>
              <p class="mt-1 text-lg font-bold tracking-tight">Happitwin</p>
              <p class="text-xs text-white/60">Events · From roots to reach</p>
            </div>
          </div>

          <!-- Menu Items -->
          <nav class="space-y-2" aria-label="Main navigation">
            <NuxtLink
              v-for="item in menu"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3.5 text-sm font-semibold text-white/75 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              active-class="border-amber-300/30 bg-amber-300 text-[#101d3a] shadow-lg shadow-black/10"
              @click="toggleMenu"
            >
              <Icon :name="item.icon" class="text-xl" />
              <span>{{ item.name }}</span>
              <Icon
                name="material-symbols:arrow-forward-rounded"
                class="ml-auto text-lg opacity-40"
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
          class="fixed inset-0 z-40 bg-[#081226]/65 backdrop-blur-sm"
          aria-hidden="true"
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
import logo from "~/assets/logo/happitwin.png";

const { menu, openMenu, toggleMenu } = Header();

const { user } = useAuth();
</script>
