export default function getBookingEvents() {
  const loading = ref(true);
  const eventsBooked = ref([]);
  const error = ref("");

  // get total events booked for the logged in user
  onMounted(async () => {
    try {
      const res = await $fetch("/api/events/bookedEvents");
      if (res?.success) {
        // use deduplicated events summary
        eventsBooked.value = res.events;
      }
    } catch (error) {
      error.value = error?.message || "Failed to load booked events";
    } finally {
      loading.value = false;
    }
  });

  // aggregate total bookings and income by event
  const aggregateBookings = async () => {
    loading.value = true;
    const res = await $fetch("/api/events/bookedEvents");
    const eventMap = {};
    if (res.success && res.events) {
      res.events.forEach((event) => {
        if (!eventMap[event.name]) {
          eventMap[event.name] = {
            name: event.name,
            totalBookings: 0,
            totalIncome: 0,
          };
        }
        eventMap[event.name].totalBookings += event.totalBookings;
        eventMap[event.name].totalIncome += event.totalIncome;
      });

      eventsBooked.value = Object.values(eventMap)
        .sort((a, b) => b.totalBookings - a.totalBookings)
        .slice(0, 5);
    }
    error.value = "Failed to fetch booked events data";
  };
  return {
    loading,
    eventsBooked,
    error,
    aggregateBookings,
  };
}
