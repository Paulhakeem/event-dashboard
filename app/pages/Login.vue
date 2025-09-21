<template>
  <!-- Hire Us -->
  <div
    class="bg-[#020f31] max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
  >
    <!-- Grid -->
    <div class="grid md:grid-cols-2 items-center pt-10">
      <div
        class="bg-[url('/images/party.jpg')] h-screen bg-no-repeat bg-center bg-cover items-center mx-auto relative rounded-lg"
      >
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="justify-center items-center relative p-8 sm:p-16 lg:p-24">
          <h1
            class="text-3xl font-bold text-gray-200 lg:text-4xl lg:leading-tight dark:text-white"
          >
            Login
          </h1>
          <p class="mt-1 md:text-lg text-gray-200 dark:text-neutral-200">
            Access your dashboard and manage your events with ease . Stay
            organized and in control.
          </p>

          <div class="mt-8">
            <h2
              class="text-lg font-semibold text-gray-200 dark:text-neutral-200"
            >
              What can I expect?
            </h2>

            <ul class="mt-2 space-y-2">
              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200 w-20" />
                <span class="text-gray-200"> Creating/Delete Events</span>
              </li>

              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200 w-20" />
                <span class="text-gray-200 dark:text-neutral-400">
                  Track Events
                </span>
              </li>

              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200 w-20" />
                <span class="text-gray-200 dark:text-neutral-400">
                  Manage events
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-2 flex items-center gap-x-5 justify-center items-center relative p-8 sm:p-16 lg:p-2"
        >
          <!-- Avatar Group -->
          <div class="flex -space-x-2">
            <img
              class="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="Avatar"
            />
            <img
              class="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
              src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
              alt="Avatar"
            />
            <img
              class="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
              src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
              alt="Avatar"
            />
            <span
              class="inline-flex justify-center items-center size-8 rounded-full bg-blue-600 text-white ring-2 ring-white"
            >
              <svg
                class="size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                />
              </svg>
            </span>
          </div>
          <!-- End Avatar Group -->
          <span class="text-sm text-gray-200 dark:text-neutral-500">
            Trusted by over 37k customer
          </span>
        </div>
      </div>
      <!-- End Col -->
      <!-- form -->
      <Form />
      <!-- end of form -->
    </div>
  </div>
</template>

<script setup></script>
