<script setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap",
    },
  ],
});
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
