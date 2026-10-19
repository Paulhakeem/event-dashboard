<template>
  <div>
    <div class="relative z-50 w-full">
      <ClientOnly>
        <Sidebar v-if="!isUserDashboard" />
      </ClientOnly>
    </div>

    <slot />
    <Footer v-if="!isUserDashboard" />
    <ChatBotChat/>
  </div>
</template>

<script setup>
const route = useRoute();
const isUserDashboard = computed(() => route.path.startsWith("/user/"));
</script>
