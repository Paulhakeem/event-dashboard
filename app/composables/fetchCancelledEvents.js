export const fetchCancelledEvents = () => {
  const cancelledEvents = ref([]);
  const { token } = useAuth();

  const loadCancelledEvents = async () => {
    try {
      const res = await $fetch("/api/events/fetch", {
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
