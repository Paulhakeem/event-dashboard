<template>
  <div
    class="min-h-screen bg-[#f7f8fa] text-slate-900 dark:bg-zinc-950 dark:text-slate-100"
  >
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-[min(86vw,20rem)] flex-col border-r border-amber-300/15 bg-[#101d3a] text-white shadow-2xl shadow-slate-950/25 transition-transform duration-300 ease-in-out md:w-72 lg:w-80"
      :class="{
        '-translate-x-full': !sidebarOpen && isMobile,
        'translate-x-0': sidebarOpen || !isMobile,
      }"
    >
      <div class="h-full flex flex-col overflow-hidden">
        <div class="border-b border-amber-300/20 px-5 py-6">
          <div class="flex items-center gap-3">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-lg ring-1 ring-amber-300/60"
            >
              <img
                :src="logo"
                alt="Happitwin"
                class="h-full w-full object-contain"
              />
            </div>
            <div class="min-w-0">
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300"
              >
                Happitwin events
              </p>
              <p class="mt-1 text-lg font-bold tracking-tight">Your space</p>
              <p class="text-xs leading-5 text-white/55">
                Events, tickets &amp; more
              </p>
            </div>
          </div>
        </div>

        <nav
          class="flex-1 space-y-2 overflow-y-auto px-3 py-5"
          aria-label="Dashboard navigation"
        >
          <p
            class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40"
          >
            Workspace
          </p>
          <div class="space-y-2">
            <button
              v-for="item in userSidebarMenu"
              :key="item.name"
              type="button"
              @click="itemSelected(item)"
              class="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
              :aria-current="
                currentComponent === item.component ? 'page' : undefined
              "
              :class="
                currentComponent === item.component
                  ? 'border-amber-200/50 bg-amber-300 text-[#101d3a] shadow-lg shadow-black/10'
                  : 'text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white'
              "
            >
              <Icon
                :name="item.icon"
                class="text-xl"
                :class="
                  currentComponent === item.component
                    ? 'text-[#101d3a]'
                    : 'text-amber-300'
                "
              />
              <span class="text-left">{{ item.name }}</span>
            </button>
          </div>
        </nav>
        <div class="border-t border-amber-300/15 px-5 py-4">
          <p class="text-xs font-semibold text-white/75">Happitwin</p>
          <p
            class="mt-1 text-[10px] uppercase tracking-[0.16em] text-amber-300/80"
          >
            From roots to reach
          </p>
        </div>
      </div>
    </aside>

    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 z-30 bg-[#081226]/65 backdrop-blur-sm md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <main
      class="relative min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 md:ml-72 md:p-8 lg:ml-80"
    >
      <button
        class="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-2xl bg-[#101d3a] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/20 ring-1 ring-amber-300/40 md:hidden"
        :aria-expanded="sidebarOpen"
        aria-label="Toggle dashboard navigation"
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
            class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300"
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
import logo from "~/assets/logo/happitwin.png";

const { userSidebarMenu } = userDashboardBar();
const route = useRoute();
const { user } = useAuth();
if (user.value?.id && String(route.params.id) !== String(user.value.id)) {
  await navigateTo(`/user/${user.value.id}`, { replace: true });
}
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
