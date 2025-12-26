export default function useEventBooking() {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const route = useRoute();
  const id = route.params.id;

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

  const verifyPayment = async (reference) => {
    loading.value = true;
    try {
      const verifyResponse = await $fetch("/api/booking/verify", {
        method: "POST",
        body: {
          reference,
          eventId: id,
          userId: user.value.id,
          ticketType: ticketType.value,
        },
      });
      successMessage.value = verifyResponse.message;
      alert("Payment successful! Check your email.");
    } catch (err) {
      error.value = err?.message || "Payment verification failed";
      alert(error.value);
    } finally {
      loading.value = false;
    }
  };

  const bookAndPay = () => {
    const PaystackPop = window.PaystackPop;
    if (!PaystackPop) {
      alert("Paystack not loaded yet");
      return;
    }

    if (!ticketType.value) {
      alert("Please select a ticket type before paying.");
      return;
    }

    const amountMap = {
      regular: event.value.regular,
      vip: event.value.vip,
      vvip: event.value.vvip,
    };

    const amount = (amountMap[ticketType.value] || 0) * 100;
    if (!amount || amount <= 0) {
      alert("Invalid ticket price. Please reload the page or contact support.");
      return;
    }

    const handler = PaystackPop.setup({
      key: config.public.paystackPublicKey,
      email: user.value.email,
      amount,
      currency: "KES",
      metadata: {
        eventId: id,
        userId: user.value.id,
        ticketType: ticketType.value,
        eventName: event.value.title,
      },
      callback: function (response) {
        verifyPayment(response.reference);
      },
      onClose: function () {
        alert("Transaction was not completed.");
      },
    });

    handler.openIframe();
  };

  return {
    event,
    ticketType,
    loading,
    error,
    successMessage,
    bookAndPay,
  };
}
