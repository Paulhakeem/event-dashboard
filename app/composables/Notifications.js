export default function useNotifications() {
  const { token } = useAuth();

  const notifications = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const removeNotification = (index) => {
    notifications.value.splice(index, 1);
  };

  const borderColor = (type) => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "warning":
        return "border-yellow-400";
      case "error":
        return "border-red-500";
      default:
        return "border-[#9d4e8a]";
    }
  };

  const iconBg = (type) => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-green-400 to-green-600";
      case "warning":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600";
      case "error":
        return "bg-gradient-to-br from-red-400 to-red-600";
      default:
        return "bg-gradient-to-br from-[#9d4e8a] to-[#7a3968]";
    }
  };

  const bgGradient = (type) => {
    switch (type) {
      case "success":
        return "from-green-400";
      case "warning":
        return "from-yellow-400";
      case "error":
        return "from-red-400";
      default:
        return "from-[#9d4e8a]";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "material-symbols:check-circle";
      case "warning":
        return "material-symbols:warning";
      case "error":
        return "material-symbols:error";
      default:
        return "material-symbols:notifications";
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
      const res = await $fetch("/api/notification/notifications", {
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
  const deleteNotification = async (id, index) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await $fetch(`/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token._value}`,
        },
      });
      removeNotification(index);
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
    formatTime,
    deleteNotification
  };
}
