
export default function useEventFunctions() {
  const config = useRuntimeConfig()
  const eventPosters = ref([]);

  const pendings = ref(true);

  const errorMessage = ref("");

  const fetchEvents = async () => {
    try {
      const res = await $fetch(`${config.public.eventApi}`);
      if (res.success) {
        eventPosters.value = res.events || [];
      }
    } catch (error) {
      errorMessage.value = error.message;
      throw error;
    } finally {
      pendings.value = false;
    }
  };

  onMounted(fetchEvents);

  return { eventPosters, pendings, errorMessage, fetchEvents };
}
