<template>
  <main>
    <div class="pb-10">
      <graphs-section1 />
    </div>
    <div class="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Card -->
      <graphs-bar-chart />
      <!-- End Card -->

      <!-- Card -->
      <graphs-line-chart />
      <!-- End Card -->
    </div>
    <div class="grid lg:grid-cols-2 gap-4 pt-10 sm:gap-6">
    <dashboard-ongoing-events/>

    <dashboard-top-events/>
    </div>
  </main>
</template>
