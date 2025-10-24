export const bookingEvent = async () => {
  const route = useRoute();
  const event = ref([]);
  const booking = reactive({
    number: "",
  });

  const loading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);

  onMounted(async () => {
    try {
      const id = route.params.id;
      const res = await $fetch(`/api/events/${id}`, {
        method: "GET",
        params: { id },
      });
      event.value = res.eventData;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  const submitBooking = async () => {
    try {
      loading.value = true;
      const response = await $fetch("/api/booking/post", {
        method: "POST",
        body: {
          eventId: event.value._id,
          number: booking.number,
        },
      });
      successMessage.value = response.message;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    event,
    booking,
    loading,
    error,
    successMessage,
    submitBooking,
  };
};
