<template>
  <div
    class="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3"
  >
    <div class="hidden md:block">
      <!-- Search Input -->
      <div class="relative">
        <div
          class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5"
        >
          <Icon name="material-symbols-light:search-rounded" class="text-lg" />
        </div>
        <input
          type="text"
          class="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 rounded-lg text-sm focus:outline-hidden focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
          placeholder="Search"
        />
      </div>
      <!-- End Search Input -->
    </div>

    <!-- notification icon -->
    <div class="flex flex-row items-center justify-end gap-1">
      <button
        type="button"
        class="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
      >
        <Icon name="si:notifications-line" class="text-xl" />
        <span class="sr-only">Notifications</span>
      </button>

      <!-- Profile-->
      <div class="hs-dropdown [--placement:bottom-right] relative inline-flex">
        <button
          id="hs-dropdown-account"
          type="button"
          class="size-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none dark:text-white"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Dropdown"
        >
          <img
            class="shrink-0 size-9.5 rounded-full"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
            alt="Avatar"
          />
        </button>
      </div>
      <!-- End Dropdown -->
    </div>
  </div>
</template>

<script setup>
</script>
