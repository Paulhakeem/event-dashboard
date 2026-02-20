export const orgNotifications = () => {
  const { token } = useAuth();
  const notifications = ref([]);
  const loading = ref(false);
  const errorMessage = ref("");
  const filterType = ref("all");

  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  );

  const lastUpdated = computed(() => {
    if (notifications.value.length === 0) return "Never";
    const latest = new Date(
      Math.max(...notifications.value.map((n) => new Date(n.createdAt))),
    );
    return formatTime(latest);
  });

  const filteredNotifications = computed(() => {
    if (filterType.value === "all") return notifications.value;
    if (filterType.value === "approved")
      return notifications.value.filter((n) => n.title.includes("Approved"));
    if (filterType.value === "submitted")
      return notifications.value.filter((n) => n.title.includes("Submitted"));
    if(filterType.value === "cancelled")
      return notifications.value.filter((n) => n.title.includes("Cancelled"));
    return notifications.value;
  });

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getIcon = (notif) => {
    if (notif.title.includes("Approved"))
      return "material-symbols:check-circle";
    if (notif.title.includes("Submitted")) return "material-symbols:send";
    if (notif.title.includes("Cancelled")) return "material-symbols:cancel";
    return "material-symbols:notifications-active";
  };

  const getIconBg = (notif) => {
    if (notif.title.includes("Approved")) return "bg-green-100";
    if (notif.title.includes("Submitted")) return "bg-blue-100";
    if(notif.title.includes("Cancelled")) return "bg-red-100";
    return "bg-purple-100";
  };

  const getIconColor = (notif) => {
    if (notif.title.includes("Approved")) return "text-green-600";
    if (notif.title.includes("Submitted")) return "text-blue-600";
    if(notif.title.includes("Cancelled")) return "text-red-600";
    return "text-purple-600";
  };

  const getTypeBadge = (notif) => {
    if (notif.title.includes("Approved")) return "bg-green-100 text-green-700";
    if (notif.title.includes("Submitted")) return "bg-blue-100 text-blue-700";
    if(notif.title.includes("Cancelled")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getTypeLabel = (notif) => {
    if (notif.title.includes("Approved")) return "approval";
    if (notif.title.includes("Submitted")) return "submission";
    if(notif.title.includes("Cancelled")) return "cancellation";
    return "notification";
  };

  const fetchNotifications = async () => {
    loading.value = true;
    errorMessage.value = "";
    try {
      const res = await $fetch("/api/organiser/notifications/receiveNot", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token._value}`,
        },
      });
      notifications.value = res.notifications || [];
    } catch (error) {
      errorMessage.value = error.message || "Failed to load notifications";
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (notif) => {
    if (notif.read) return;
    notif.read = true;
    // Optional: sync with backend
  };

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true));
  };

  const deleteNotification = (notifId) => {
    notifications.value = notifications.value.filter((n) => n._id !== notifId);
  };

  const retryLoad = () => {
    fetchNotifications();
  };

  onMounted(() => {
    fetchNotifications();
  });

  return {
    notifications,
    filteredNotifications,
    formatTime ,
    loading,
    errorMessage,
    filterType,
    unreadCount,
    lastUpdated,
    getIcon,
    getIconBg,
    getIconColor,
    getTypeBadge,
    getTypeLabel,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    retryLoad,
  };
};
