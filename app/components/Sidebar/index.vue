<template>
  <section class="">
    <div class="md:hidden lg:hidden">
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-5"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-5"
      >
        <div
          class="fixed w-2/3 h-screen bg-[#9c4e8b] shadow-lg top-0 left-0 z-40 p-4"
        >
          <ul class="space-y-6">
            <li v-for="(item, idx) in menu" :key="idx">
              <NuxtLink
                class="text-gray-200 hover:border-b hover:border-b-[#d8f3f4] text-sm font-medium tracking-wide uppercase"
                aria-current="page"
                >{{ item.name }}</NuxtLink
              >
            </li>
          </ul>
        </div>
      </Transition>
    </div>
    <div class="hidden md:block lg:block">
      <SidebarMain />
    </div>
  </section>
</template>

<script setup>
const menu = ref([
  { name: "Home", href: "#", current: true },
  { name: "Stories", href: "#", current: false },
  { name: "Reviews", href: "#", current: false },
  { name: "Approach", href: "#", current: false },
]);
</script>
