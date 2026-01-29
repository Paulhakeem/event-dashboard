<script setup>
useHead({
  script: [{ src: "https://js.paystack.co/v1/inline.js" }],
});
</script>
<template>
  <head>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
    />
  </head>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>
