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
          <a
            class="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#9c4e8b] font-medium text-sm text-nowrap text-gray-200 rounded-full focus:outline-hidden"
            href="#"
          >
            Get Started
            <svg
              class="w-2.5 h-2.5 text-gray-200 group-hover:translate-x-1 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </a>
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
            class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300"
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
