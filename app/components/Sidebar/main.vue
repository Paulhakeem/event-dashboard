<template>
  <!-- ========== HEADER ========== -->
  <header
    class="sticky top-4 inset-x-0 flex md:flex-nowrap z-50 justify-center items-center before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-[26px] before:bg-gray-200/30 before:backdrop-blur-md"
  >
    <nav
      class="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 ps-5 pe-2 md:py-0 mx-2 lg:mx-auto"
    >
      <div class="flex items-center">
        <!-- Logo -->
        <div class="flex items-center text-xl">
          <Icon name="mdi:emoji-panda" class="w-8 h-8 text-gray-200" />
          <p class="text-gray-200 font-semibold">Event</p>
        </div>
        <!-- End Logo -->

        <div class="ms-1 sm:ms-2"></div>
      </div>

      <!-- Button Group -->
      <div class="md:order-3 flex items-center gap-x-3">
        <div class="md:ps-3">
          <NuxtLink
            to="/login"
            class="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#9c4e8b] font-medium text-sm text-nowrap text-gray-200 rounded-lg focus:outline-hidden"
            href="#"
          >
            Login
          </NuxtLink>
        </div>
      </div>
      <div class="md:order-3 flex items-center gap-x-3">
        <div class="md:ps-3">
          <NuxtLink
            to="/Signup"
            class="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#9c4e8b] font-medium text-sm text-nowrap text-gray-200 rounded-lg focus:outline-hidden"
            href="#"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>
      <!-- End Button Group -->

      <!-- Collapse -->
      <div
        id="hs-navbar-floating-dark"
        class="hs-collapse overflow-hidden transition-all duration-300 basis-full grow md:block"
        aria-labelledby="hs-navbar-floating-dark-collapse"
      >
        <div
          class="flex md:flex-row md:items-center md:justify-end gap-y-3 py-2 md:py-0 md:ps-7"
        >
          <NuxtLink
            v-for="(item, idx) in menu"
            :key="idx"
            :to="item.path"
            class="pe-3 ps-px cursor-pointer sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300"
            aria-current="page"
            >{{ item.name }}</NuxtLink
          >
        </div>
      </div>
      <!-- End Collapse -->
    </nav>
  </header>
  <!-- ========== END HEADER ========== -->
</template>

<script setup>
const { menu } = Header();
</script>
