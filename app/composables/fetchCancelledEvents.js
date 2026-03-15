export const fetchCancelledEvents = () => {
  const config = useRuntimeConfig()
  const cancelledEvents = ref([]);
  const { token } = useAuth();

  const loadCancelledEvents = async () => {
    try {
      const res = await $fetch(config.public.cancelEventsApi, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const events = res?.events || [];
      cancelledEvents.value = events.filter(
        (event) => event.status === "cancelled"
      );
    } catch (err) {
      alert("Failed to fetch cancelled events", err);
    }
  };

  onMounted(loadCancelledEvents);

  return {
    cancelledEvents,
    loadCancelledEvents,
  };
};
