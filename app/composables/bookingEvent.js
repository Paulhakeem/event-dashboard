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

  /* -------------------- LOAD EVENT -------------------- */
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

  /* -------------------- VERIFY PAYMENT -------------------- */
  const verifyPayment = async (reference) => {
    try {
      loading.value = true;

      const verifyResponse = await $fetch("/api/booking/verify", {
        method: "POST",
        body: {
          reference,
          eventId: id,
          userId: user.value.id,
          ticketType: ticketType.value, // ✅ REQUIRED
        },
      });

      successMessage.value = verifyResponse.message;
      alert("Payment successful 🎉 Check your email");

    } catch (err) {
      alert(err?.data?.statusMessage || "Payment verification failed");
    } finally {
      loading.value = false;
    }
  };

  /* -------------------- PAYSTACK POPUP -------------------- */
  const bookAndPay = () => {
    if (!user.value) {
      alert("Please login first");
      return;
    }

    const PaystackPop = window.PaystackPop;
    if (!PaystackPop) {
      alert("Paystack not loaded yet");
      return;
    }

    /* -------- PRICE SELECTION -------- */
    const priceMap = {
      regular: event.value.regular,
      vip: event.value.vip,
      vvip: event.value.vvip,
    };

    const amount = priceMap[ticketType.value];

    if (!amount) {
      alert("Invalid ticket selected");
      return;
    }

    /* -------- UNIQUE REFERENCE -------- */
    const reference = `EVT-${id}-${Date.now()}`;

    const handler = PaystackPop.setup({
      key: config.public.paystackPublicKey,
      email: user.value.email,
      amount: amount * 100, // kobo
      currency: "KES",

      ref: reference,

      metadata: {
        eventId: id,
        userId: user.value.id,
        ticketType: ticketType.value,
      },

      callback: function (response) {
        verifyPayment(response.reference);
      },

      onClose: function () {
        alert("Transaction cancelled");
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
