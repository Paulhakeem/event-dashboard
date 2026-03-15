export const totalEvents = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth();
  const events = ref([]);
  const loading = ref(true);
  onMounted(async () => {
    try {
      const res = await $fetch(`${config.public.totalEventsApi}`, {
        headers: {
          // send token
          Authorization: `Bearer ${token.value}`,
        },
      });
      events.value = res.events;
    } catch (err) {
      window.alert(err);
    } finally {
      loading.value = false;
    }
  });
  return { events, loading };
};
