<template>
  <div>
    <header>
      <!-- background image -->

      <div
        class="relative h-[400px] bg-cover bg-center flex items-center justify-center md:justify-start lg:justify-start px-4"
        style="background-image: url('/images/event-bg.jpg')"
      >
        <!-- Centered sidebar-main -->
        <div
          class="md:pl-8 lg:pl-10 md:pt-8 lg:pt-10 text-center md:text-left lg:text-left"
        >
          <h1 class="text-white text-4xl md:text-5xl lg:text-5xl font-semibold">
            DJ <span class="text-[#9c4e8b] font-bold">KIDD</span>
          </h1>
          <p
            class="text-gray-200 pt-4 pb-6 w-[300px] md:w-[500px] lg:w-[600px]"
          >
            Organize, track, and engage with your event attendees all in one
            place. Create and manage events seamlessly with our intuitive
            dashboard.
          </p>
          <button
            class="ml-auto rounded-md bg-[#9c4e8b] px-3 py-2 items-center text-white cursor-pointer mt-4 hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>
      </div>
    </header>
    <main>
      <!-- skeleton page component -->
      <!-- check if eventPoster length -->
       <div v-if="!eventPosters.length" class="flex justify-center items-center mt-10">
        <skeleton-card/>
        <skeleton-card/>
        <skeleton-card/>
        <skeleton-card/>
      </div>


      <!-- Event Page Component -->
      <events-event-page v-else />
      <section class="bg-[#020f31]">
        <subscribe />
      </section>
    </main>
  </div>
</template>

<script setup>
const { eventPosters } = EventFunctions();
</script>
