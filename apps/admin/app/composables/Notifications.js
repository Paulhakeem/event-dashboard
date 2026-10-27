export default function useNotifications() {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const notifications = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const removeNotification = (index) => {
    notifications.value.splice(index, 1);
  };

  const getNotificationType = (notification) => {
    const title = (notification?.title || "").toLowerCase();
    const message = (notification?.message || "").toLowerCase();
    const metaType = notification?.meta?.type || "";

    if (metaType === "booking_created" || title.includes("booking") || message.includes("booked")) return "booking";
    if (title.includes("approved")) return "success";
    if (title.includes("rejected") || title.includes("cancelled")) return "error";
    if (title.includes("pending") || title.includes("new event pending")) return "warning";
    if (metaType === "new_event" || title.includes("new event available")) return "info";
    if (metaType === "event_cancelled") return "error";
    if (metaType === "booking_confirmed") return "success";
    return "info";
  };

  const borderColor = (type) => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "warning":
        return "border-amber-500";
      case "error":
        return "border-red-500";
      case "booking":
        return "border-blue-500";
      case "info":
        return "border-[#9d4e8a]";
      default:
        return "border-[#9d4e8a]";
    }
  };

  const iconBg = (type) => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-emerald-400 to-green-600";
      case "warning":
        return "bg-gradient-to-br from-amber-400 to-orange-500";
      case "error":
        return "bg-gradient-to-br from-rose-400 to-red-600";
      case "booking":
        return "bg-gradient-to-br from-blue-400 to-indigo-600";
      case "info":
        return "bg-gradient-to-br from-[#9d4e8a] to-[#7a3968]";
      default:
        return "bg-gradient-to-br from-[#9d4e8a] to-[#7a3968]";
    }
  };

  const bgGradient = (type) => {
    switch (type) {
      case "success":
        return "from-emerald-400";
      case "warning":
        return "from-amber-400";
      case "error":
        return "from-rose-400";
      case "booking":
        return "from-blue-400";
      case "info":
        return "from-[#9d4e8a]";
      default:
        return "from-[#9d4e8a]";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "material-symbols:check-circle-rounded";
      case "warning":
        return "material-symbols:pending-actions";
      case "error":
        return "material-symbols:cancel-rounded";
      case "booking":
        return "material-symbols:confirmation-number-rounded";
      case "info":
        return "material-symbols:notifications-active";
      default:
        return "material-symbols:notifications-active";
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return notifDate.toLocaleDateString();
  };

  onMounted(async () => {
    try {
      const res = await $fetch(`${config.public.notificationsApi}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      notifications.value = res.notifications || [];
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  // delete event
  const deleteNotification = async (id, index = -1) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await $fetch(`${config.public.deleteNotification}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const notificationIndex =
        index >= 0
          ? index
          : notifications.value.findIndex(
              (notification) => notification._id === id,
            );
      if (notificationIndex >= 0) removeNotification(notificationIndex);
    } catch (err) {
      error.value = err.message;
    }
  };

  const markAllRead = async () => {
    try {
      await $fetch("/api/notification/mark-all-read", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      notifications.value = [];
    } catch (err) {
      error.value = err.message;
    }
  };

  const deleteAll = async () => {
    if (!confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await $fetch("/api/notification/delete-all", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      notifications.value = [];
    } catch (err) {
      error.value = err.message;
    }
  };

  return {
    notifications,
    loading,
    error,
    removeNotification,
    borderColor,
    iconBg,
    bgGradient,
    getIcon,
    getNotificationType,
    formatTime,
    deleteNotification,
    markAllRead,
    deleteAll,
  };
}
