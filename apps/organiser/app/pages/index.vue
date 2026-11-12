<template>
  <div />
</template>

<script setup>
const { user } = useAuth();

onMounted(() => {
  navigateTo(user.value ? `/organiser/${user.value.id}` : "/login");
});
</script>
