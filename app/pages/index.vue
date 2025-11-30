<template>
  <div>
<header>
  <!-- Hero Section -->
  <div
    class="relative w-full h-[380px] sm:h-[450px] md:h-[520px] lg:h-[600px] xl:md 2xl:lg bg-cover bg-center flex items-center px-4"
    style="background-image: url('/images/event-bg.jpg')"
  >
    <!-- Dark overlay for readability -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Content -->
    <div
      class="relative z-10 max-w-xl text-center md:text-left space-y-4 md:space-y-6"
    >
      <h1
        class="signature-glow text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
      >
        DJ <span class="text-[#9c4e8b] font-bold">KIDD</span>
      </h1>

      <p style="font-family: 'Poppins', sans-serif;"
        class="text-gray-200 text-sm font-light sm:text-base md:text-lg lg:text-xl max-w-[90%] mx-auto md:mx-0"
      >
        Organize, track, and engage with your event attendees all in one
        place. Create and manage events seamlessly with our intuitive
        dashboard.
      </p>

      <button
        class="rounded-md bg-[#9c4e8b] px-5 py-3 text-white text-sm sm:text-base font-medium transition hover:bg-[#803c72] cursor-pointer"
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
