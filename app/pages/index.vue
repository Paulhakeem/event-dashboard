<template>
  <header>
    <!-- background image -->
    <div class="relative h-96 w-full">
      <img
        src="/images/dj.jpg"
        alt="Event Background"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 flex items-center justify-center md:justify-start lg:justify-start">
        <div class="md:pl-8 lg:pl-8">
          <h1 class="text-white text-xl pb-3 md:text-5xl lg:text-6xl font-semibold">Events</h1>
          <button
            class="ml-auto rounded-md bg-blue-600 px-3 py-2 items-center text-white hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>
