export default function useOrganiserEvents() {
  const { token } = useAuth();
  const bookings = ref([]);
  const loadingBookings = ref(false);
  const errorBookings = ref(null);
  const config = useRuntimeConfig();
  const { formatDate } = organiserEvents();
  const eventCounts = ref({});
  const getBookings = async () => {
    loadingBookings.value = true;
    errorBookings.value = null;
    try {
      const response = await $fetch(`${config.public.organiserBookingEvents}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      bookings.value = Array.isArray(response)
        ? response
        : response?.bookings || [];

      // compute counts per event name
      const counts = {};
      for (const bk of bookings.value) {
        const name = bk.eventName || bk.name || "Unnamed event";
        counts[name] = (counts[name] || 0) + 1;
      }
      eventCounts.value = counts;
    } catch (err) {
      errorBookings.value = "An error occurred while fetching bookings";
    } finally {
      loadingBookings.value = false;
    }
  };

  onMounted(() => {
    getBookings();
  });
  return {
    bookings,
    loadingBookings,
    errorBookings,
    formatDate,
    eventCounts,
  };
}
