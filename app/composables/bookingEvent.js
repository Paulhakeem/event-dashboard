export default function useEventBooking() {
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

      // Check if event is cancelled or already completed
      if (event.value.status === "cancelled" || event.value.status === "completed") {
        error.value = "This event is no longer available for booking";
        alert(error.value);
        return;
      }

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

  /* -------------------- DARAAJA STK PUSH -------------------- */
  const bookAndPay = async () => {
    if (!user.value) {
      alert("Please login first");
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

    if (event.value.TicketQuantity <= 0) {
      alert('Tickets sold out for this event');
      return;
    }
    if (event.value.status === "cancelled" || event.value.status === "completed") {
      alert('This event is no longer available for booking');
      return;
    }

    // ask phone number
    const phone = prompt(
      "Enter your phone number in format 2547XXXXXXXX (M-Pesa)",
    );
    if (!phone) {
      alert("Phone number is required to initiate payment");
      return;
    }

    try {
      loading.value = true;
      const res = await $fetch("/api/booking/stkpush", {
        method: "POST",
        body: {
          phone,
          amount,
          eventName: event.value.title,
          userEmail: user.value.email,
          ticketType: ticketType.value,
        },
      });

      alert(
        "An STK push has been sent to your phone. Enter your M-Pesa PIN to complete the payment. Click OK when done to verify."
      );

      // verify using returned transactionId
      // use Daraja CheckoutRequestID for status query
      await verifyPayment(res.checkoutRequestID);
    } catch (err) {
      console.error(err);
      alert(err?.data?.statusMessage || "Failed to initiate payment");
    } finally {
      loading.value = false;
    }
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
