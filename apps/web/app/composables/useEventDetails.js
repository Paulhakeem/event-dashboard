import { computed, ref, watch } from "vue";
import useEventBooking from "~/composables/bookingEvent";

export default function useEventDetails() {
  const route = useRoute();

  const {
    event,
    loading,
    paymentStatus,
    error,
    successMessage,
    bookAndPay,
    checkPaymentStatus,
  } = useEventBooking();

  const { user } = useAuth();

  const paymentAlert = ref(null);

  watch(paymentStatus, (status) => {
    if (status === "success") {
      paymentAlert.value = {
        variant: "success",
        title: "Payment successful",
        message:
          successMessage.value ||
          "Your payment has been sent successfully!!. Check your Email.",
      };
      return;
    }

    if (status === "failed") {
      paymentAlert.value = {
        variant: "failed",
        title: "Payment failed",
        message:
          error.value ||
          "Your payment could not be completed. Please check your details and try again.",
      };
    }
  });

  const phone = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const ticketLines = ref([{ ticketType: "", quantity: 1 }]);

  // Logged-in users book with their account details by default; guests type
  // their own. The fields stay editable either way.
  watch(
    user,
    (u) => {
      if (!u) return;
      if (!firstName.value) firstName.value = u.firstName || "";
      if (!lastName.value) lastName.value = u.lastName || "";
      if (!email.value) email.value = u.email || "";
    },
    { immediate: true },
  );

  const isEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

  const priceOf = (name) =>
    event.value?.customTickets?.find((t) => t.name === name)?.price ?? 0;

  const ticketAvailable = (ticket) => {
    const available = Number(ticket?.availableQuantity ?? ticket?.quantity ?? 0);
    return Number.isFinite(available) ? available : 0;
  };

  const isTicketTypeSoldOut = (ticket) => ticketAvailable(ticket) <= 0;

  const isEventSoldOut = computed(() => {
    const ev = event.value;
    if (!ev || ev.freeEntry) return false;
    if (Math.floor(Number(ev.TicketQuantity) || 0) <= 0) return true;

    if (Array.isArray(ev.customTickets) && ev.customTickets.length > 0) {
      return ev.customTickets.every((ticket) => isTicketTypeSoldOut(ticket));
    }

    return false;
  });

  const lineTotal = (line) => priceOf(line.ticketType) * (line.quantity || 0);

  const totalQuantity = computed(() =>
    ticketLines.value.reduce((sum, line) => sum + (line.quantity || 0), 0),
  );

  const totalPrice = computed(() =>
    ticketLines.value.reduce((sum, line) => sum + lineTotal(line), 0),
  );

  const maxQuantity = computed(() => {
    const eventTotal = event.value?.TicketQuantity || 0;
    const maxPerUser = Math.floor(Number(event.value?.maxTicketsPerUser) || 0);
    if (maxPerUser > 0) return Math.min(eventTotal || maxPerUser, maxPerUser);
    return eventTotal;
  });

  const selectedTickets = computed(() =>
    ticketLines.value
      .filter((line) => line.ticketType && Number(line.quantity) > 0)
      .map((line) => ({
        ticketType: line.ticketType,
        quantity: Number(line.quantity),
      })),
  );

  const addTicketLine = () => {
    if (totalQuantity.value >= maxQuantity.value) return;
    ticketLines.value.push({ ticketType: "", quantity: 1 });
  };

  const removeTicketLine = (index) => {
    if (ticketLines.value.length <= 1) return;
    ticketLines.value.splice(index, 1);
  };

  const getTypeAvailability = (typeName) => {
    if (!typeName) return Infinity;
    const t = event.value?.customTickets?.find(
      (c) =>
        String(c.name || c.ticketType || c.type).toLowerCase() ===
        String(typeName).toLowerCase(),
    );
    if (t) {
      const avail = Number(t.availableQuantity ?? t.quantity ?? 0);
      if (Number.isFinite(avail) && avail >= 0) return avail;
    }
    return maxQuantity.value;
  };

  const remainingForLine = (index) => {
    const line = ticketLines.value[index];
    const avail = getTypeAvailability(line?.ticketType);
    if (!Number.isFinite(avail)) {
      const other = totalQuantity.value - (line?.quantity || 0);
      return Math.max(0, maxQuantity.value - other);
    }
    return Math.max(0, avail);
  };

  const increaseLineQuantity = (index) => {
    const line = ticketLines.value[index];
    if (!line?.ticketType) return;
    if (line.quantity < remainingForLine(index)) line.quantity++;
  };

  const decreaseLineQuantity = (index) => {
    const line = ticketLines.value[index];
    if (line?.quantity > 0) line.quantity--;
  };

  const isBookable = computed(() => {
    const ev = event.value;

    if (!ev) return false;
    if (ev.freeEntry) return false;

    return (
      selectedTickets.value.length > 0 &&
      phone.value &&
      firstName.value.trim() &&
      lastName.value.trim() &&
      isEmail(email.value) &&
      ev.status !== "cancelled" &&
      ev.status !== "completed" &&
      !isEventSoldOut.value &&
      ev.TicketQuantity > 0 &&
      totalQuantity.value <= maxQuantity.value &&
      selectedTickets.value.every((t) => {
        const match = ev.customTickets?.find((c) => c.name === t.ticketType);
        return (
          !!match &&
          !!match.price &&
          ticketAvailable(match) >= Number(t.quantity)
        );
      })
    );
  });

  const copyShareLink = async () => {
    if (process.client) {
      const url =
        event.value?.shareUrl ||
        `${window.location.origin}/events/${route.params.id}`;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          alert("Link copied to clipboard");
        } else {
          window.prompt("Copy this link:", url);
        }
      } catch (err) {
        window.prompt("Copy this link:", url);
      }
    }
  };

  const handleBooking = () => {
    if (event.value?.freeEntry) return;
    bookAndPay(phone.value, selectedTickets.value, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    });
  };

  return {
    event,
    loading,
    paymentStatus,
    error,
    successMessage,
    checkPaymentStatus,
    user,
    paymentAlert,
    phone,
    firstName,
    lastName,
    email,
    ticketLines,
    priceOf,
    isTicketTypeSoldOut,
    isEventSoldOut,
    lineTotal,
    totalQuantity,
    totalPrice,
    maxQuantity,
    selectedTickets,
    addTicketLine,
    removeTicketLine,
    remainingForLine,
    increaseLineQuantity,
    decreaseLineQuantity,
    isBookable,
    copyShareLink,
    handleBooking,
  };
}
