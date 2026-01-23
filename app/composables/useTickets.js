import { ref, computed } from "vue";
export default function useTickets() {
  const { token } = useAuth();
  const tickets = ref([]);
  onMounted(async () => {
    const res = await $fetch("/api/users/userTickets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    tickets.value = res.tickets;
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
  return {
    tickets,
    filterOptions,
    activeFilter,
    filteredTickets
  };
}
