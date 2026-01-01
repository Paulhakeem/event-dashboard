export default function useEventBooking() {
  const { user } = useAuth();
  const route = useRoute();
  const id = route.params.id;
  const phone = ref("0792857288");

  const event = ref({});
  const ticketType = ref("regular");
  const loading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);

  onMounted(async () => {
    try {
      loading.value = true;
      const res = await $fetch(`/api/events/${id}`);
      event.value = res.eventData;
    } catch (err) {
      error.value = err?.message || "Failed to load event";
    } finally {
      loading.value = false;
    }
  });

  const bookAndPay = async () => {
    if (!phone.value) {
      alert("Enter phone number");
      return;
    }

    // format phone: 07xx → 2547xx
    const formattedPhone = phone.value.startsWith("0")
      ? "254" + phone.value.slice(1)
      : phone.value;

    try {
      loading.value = true;

      await $fetch("/api/booking/stk", {
        method: "POST",
        body: {
          phone: formattedPhone,
          eventId: id,
          userId: user.value.id,
        },
      });

      alert("Check your phone and enter M-Pesa PIN 📲");
    } catch (err) {
      alert(err?.data?.message || "Failed to initiate payment");
    } finally {
      loading.value = false;
    }
  };

  return {
    event,
    phone,
    ticketType,
    loading,
    error,
    successMessage,
    bookAndPay,
  };
}
