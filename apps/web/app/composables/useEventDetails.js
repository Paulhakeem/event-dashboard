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
  const ticketSelections = ref([]);

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

  const ticketName = (ticket) =>
    String(
      ticket?.name || ticket?.ticketType || ticket?.type || "",
    ).trim();

  watch(
    () => event.value?.customTickets,
    (tickets) => {
      const previous = new Map(
        ticketSelections.value.map((line) => [line.ticketType, line.quantity]),
      );

      ticketSelections.value = (Array.isArray(tickets) ? tickets : [])
        .map(ticketName)
        .filter(Boolean)
        .map((ticketType) => ({
          ticketType,
          quantity: previous.get(ticketType) || 0,
        }));
    },
    { immediate: true },
  );

  const isEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

  const priceOf = (name) => {
    const match = event.value?.customTickets?.find(
      (t) =>
        ticketName(t).toLowerCase() === String(name || "").trim().toLowerCase(),
    );
    return Number(match?.price) || 0;
  };

  const ticketAvailable = (ticket) => {
    const available = Number(ticket?.availableQuantity ?? ticket?.quantity ?? 0);
    return Number.isFinite(available) ? available : 0;
  };

  const isTicketTypeSoldOut = (ticket) => ticketAvailable(ticket) <= 0;

  const isEventSoldOut = computed(() => {
    const ev = event.value;
    if (!ev || ev.freeEntry) return false;

    if (Array.isArray(ev.customTickets) && ev.customTickets.length > 0) {
      return ev.customTickets.every((ticket) => isTicketTypeSoldOut(ticket));
    }

    return Math.floor(Number(ev.TicketQuantity) || 0) <= 0;
  });

  const lineTotal = (line) => priceOf(line.ticketType) * (line.quantity || 0);

  const totalQuantity = computed(() =>
    ticketSelections.value.reduce(
      (sum, line) => sum + (line.quantity || 0),
      0,
    ),
  );

  const totalPrice = computed(() =>
    ticketSelections.value.reduce((sum, line) => sum + lineTotal(line), 0),
  );

  const totalAvailable = computed(() => {
    const tickets = event.value?.customTickets;
    if (Array.isArray(tickets) && tickets.length > 0) {
      return tickets.reduce((sum, ticket) => sum + ticketAvailable(ticket), 0);
    }
    return Math.max(0, Math.floor(Number(event.value?.TicketQuantity) || 0));
  });

  const maxQuantity = computed(() => {
    const maxPerUser = Math.floor(Number(event.value?.maxTicketsPerUser) || 0);
    if (maxPerUser > 0) {
      return Math.min(maxPerUser, totalAvailable.value || maxPerUser);
    }
    return totalAvailable.value;
  });

  const remainingQuantity = computed(() =>
    Math.max(0, maxQuantity.value - totalQuantity.value),
  );

  const selectedTickets = computed(() =>
    ticketSelections.value
      .filter((line) => line.ticketType && Number(line.quantity) > 0)
      .map((line) => ({
        ticketType: line.ticketType,
        quantity: Math.floor(Number(line.quantity)),
      })),
  );

  const quantityOf = (ticket) => {
    const name = ticketName(ticket);
    return (
      ticketSelections.value.find(
        (line) => line.ticketType.toLowerCase() === name.toLowerCase(),
      )?.quantity || 0
    );
  };

  const maxForTicket = (ticket) => {
    const name = ticketName(ticket);
    if (!name) return 0;

    const current = quantityOf(ticket);
    const other = totalQuantity.value - current;
    const orderRemaining = Math.max(0, maxQuantity.value - other);

    return Math.max(
      0,
      Math.min(Math.floor(ticketAvailable(ticket)), orderRemaining),
    );
  };

  const remainingForTicket = (ticket) =>
    Math.max(0, maxForTicket(ticket) - quantityOf(ticket));

  const setTicketQuantity = (ticket, value) => {
    const name = ticketName(ticket);
    if (!name) return;

    const line = ticketSelections.value.find(
      (selection) => selection.ticketType.toLowerCase() === name.toLowerCase(),
    );
    if (!line) return;

    const parsed = Math.floor(Number(value) || 0);
    line.quantity = Math.max(0, Math.min(parsed, maxForTicket(ticket)));
  };

  const increaseTicketQuantity = (ticket) => {
    if (quantityOf(ticket) < maxForTicket(ticket)) {
      setTicketQuantity(ticket, quantityOf(ticket) + 1);
    }
  };

  const decreaseTicketQuantity = (ticket) => {
    if (quantityOf(ticket) > 0) {
      setTicketQuantity(ticket, quantityOf(ticket) - 1);
    }
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
      totalQuantity.value > 0 &&
      totalQuantity.value <= maxQuantity.value &&
      selectedTickets.value.every((t) => {
        const match = ev.customTickets?.find(
          (c) =>
            ticketName(c).toLowerCase() === String(t.ticketType).toLowerCase(),
        );
        return (
          !!match &&
          !!Number(match.price) &&
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
    ticketSelections,
    priceOf,
    ticketAvailable,
    isTicketTypeSoldOut,
    isEventSoldOut,
    lineTotal,
    totalQuantity,
    totalPrice,
    totalAvailable,
    maxQuantity,
    remainingQuantity,
    selectedTickets,
    quantityOf,
    maxForTicket,
    remainingForTicket,
    setTicketQuantity,
    increaseTicketQuantity,
    decreaseTicketQuantity,
    isBookable,
    copyShareLink,
    handleBooking,
  };
}
