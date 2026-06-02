export default function getTotalTickets() {
  const { token } = useAuth();

  const W = 700;
  const H = 200;
  const PL = 8;
  const PR = 8;
  const PT = 14;
  const PB = 22;

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const MONTHS_FULL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();

  const loading = ref(true);
  const error = ref("");
  const rawTickets = ref([]);

  // Group into monthly buckets for current year
  const monthlyData = computed(() =>
    MONTHS.map((_, i) => {
      const bucket = rawTickets.value.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === i;
      });
      return {
        tickets: bucket.length,
        revenue: bucket.reduce((s, t) => s + (t.amount || 0), 0),
      };
    }),
  );

  const totalTickets = computed(() => rawTickets.value.length);
  const totalRevenue = computed(() =>
    rawTickets.value.reduce((s, t) => s + (t.amount || 0), 0),
  );
  const peakMonth = computed(() => {
    const idx = monthlyData.value.reduce(
      (mi, m, i, arr) => (m.tickets > arr[mi].tickets ? i : mi),
      0,
    );
    return monthlyData.value[idx]?.tickets > 0 ? MONTHS_FULL[idx] : "—";
  });

  // Chart geometry
  const maxT = computed(() =>
    Math.max(...monthlyData.value.map((m) => m.tickets), 1),
  );
  const maxR = computed(() =>
    Math.max(...monthlyData.value.map((m) => m.revenue), 1),
  );

  const xAt = (i) => PL + (i / 11) * (W - PL - PR);
  const yTicket = (v) => PT + (1 - v / maxT.value) * (H - PT - PB);
  const yRevenue = (v) => PT + (1 - v / maxR.value) * (H - PT - PB);

  const ticketPoints = computed(() =>
    monthlyData.value.map((m, i) => ({ x: xAt(i), y: yTicket(m.tickets) })),
  );
  const revenuePoints = computed(() =>
    monthlyData.value.map((m, i) => ({ x: xAt(i), y: yRevenue(m.revenue) })),
  );

  const linePath = (pts) =>
    pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const areaPath = (pts, yB) =>
    `${linePath(pts)} L${pts.at(-1).x},${yB} L${pts[0].x},${yB} Z`;

  const ticketLinePath = computed(() => linePath(ticketPoints.value));
  const revenueLinePath = computed(() => linePath(revenuePoints.value));
  const ticketAreaPath = computed(() => areaPath(ticketPoints.value, H - PB));
  const revenueAreaPath = computed(() => areaPath(revenuePoints.value, H - PB));

  const gridYs = computed(() =>
    [0.25, 0.5, 0.75].map((f) => PT + (1 - f) * (H - PT - PB)),
  );

  // Tooltip
  const chartWrap = ref(null);
  const tip = ref({ visible: false, x: 0, y: 0, idx: 0 });
  const showTip = (e, idx) => {
    const rect = chartWrap.value?.getBoundingClientRect();
    tip.value = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 70,
      idx,
    };
  };
  const hideTip = () => {
    tip.value.visible = false;
  };

  // Fetch
  const fetchData = async () => {
    loading.value = true;
    error.value = "";
    try {
      const res = await $fetch("/api/tickets/ticket-filter", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      rawTickets.value = res?.tickets || [];
    } catch (err) {
      error.value =
        err?.data?.message || err?.message || "Failed to load ticket data.";
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchData);

  return {
    loading,
    error,
    totalTickets,
    totalRevenue,
    peakMonth,
    ticketLinePath,
    revenueLinePath,
    ticketAreaPath,
    revenueAreaPath,
    gridYs,
    tip,
    showTip,
    hideTip,
    W,
    H,
    PL,
    PR,
    PT,
    PB,
    MONTHS,
    MONTHS_FULL,
    currentYear,
    monthlyData,
    fetchData,
    ticketPoints,
    revenuePoints,
  };
}
