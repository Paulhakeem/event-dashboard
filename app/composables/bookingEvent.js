export default function useEventBooking() {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const route = useRoute();

  const id = route.params.id;

  const event = ref({});
  const ticketType = ref(null);

  const loading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);

  const ticketPdfBase64 = ref(null);
  const ticketPdfUrl = ref(null);

  /* ---------------- LOAD EVENT ---------------- */

  onMounted(async () => {
    try {
      loading.value = true;

      const res = await $fetch(`${config.public.bookingEvent}/${id}`);

      event.value = res.eventData;
    } catch (err) {
      error.value = err?.message || "Failed to load event";
    } finally {
      loading.value = false;
    }
  });

  /* ---------------- VERIFY PAYMENT ---------------- */

  const verifyPayment = async (checkoutRequestID) => {
    try {
      loading.value = true;

      const verifyResponse = await $fetch(config.public.verifyApi, {
        method: "POST",
        body: {
          reference: checkoutRequestID,
          eventName: event.value.title,
          userEmail: user.value.email,
          ticketType: ticketType.value,
        },
      });

      successMessage.value = verifyResponse.message;

      if (verifyResponse.ticketPdfBase64) {
        ticketPdfBase64.value = verifyResponse.ticketPdfBase64;

        const binary = atob(ticketPdfBase64.value);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });

        ticketPdfUrl.value = URL.createObjectURL(blob);
      }

      alert("Payment successful 🎉 Check your email");
    } catch (err) {
      alert(err?.data?.statusMessage || "Payment verification failed");
    } finally {
      loading.value = false;
    }
  };

  /* ---------------- BOOK EVENT ---------------- */

  const bookAndPay = async (phone) => {
    if (!user.value) {
      alert("Please login first");
      return;
    }

    if (!ticketType.value) {
      alert("Please select a ticket type");
      return;
    }

    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    if (
      event.value.status === "cancelled" ||
      event.value.status === "completed"
    ) {
      alert("This event is no longer available");
      return;
    }

    try {
      loading.value = true;

      const res = await $fetch(config.public.stkpushApi, {
        method: "POST",
        body: {
          phone,
          eventId: id,
          userEmail: user.value.email,
          ticketType: ticketType.value,
        },
      });

      alert("STK Push sent. Complete payment on your phone.");

      await verifyPayment(res.checkoutRequestID);
    } catch (err) {
      alert(err?.data?.statusMessage || "Payment initiation failed");
    } finally {
      loading.value = false;
    }
  };

  /* ---------------- DOWNLOAD TICKET ---------------- */

  const downloadTicket = () => {
    if (!ticketPdfUrl.value) return;

    const a = document.createElement("a");
    a.href = ticketPdfUrl.value;
    a.download = `${event.value.title}-ticket.pdf`;

    document.body.appendChild(a);
    a.click();
    a.remove();
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
