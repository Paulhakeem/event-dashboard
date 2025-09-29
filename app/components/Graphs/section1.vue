<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Total users
          </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            72,540
          </h3>
          <span class="flex items-center gap-x-1 text-green-600">
            <Icon name="streamline:graph-arrow-increase" />
            <span class="inline-block text-sm"> 1.7% </span>
          </span>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Events
          </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            29.4%
          </h3>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
            Avg. Click Rate
          </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            56.8%
          </h3>
          <span class="flex items-center gap-x-1 text-red-600">
            <Icon name="streamline:graph-arrow-decrease" />
            <span class="inline-block text-sm"> 1.7% </span>
          </span>
        </div>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div
      class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-x-2">
          <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
          Total Events
          </p>
        </div>

        <div class="mt-1 flex items-center gap-x-2">
          <h3
            class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200"
          >
            2,913
          </h3>
        </div>
      </div>
    </div>
    <!-- End Card -->
  </div>
</template>

<script setup></script>
