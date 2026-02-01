<template>
  <div class="flex min-h-screen bg-gray-50">
    <organiser-sidebar />

    <main class="flex-1 p-6 space-y-6 overflow-y-auto">
      <organiser-section />
      <OrganiserIncomeChart />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrganiserActivities />
        <OrganiserTopEvents />
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
</script>
