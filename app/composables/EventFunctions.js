export default function useEventFunctions() {
  const eventPosters = ref([]);

  const pendings = ref(true);

  const errorMessage = ref("");

  onMounted(async () => {
    try {
      const res = await $fetch("/api/events");
      if (res.success) {
        eventPosters.value = res.events || [];
      }
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      pendings.value = false;
    }
  });

  return { eventPosters, pendings, errorMessage };
}
