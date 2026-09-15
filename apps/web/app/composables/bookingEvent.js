export default function useEventBooking() {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const route = useRoute();

  const id = computed(() => route.params.id);

  const event = ref({});

  const loading = ref(false);
  const paymentStatus = ref("idle");
  const error = ref(null);
  const successMessage = ref(null);

  const ticketPdfBase64 = ref(null);
  const ticketPdfUrl = ref(null);

  /* ---------------- LOAD EVENT ---------------- */

  watchEffect(async () => {
    if (!id.value) return;
    try {
      loading.value = true;

      const res = await $fetch(`${config.public.bookingEvent}/${id.value}`);

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
        headers: { "Content-Type": "application/json" },
        body: {
          reference: checkoutRequestID,
        },
      });

      successMessage.value = verifyResponse.message;
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

  const bookAndPay = async (phone, tickets = []) => {
    if (!user.value) {
      alert("Please login first");
      return;
    }

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

      console.log("[booking] stkpush payload:", {
        phone,
        eventId: id.value,
        userEmail: user.value.email,
        tickets: selectedTickets,
      });

      const res = await $fetch(config.public.stkpushApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        query: {
          phone,
          eventId: id.value,
          userEmail: user.value.email,
          tickets: JSON.stringify(selectedTickets),
        },
        body: {
          phone,
          eventId: id.value,
          userEmail: user.value.email,
          tickets: selectedTickets,
        },
      });
      paymentStatus.value = "waiting";

      // wait before verifying
      const tryVerify = async (id, retries = 3) => {
        paymentStatus.value = "verifying";

        for (let i = 0; i < retries; i++) {
          try {
            console.log(`Verification attempt ${i + 1}`);

            await verifyPayment(id);

            // ✅ SUCCESS
            paymentStatus.value = "success";
            return;
          } catch (err) {
            console.log("Retrying verification...", i + 1);

            // Payment was definitively rejected by M-Pesa (insufficient
            // balance, cancelled, wrong PIN) — stop retrying right away.
            if (err?.data?.final === true) {
              paymentStatus.value = "failed";
              error.value =
                err?.data?.statusMessage ||
                "Payment not successful. Please try again.";
              return;
            }

            // If it's last attempt → fail
            if (i === retries - 1) {
              paymentStatus.value = "failed";
              error.value =
                err?.data?.statusMessage ||
                "Payment not successful. Please try again.";
              return;
            }

            // ⏳ Still waiting for user payment
            paymentStatus.value = "waiting";

            await new Promise((res) => setTimeout(res, 15000));
            paymentStatus.value = "verifying";
          }
        }
      };

      await tryVerify(res.checkoutRequestID);
    } catch (err) {
      paymentStatus.value = "failed";
      error.value = err?.data?.statusMessage || "Payment initiation failed";
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
    downloadTicket,
  };
}
