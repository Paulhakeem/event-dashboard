export default function useEventBooking() {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const route = useRoute();
  const id = route.params.id;

  const event = ref({});
  const ticketType = ref("earlyBirds"); 

  const loading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);
  const ticketPdfBase64 = ref(null);
  const ticketPdfUrl = ref(null);

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
          eventName: event.value.title,
          userEmail: user.value.email,
          ticketType: ticketType.value, // REQUIRED
        },
      });

      successMessage.value = verifyResponse.message;
      if (verifyResponse.ticketPdfBase64) {
        ticketPdfBase64.value = verifyResponse.ticketPdfBase64;
        try {
          const binary = atob(verifyResponse.ticketPdfBase64);
          const len = binary.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes], { type: "application/pdf" });
          ticketPdfUrl.value = URL.createObjectURL(blob);
        } catch (e) {
          console.warn("Failed to build ticket PDF URL", e);
        }
      }
      alert("Payment successful 🎉 Check your email");

    } catch (err) {
      alert(err?.data?.statusMessage || "Payment verification failed");
    } finally {
      loading.value = false;
    }
  };

  const downloadTicket = () => {
    if (!ticketPdfUrl.value && ticketPdfBase64.value) {
      const binary = atob(ticketPdfBase64.value);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      ticketPdfUrl.value = URL.createObjectURL(blob);
    }
    if (ticketPdfUrl.value) {
      const a = document.createElement("a");
      a.href = ticketPdfUrl.value;
      a.download = `${event.value.title || 'ticket'}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
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
      earlyBirds: event.value.earlyBirds,
      AtDoor: event.value.AtDoor,
      Advanced: event.value.Advanced,
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
    // Prevent opening payment if no tickets left
    if (event.value.TicketQuantity <= 0) {
      alert('Tickets sold out for this event');
      return;
    }

    const handler = PaystackPop.setup({
      key: config.public.paystackPublicKey,
      email: user.value.email,
      amount: amount * 100, // kobo
      currency: "KES",

      ref: reference,

      metadata: {
        eventName: event.value.title,
        userEmail: user.value.email,
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
    ticketPdfUrl,
    bookAndPay,
    downloadTicket,
  };
}
