export default function getBookingEvents() {
  const config = useRuntimeConfig();

  // Separate loading/error per function so they don't interfere
  const loading = ref(false);
  const error = ref("");

  const eventsBooked = ref([]); // raw events: used by the table
  const aggregatedEvents = ref([]); // grouped by name: used by charts/stats

  // ── Raw bookings (full event detail for the table) ──────────────────────
  const fetchBookedEvents = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await $fetch(`${config.public.bookedEvents}`);
      if (res?.success && res.events) {
        eventsBooked.value = res.events;
      } else {
        error.value = res?.message || "Failed to load booked events";
      }
    } catch (err) {
      error.value = err?.message || "Failed to load booked events";
    } finally {
      loading.value = false;
    }
  };

  // ── Aggregated bookings (grouped by event name for charts/stats) ─────────
  const aggregateBookings = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await $fetch(`${config.public.bookedEvents}`);
      if (res?.success && res.events) {
        const eventMap = {};
        res.events.forEach((event) => {
          if (!eventMap[event.eventName]) {
            eventMap[event.eventName] = {
              name: event.eventName,
              totalBookings: 0,
              totalIncome: 0,
            };
          }
          eventMap[event.eventName].totalBookings += event.totalBookings || 0;
          eventMap[event.eventName].totalIncome += event.totalRevenue || 0;
        });

        aggregatedEvents.value = Object.values(eventMap)
          .sort((a, b) => b.totalBookings - a.totalBookings)
          .slice(0, 5);
      } else {
        error.value = res?.message || "Failed to fetch booked events data";
      }
    } catch (err) {
      error.value = "Failed to fetch booked events data";
    } finally {
      loading.value = false;
    }
  };

  // Runs both in parallel; shared loading/error covers both.
  const fetchAll = async () => {
    loading.value = true;
    error.value = "";
    try {
      await Promise.all([fetchBookedEvents(), aggregateBookings()]);
    } catch (err) {
      error.value = err?.message || "Failed to load booking data";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    eventsBooked, // use in the bookings table
    aggregatedEvents, // use in charts / stats overview
    fetchBookedEvents,
    aggregateBookings,
    fetchAll, // call this if you need both at the same time
  };
}
