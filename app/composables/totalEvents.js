export const totalEvents = () => {
  const { token } = useAuth();
  const events = ref([]);
  const loading = ref(true);
  onMounted(async () => {
    try {
      const res = await $fetch("/api/events", {
        headers: {
          // send token
          Authorization: `Bearer ${token.value}`,
        },
      });
      events.value = res.events;
      console.log(res.events);
    } catch (err) {
      window.alert(err);
    } finally {
      loading.value = false;
    }
  });
  return { events, loading };
};
