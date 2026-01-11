export default function useEventBooking() {
  const { user } = useAuth();
  const route = useRoute();
  const id = route.params.id;
  const phone = ref("");

  const event = ref({});
  // selected ticket type (single value) and available options
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
    if (!user.value) {
      alert("Please login first");
      return;
    }

    if (!phone.value || phone.value.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!window.PaystackPop) {
      alert("Payment service not loaded. Please refresh.");
      return;
    }

    // format phone: 07xx → 2547xx
    const formattedPhone = phone.value.startsWith("0")
      ? "254" + phone.value.slice(1)
      : phone.value;

    // generate unique Paystack reference
    const reference = `EVT-${id}-${Date.now()}`;

    // select ticket price safely
    const amount =
      ticketType.value === "vip"
        ? event.value?.vip
        : ticketType.value === "vvip"
        ? event.value?.vvip
        : event.value?.regular;

    if (!amount) {
      alert("Ticket price not available");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: useRuntimeConfig().public.paystackPublicKey,
      email: user.value.email,
      amount: amount * 100,
      currency: "KES",
      ref: reference,

      metadata: {
        eventId: id,
        userId: user.value.id,
        ticketType: ticketType.value,
        phone: formattedPhone,
      },

      callback: async (response) => {
        try {
          loading.value = true;

          const res = await $fetch("/api/booking/verify", {
            method: "POST",
            body: {
              phone: formattedPhone,
              eventId: id,
              userId: user.value.id,
              ticketType: ticketType.value,
              reference: response.reference,
            },
          });

          successMessage.value = res.message;
          alert("Payment successful 🎉 Check your email");
        } catch (err) {
          alert(err?.data?.message || "Payment verification failed");
        } finally {
          loading.value = false;
        }
      },

      onClose: () => {
        alert("Payment cancelled");
      },
    });

    handler.openIframe();
  };

  return {
    event,
    ticketType,
    phone,
    loading,
    error,
    successMessage,
    bookAndPay,
  };
}
