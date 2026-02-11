export default function getBookingEvents() {
  const loading = ref(true);
  const eventsBooked = ref([]);

  onMounted(async () => {
    try {
      const res = await $fetch("/api/events/bookedEvents");
      if (res?.success) {
        // use deduplicated events summary
        eventsBooked.value = res.events;
      }
    } catch (error) {
     alert("Failed to fetch booked events.");
    } finally {
      loading.value = false;
    }
  });

  return{
    loading,
    eventsBooked
  }
}
