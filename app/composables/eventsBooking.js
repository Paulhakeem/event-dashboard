export default function getBookingEvents() {
  const loading = ref(true);
  const eventsBooked = ref([]);

  onMounted(async () => {
    try {
      const res = await $fetch("/api/events/bookedEvents");
      if (res.success) {
        console.log(res.mergeBookings);
        eventsBooked.value = res.mergeBookings;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      loading.value = false;
    }
  });

  return{
    loading,
    eventsBooked
  }
}
