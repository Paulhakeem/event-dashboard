export default function useEventBooking() {
  const config = useRuntimeConfig();
  const route = useRoute();

  const id = computed(() => route.params.id);

  const event = ref({});

  const loading = ref(false);
  const paymentStatus = ref("idle");
  const currentPaymentReference = ref(null);
  const error = ref(null);
  const successMessage = ref(null);

  const ticketPdfBase64 = ref(null);
  const ticketPdfUrl = ref(null);

  // Contact details for the booking (account details when logged in,
  // otherwise the guest details typed into the booking form). Verification
  // needs the email so guests can claim a payment without an account.
  const bookingContact = ref({ firstName: "", lastName: "", email: "" });

  /* ---------------- LOAD EVENT ---------------- */

  watchEffect(async () => {
    if (!id.value) return;
    try {
      loading.value = true;
      error.value = null;

      const res = await $fetch(`${config.public.bookingEvent}/${id.value}`);

      event.value = res.eventData;
    } catch (err) {
      error.value = err?.data?.statusMessage || err?.message || "Failed to load event";
      // If it's a 404, keep error but ensure we can detect it
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
        headers: { "Content-Type": "application/json" },
        body: {
          reference: checkoutRequestID,
          email: bookingContact.value.email,
        },
      });

      const emailDelivery = verifyResponse.emailDelivery;
      successMessage.value =
        emailDelivery?.attendee === false
          ? `${verifyResponse.message} Your ticket email could not be sent yet; check your email settings or retry payment verification shortly.`
          : verifyResponse.message;
      paymentStatus.value = "success";

      if (verifyResponse.ticketPdfBase64) {
        ticketPdfBase64.value = verifyResponse.ticketPdfBase64;

        const binary = atob(ticketPdfBase64.value);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });

        ticketPdfUrl.value = URL.createObjectURL(blob);
      }
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* ---------------- BOOK EVENT ---------------- */

  const checkPaymentStatus = async () => {
    const paymentReference = currentPaymentReference.value;
    if (!paymentReference) return;

    paymentStatus.value = "verifying";
    error.value = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await verifyPayment(paymentReference);
        paymentStatus.value = "success";
        return;
      } catch (err) {
        const msg = String(err?.data?.statusMessage || err?.statusMessage || err?.message || "").toLowerCase();
        if (err?.data?.final === true || msg.includes("cancel")) {
          paymentStatus.value = "failed";
          error.value =
            err?.data?.statusMessage ||
            err?.statusMessage ||
            "STK has been cancelled";
          return;
        }

        if (attempt < 2) {
          paymentStatus.value = "waiting";
          await new Promise((resolve) => setTimeout(resolve, 15000));
        }
      }
    }

    paymentStatus.value = "failed";
    error.value = "STK has been cancelled";
  };

  const bookAndPay = async (phone, tickets = [], contact = {}) => {
    const firstName = String(contact.firstName || "").trim();
    const lastName = String(contact.lastName || "").trim();
    const email = String(contact.email || "").trim().toLowerCase();

    if (!firstName) {
      alert("Please enter your first name");
      return;
    }

    if (!lastName) {
      alert("Please enter your last name");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    bookingContact.value = { firstName, lastName, email };

    const selectedTickets = (Array.isArray(tickets) ? tickets : [])
      .filter((t) => t?.ticketType && Math.floor(Number(t?.quantity) || 0) > 0)
      .map((t) => ({
        ticketType: t.ticketType,
        quantity: Math.floor(Number(t.quantity) || 0),
      }));

    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket type");
      return;
    }

    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    const totalQuantity = selectedTickets.reduce(
      (sum, t) => sum + t.quantity,
      0,
    );

    if (totalQuantity < 1) {
      alert("Please select at least one ticket");
      return;
    }

    const maxPerUser = Math.floor(Number(event.value?.maxTicketsPerUser) || 0);
    if (maxPerUser > 0 && totalQuantity > maxPerUser) {
      alert(
        `You can only purchase up to ${maxPerUser} ticket${maxPerUser === 1 ? "" : "s"} for this event.`,
      );
      return;
    }

    const eventTotal = Math.floor(Number(event.value?.TicketQuantity) || 0);
    if (eventTotal > 0 && totalQuantity > eventTotal) {
      alert(`Only ${eventTotal} ticket${eventTotal === 1 ? "" : "s"} left for this event.`);
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
      paymentStatus.value = "sending";
      error.value = null;
      successMessage.value = null;

      const res = await $fetch(config.public.stkpushApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          phone,
          eventId: id.value,
          tickets: selectedTickets,
          firstName: bookingContact.value.firstName,
          lastName: bookingContact.value.lastName,
          email: bookingContact.value.email,
        },
      });
      paymentStatus.value = "waiting";

      const paymentReference =
        res.reference || res.checkoutRequestID || res.CheckoutRequestID;
      if (!paymentReference) {
        throw new Error("Payment provider did not return a payment reference.");
      }

      currentPaymentReference.value = paymentReference;
      await checkPaymentStatus();
    } catch (err) {
      paymentStatus.value = "failed";
      error.value = err?.data?.statusMessage || err?.statusMessage || "Payment initiation failed";
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
    loading,
    paymentStatus,
    error,
    successMessage,
    ticketPdfUrl,
    bookAndPay,
    checkPaymentStatus,
    downloadTicket,
  };
}
