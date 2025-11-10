export default function useEventBooking() {
  const route = useRoute();
  const id = route.params.id;
  const event = ref([]);
  const phone = ref("");

  const loading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);

  onMounted(async () => {
    try {
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
    // length check for phone number
    if (phone.value.toString().length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    const user = localStorage.getItem("user");
    if (!user) {
      alert("You must be logged in to book.");
      return;
    }
    try {
      loading.value = true;
      const response = await $fetch("/api/booking/post", {
        method: "POST",
        body: {
          eventId: id,
          userId: user,
          phone: phone.value,
        },
      });
      console.log("Booking response:", response);
      successMessage.value = response.message;
      alert(successMessage.value);
    } catch (err) {
      alert(err?.message || "Failed to book event");
      //   error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    event,
    phone,
    loading,
    error,
    successMessage,
    submitBooking,
  };
}
