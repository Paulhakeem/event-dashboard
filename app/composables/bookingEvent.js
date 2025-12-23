export default function useEventBooking() {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const route = useRoute();
  const id = route.params.id;

  const event = ref({});
  const phone = ref("");

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

  // 🔐 async helper (NOT passed directly to Paystack)
  const verifyPayment = async (reference) => {
    loading.value = true;

    const verifyResponse = await $fetch("/api/booking/verify", {
      method: "POST",
      body: {
        reference,
        eventId: id,
        userId: user.value.id,
        phone: phone.value,
      },
    });

    successMessage.value = verifyResponse.message;
    alert("Payment successful! Check your email.");

    loading.value = false;
  };

  const bookAndPay = () => {
    if (!phone.value) {
      alert("Please enter phone number");
      return;
    }

    const PaystackPop = window.PaystackPop;

    if (!PaystackPop) {
      alert("Paystack not loaded yet");
      return;
    }

    const handler = PaystackPop.setup({
      key: config.paystackPublicKey,
      email: user.value.email,
      amount: event.value.vip * 100,
      currency: "Ksh",

      metadata: {
        phone: phone.value,
        eventId: id,
        userId: user.value.id,
        eventName: event.value.name,
      },

      // ✅ MUST be a plain function
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
    phone,
    loading,
    error,
    successMessage,
    bookAndPay,
  };
}
