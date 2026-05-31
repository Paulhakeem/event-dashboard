export default function useEventFunctions() {
  const config = useRuntimeConfig();
  const eventPosters = ref([]);

  const pendings = ref(true);

  const errorMessage = ref("");

  const fetchEvents = async () => {
    pendings.value = true;
    errorMessage.value = "";
    try {
      const res = await $fetch(`${config.public.totalEventsApi}`);
      if (res.success) {
        eventPosters.value = res.events || [];
      } else {
        errorMessage.value = res.message || "Failed to load events";
      }
    } catch (error) {
      errorMessage.value = error.message;
      throw error;
    } finally {
      pendings.value = false;
    }
  };

  return { eventPosters, pendings, errorMessage, fetchEvents };
}
