<template>
  <div>
    <div class="flex items-center justify-center ml-10 z-50">
      <ClientOnly>
        <Sidebar v-if="!isUserDashboard" />
      </ClientOnly>
    </div>

    <slot />
    <ChatBotChat/>
  </div>
</template>

<script setup>
const route = useRoute();
const isUserDashboard = computed(() => route.path.startsWith("/user/"));
</script>
