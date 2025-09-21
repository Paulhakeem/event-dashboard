<template>
  <!-- Subscribe -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16 mx-auto">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="max-w-md">
        <h2
          class="text-2xl font-bold text-gray-200 dark:text-white sm:text-3xl"
        >
          Subscribe
        </h2>
        <p class="mt-3 text-gray-200 dark:text-neutral-400">
          Subscribe and start making the most of every engagement.
        </p>
      </div>

      <form>
        <div class="w-full sm:max-w-lg md:ms-auto">
          <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <div class="w-full">
              <label for="hero-input" class="sr-only">Search</label>
              <input
                type="text"
                id="hero-input"
                name="hero-input"
                class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-gray-200 sm:text-sm outline-2"
                placeholder="Enter your email"
              />
            </div>
            <NuxtLink
              to="#"
              class="w-full sm:w-auto whitespace-nowrap py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white"
            >
              Subscribe
            </NuxtLink>
          </div>
          <p class="mt-3 text-sm text-gray-200 dark:text-neutral-500">
            No spam, unsubscribe at any time
          </p>
        </div>
      </form>
    </div>
  </div>
  <!-- End Subscribe -->
</template>

<script setup></script>
