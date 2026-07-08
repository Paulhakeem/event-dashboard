import { ref, computed } from "vue";
export default function useTickets() {
  const { fetchBookedEvents, error } = eventsBooking();
  const config = useRuntimeConfig();
  const { token } = useAuth();
  const tickets = ref([]);
  const totalTicketCount = ref(0);
  const cancelledTicketCount = ref(0);
  const ticketsLoading = ref(true);
  const cancelledLoading = ref(true);

  const ticketChartData = computed(() => {
    const months = Array.from({ length: 12 }, (_, index) => ({
      month: new Date(2020, index, 1)
        .toLocaleString("en-US", { month: "short" })
        .toLowerCase(),
      tickets: 0,
      cancelled: 0,
    }));

    const currentYear = new Date().getFullYear();

    (tickets.value || []).forEach((ticket) => {
      const createdAt = ticket?.createdAt ? new Date(ticket.createdAt) : null;

      if (!createdAt || Number.isNaN(createdAt.getTime())) return;
      if (createdAt.getFullYear() !== currentYear) return;

      const monthIndex = createdAt.getMonth();

      if (ticket?.status === "cancelled") {
        months[monthIndex].cancelled += 1;
      } else {
        months[monthIndex].tickets += 1;
      }
    });

    return months;
  });

  const totalTickets = computed(() => totalTicketCount.value);
  const totalCancelled = computed(() => cancelledTicketCount.value);

  const cancelledTrend = computed(() => {
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthCount =
      ticketChartData.value?.[currentMonth]?.cancelled ?? 0;
    const previousMonthCount =
      ticketChartData.value?.[previousMonth]?.cancelled ?? 0;

    if (previousMonthCount === 0) {
      return currentMonthCount > 0 ? "+100%" : "0%";
    }

    const change =
      ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  });

  const ticketTrend = computed(() => {
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthCount =
      ticketChartData.value?.[currentMonth]?.tickets ?? 0;
    const previousMonthCount =
      ticketChartData.value?.[previousMonth]?.tickets ?? 0;

    if (previousMonthCount === 0) {
      return currentMonthCount > 0 ? "+100%" : "0%";
    }

    const change =
      ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  });

  const cancellationRate = computed(() =>
    totalTicketCount.value > 0
      ? ((cancelledTicketCount.value / totalTicketCount.value) * 100).toFixed(1)
      : "0.0",
  );

  onMounted(async () => {
    await fetchBookedEvents();
    if (error?.value) console.error("Booking Error:", error.value);
    const res = await $fetch(`${config.public.ticketsEvents}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    tickets.value = Array.isArray(res?.tickets) ? res.tickets : [];

    // Total tickets
    try {
      const res = await $fetch("/api/tickets/ticket-filter", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { filter: "totalTickets" },
      });
      totalTicketCount.value = Array.isArray(res?.tickets)
        ? res.tickets.filter((ticket) => ticket.status === "active").length
        : 0;
    } catch (err) {
      console.error("Error fetching total tickets:", err);
    } finally {
      ticketsLoading.value = false;
    }

    // checking tickets status for cancelled tickets
    try {
      const res = await $fetch("/api/tickets/ticket-filter", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { filter: "cancelledTickets" },
      });
      cancelledTicketCount.value = Array.isArray(res?.tickets)
        ? res.tickets.filter((ticket) => ticket.status === "cancelled").length
        : 0;
    } catch (err) {
      console.error("Error fetching cancelled tickets:", err);
    } finally {
      cancelledLoading.value = false;
    }
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  const activeFilter = ref("all");

  const filteredTickets = computed(() => {
    const now = new Date();
    return tickets.value.filter((ticket) => {
      const date = new Date(ticket.createdAt);

      if (activeFilter.value === "today") {
        return date.toDateString() === now.toDateString();
      }
      if (activeFilter.value === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      }
      if (activeFilter.value === "month") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }
      return true; // "all"
    });
  });

  // tickets

  return {
    tickets,
    filterOptions,
    activeFilter,
    filteredTickets,
    totalTicketCount,
    cancelledTicketCount,
    totalTickets,
    totalCancelled,
    cancellationRate,
    cancelledTrend,
    ticketTrend,
    ticketChartData,
    ticketsLoading,
    cancelledLoading,
  };
}
