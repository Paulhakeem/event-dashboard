<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-100"
  >
    <aside
      class="fixed inset-y-0 left-0 z-40 w-full max-w-full md:w-72 lg:w-80 bg-white/95 dark:bg-zinc-950/95 border-r border-slate-200/70 dark:border-zinc-800/80 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out"
      :class="{
        '-translate-x-full': !sidebarOpen && isMobile,
        'translate-x-0': sidebarOpen || !isMobile,
      }"
    >
      <div class="h-full flex flex-col overflow-hidden">
        <div
          class="px-5 py-6 border-b border-slate-200/80 dark:border-zinc-800/80"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-[#9c4e8b] to-[#cb35a3] text-white shadow-lg"
            >
              <span class="text-lg font-semibold">U</span>
            </div>
            <div>
              <p class="text-lg font-semibold tracking-tight">User Portal</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Quick access to your profile, events, and tickets
              </p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <p
            class="px-3 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2"
          >
            Navigation
          </p>
          <div class="space-y-2">
            <button
              v-for="item in userSidebarMenu"
              :key="item.name"
              type="button"
              @click="itemSelected(item)"
              class="group w-full flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
              :class="
                currentComponent === item.component
                  ? 'bg-linear-to-r from-[#9c4e8b] to-[#cb35a3] text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800'
              "
            >
              <Icon :name="item.icon" class="text-xl" />
              <span class="text-left">{{ item.name }}</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>

    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 md:hidden z-30"
      @click="sidebarOpen = false"
    ></div>

    <main class="relative min-h-screen md:ml-72 lg:ml-80 p-4 sm:p-6 md:p-8">
      <button
        class="md:hidden fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#9c4e8b] to-[#cb35a3] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-fuchsia-500/20"
        @click="sidebarOpen = !sidebarOpen"
      >
        <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
        Menu
      </button>

      <div class="max-w-7xl mx-auto space-y-6">
        <section
          class="rounded-4xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/40 dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:shadow-none"
        >
          <p
            class="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600 dark:text-fuchsia-400"
          >
            User dashboard
          </p>
          <h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ currentMenuItem.name }}
          </h1>
          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400"
          >
            Manage your {{ currentMenuItem.name.toLowerCase() }} with a cleaner,
            more focused interface.
          </p>
        </section>

        <section
          class="overflow-hidden rounded-4xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-200/30 dark:border-zinc-800/80 dark:bg-zinc-950/95"
        >
          <div class="px-6 py-6 sm:px-8 sm:py-8">
            <component v-if="currentComponent" :is="currentComponent" />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const { userSidebarMenu } = userDashboardBar();
const currentComponent = ref(userSidebarMenu[0]?.component ?? null);
const sidebarOpen = ref(false);
const isMobile = ref(false);
const currentMenuItem = computed(
  () =>
    userSidebarMenu.find((item) => item.component === currentComponent.value) ??
    userSidebarMenu[0] ?? { name: "Dashboard" },
);

function itemSelected(menu) {
  currentComponent.value = menu.component;
  if (isMobile.value) sidebarOpen.value = false;
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
