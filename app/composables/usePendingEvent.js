export default function usePendingEvent() {
//  get all the pending events
 const { token } = useAuth();
  const pendingEvents = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch pending events
  const fetchPendingEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch("/api/events/fetch", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const events = res?.events || [];
      pendingEvents.value = events.filter(
        (event) => event.status === "pending"
      );
    } catch (err) {
      console.error(err);
      error.value = "Failed to fetch pending events";
    } finally {
      loading.value = false;
    }
  };

  // Approve event
  const approveEvent = async (eventId) => {
    try {
      await $fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: {
          status: "approved",
        },
      });

      alert("✅ Event approved! Organiser has been notified.");
      await fetchPendingEvents();
    } catch (err) {
      alert("Failed to approve event");
    }
  };

  // Reject event
  const rejectEvent = async (eventId) => {
    if (!confirm("Are you sure you want to reject this event?")) return;

    try {
      await $fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: {
          status: "cancelled",
        },
      });

      await fetchPendingEvents();
    } catch (err) {
      alert("Failed to reject event");
    }
  };

  onMounted(fetchPendingEvents);

  return {
    pendingEvents,
    loading,
    error,
    fetchPendingEvents,
    approveEvent,
    rejectEvent,
  };
}
