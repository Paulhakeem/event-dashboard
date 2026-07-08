export default function useReport() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const totalRevenue = ref(0);
  const totalRefund = ref(0);
  const loading = ref(true);
  const revenueSeries = ref([]);
  const refundSeries = ref([]);

  const getMonthKey = (value) => {
    if (!value) return null;
    if (value.monthKey) return value.monthKey;

    const rawDate =
      value.date ||
      value.bookedAt ||
      value.cancelledAt ||
      value.updatedAt ||
      value.createdAt;
    if (!rawDate) return null;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return null;

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const getMonthLabel = (monthKey) => {
    if (!monthKey) return "Unknown";
    const [year, month] = monthKey.split("-");
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
      "en",
      {
        month: "short",
        year: "numeric",
      },
    );
  };

  const buildChartData = (revenueEntries, refundEntries) => {
    const monthKeys = new Set();

    revenueEntries.forEach((entry) => {
      const monthKey = getMonthKey(entry);
      if (monthKey) monthKeys.add(monthKey);
    });

    refundEntries.forEach((entry) => {
      const monthKey = getMonthKey(entry);
      if (monthKey) monthKeys.add(monthKey);
    });

    if (!monthKeys.size) {
      const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
      return [
        {
          monthKey: currentMonthKey,
          month: getMonthLabel(currentMonthKey),
          totalRevenue: totalRevenue.value,
          totalRefund: totalRefund.value,
        },
      ];
    }

    const sortedMonths = Array.from(monthKeys).sort();
    const start = new Date(`${sortedMonths[0]}-01`);
    const end = new Date(`${sortedMonths[sortedMonths.length - 1]}-01`);
    const chartData = [];
    let cursor = new Date(start);

    while (cursor <= end) {
      const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const revenueEntry = revenueEntries.find(
        (entry) => getMonthKey(entry) === monthKey,
      );
      const refundEntry = refundEntries.find(
        (entry) => getMonthKey(entry) === monthKey,
      );

      chartData.push({
        monthKey,
        month: getMonthLabel(monthKey),
        totalRevenue: Number(
          revenueEntry?.totalRevenue || revenueEntry?.amount || 0,
        ),
        totalRefund: Number(
          refundEntry?.totalRefund || refundEntry?.amount || 0,
        ),
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return chartData;
  };

  const chartData = computed(() =>
    buildChartData(revenueSeries.value, refundSeries.value),
  );

  const categories = {
    totalRevenue: { name: "Total Revenue", color: "#9c4e8b" },
    totalRefund: { name: "Total Refund", color: "#ef4444" },
  };

  const xFormatter = (tick) => chartData.value[tick]?.month ?? "";

  const totalRevenues = computed(() =>
    chartData.value.reduce((sum, item) => sum + item.totalRevenue, 0),
  );
  const totalRefunds = computed(() =>
    chartData.value.reduce((sum, item) => sum + item.totalRefund, 0),
  );
  const netTotal = computed(() => totalRevenues.value - totalRefunds.value);

  onMounted(async () => {
    loading.value = true;
    try {
      const res = await $fetch(config.public.totalAmountApi, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      if (res?.success) {
        totalRevenue.value = res.total || 0;
        revenueSeries.value = Array.isArray(res.monthlyBreakdown)
          ? res.monthlyBreakdown
          : [];
      }
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }

    try {
      const res = await $fetch("/api/tickets/ticket-filter", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { filter: "cancelledTickets" },
      });
      if (Array.isArray(res?.tickets)) {
        totalRefund.value = res.tickets.reduce(
          (sum, ticket) => sum + (ticket.amount || 0),
          0,
        );
        refundSeries.value = res.tickets
          .filter((ticket) => ticket.status === "cancelled")
          .map((ticket) => ({
            date: ticket.cancelledAt || ticket.updatedAt || ticket.createdAt,
            totalRefund: ticket.amount || 0,
          }));
      } else {
        totalRefund.value = 0;
        refundSeries.value = [];
      }
    } catch (err) {
      console.error("Error fetching cancelled tickets:", err);
    } finally {
      loading.value = false;
    }
  });

  return {
    totalRevenue,
    loading,
    totalRefund,
    chartData,
    categories,
    xFormatter,
    totalRevenues,
    totalRefunds,
    netTotal,
  };
}
