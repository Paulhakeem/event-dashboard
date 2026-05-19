export const fetchCancelledEvents = () => {
  const config = useRuntimeConfig();
  const cancelledEvents = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const { token } = useAuth();

  const loadCancelledEvents = async () => {
    error.value = null;
    if (!token.value) {
      cancelledEvents.value = [];
      loading.value = false;
      return;
    }
    loading.value = true;
    try {
      const res = await $fetch(config.public.cancelEventsApi, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const events = res?.events || [];
      cancelledEvents.value = events.filter(
        (event) => event.status === "cancelled",
      );
    } catch (err) {
      error.value = err?.message || err?.statusMessage || "Failed to fetch cancelled events";
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadCancelledEvents);

  return {
    cancelledEvents,
    loading,
    error,
    loadCancelledEvents,
  };
};
