export default function getBookingEvents() {
  const config = useRuntimeConfig();

  const loading = ref(true);
  const error = ref("");

  const eventsBooked = ref([]);
  const aggregatedEvents = ref([]);

  // ── Raw bookings (full event detail for the table) ──────────────────────
  const fetchBookedEvents = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await $fetch(`${config.public.bookedEvents}`);
      if (res?.success && res.events) {
        eventsBooked.value = res.events;
      } else {
        eventsBooked.value = [];
        error.value = res?.message || "Failed to load booked events";
      }
    } catch (err) {
      eventsBooked.value = [];
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
      if (res?.success && Array.isArray(res.events)) {
        const eventMap = {};

        res.events.forEach((event) => {
          // FIX: guard against events with no eventName
          if (!event?.eventName) return;

          if (!eventMap[event.eventName]) {
            eventMap[event.eventName] = {
              name: event.eventName,
              totalBookings: 0,
              totalIncome: 0,
            };
          }

          eventMap[event.eventName].totalBookings += Number(
            event.totalBookings || 0,
          );
          eventMap[event.eventName].totalIncome += Number(
            event.totalRevenue || 0,
          );
        });

        aggregatedEvents.value = Object.values(eventMap)
          .sort((a, b) => b.totalBookings - a.totalBookings)
          .slice(0, 5);
      } else {
        aggregatedEvents.value = [];
        error.value = res?.message || "Failed to fetch booked events data";
      }
    } catch (err) {
      aggregatedEvents.value = [];
      error.value = err?.message || "Failed to fetch booked events data";
    } finally {
      loading.value = false;
    }
  };

  // ── Fetch both in parallel ────────
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
    eventsBooked,
    aggregatedEvents,
    fetchBookedEvents,
    aggregateBookings,
    fetchAll,
  };
}
