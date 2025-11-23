<template>
  <div
    class="bg-gray-200 min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
  >
    <!-- Grid -->
    <div class="grid md:grid-cols-2 items-center gap-10 pt-10 lg:pt-20 max-w-screen-xl mx-auto">
      
      <!-- LEFT SECTION (IMAGE + TEXT) -->
      <div
        class="bg-[url('/images/party.jpg')] min-h-[380px] md:min-h-[550px] lg:min-h-screen
               bg-no-repeat bg-center bg-cover relative rounded-lg overflow-hidden"
      >
        <div class="absolute inset-0 bg-black/40"></div>

        <div class="relative p-6 sm:p-12 lg:p-20">
          <h1 class="text-3xl font-bold text-gray-200 lg:text-4xl">
            Login
          </h1>

          <p class="mt-2 md:text-lg text-gray-200">
            Access your dashboard and manage your events with ease.
          </p>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-200">
              What can I expect?
            </h2>

            <ul class="mt-2 space-y-2">
              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200" />
                <span class="text-gray-200">Create / Delete Events</span>
              </li>

              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200" />
                <span class="text-gray-200">Track Events</span>
              </li>

              <li class="flex items-center gap-x-3">
                <Icon name="lets-icons:check-fill" class="text-gray-200" />
                <span class="text-gray-200">Manage Events</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 flex items-center gap-x-4">

            <!-- Avatar Group -->
            <div class="flex -space-x-2">
              <img
                class="size-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&w=200"
                alt="Avatar"
              />
              <img
                class="size-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&w=200"
                alt="Avatar"
              />
              <img
                class="size-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&w=200"
                alt="Avatar"
              />
              <span
                class="inline-flex justify-center items-center size-8 rounded-full bg-blue-600 text-white ring-2 ring-white"
              >
                <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l..."
                  />
                </svg>
              </span>
            </div>

            <span class="text-sm text-gray-200">
              Trusted by over 37k customers
            </span>
          </div>
        </div>
      </div>
      <!-- END LEFT SECTION -->

      <!-- RIGHT SECTION (FORM) -->
      <form-signup />
      <!-- END FORM -->
      
    </div>
  </div>
</template>

<script setup>
</script>


<script setup></script>

