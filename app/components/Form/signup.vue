<template>
  <div class="relative bg-white">
    <!-- Card -->
    <div
      class="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-10 dark:border-neutral-700"
    >
      <p>
        <NuxtLink to="/login" class="text-sm text-[#9c4e8b] underline cursor-pointer"
          >Have an account? Login</NuxtLink
        >
      </p>
      <form>
        <div class="mt-6 grid gap-4 lg:gap-6">
          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label
                for="hs-firstname-hire-us-1"
                class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >First Name</label
              >
              <input
                type="text"
                class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              />
            </div>

            <div>
              <label
                for="hs-lastname-hire-us-1"
                class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >Last Name</label
              >
              <input
                type="text"
                class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              />
            </div>
          </div>
          <!-- End Grid -->

          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Email</label
            >
            <input
              type="email"
              autocomplete="email"
              class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          <!-- End Grid -->

          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Password</label
            >
            <input
              type="password"
              class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
        </div>
      </form>
      <!-- End Grid -->

      <!-- Checkbox -->
      <div class="mt-3 flex">
        <div class="flex">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="shrink-0 mt-1.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
          />
        </div>
        <div class="ms-3">
          <label
            for="remember-me"
            class="text-sm text-gray-600 dark:text-neutral-400"
            >Remember me
          </label>
        </div>
      </div>
      <!-- End Checkbox -->

      <div class="mt-6 grid">
        <button
          type="submit"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white disabled:opacity-50 disabled:pointer-events-none"
        >
        Signup
        </button>
      </div>
    </div>
    <!-- End Card -->
  </div>
  <!-- End Col -->
</template>

<script setup></script>
