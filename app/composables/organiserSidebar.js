export default function useOrganiserSidebar() {
  const sidebar = ref([
    { title: "Dashboard", icon: "material-symbols:dashboard-rounded" },
    { title: "Create Events", icon: "mdi:event-add" },
    { title: "Track Events", icon: "carbon:event" },
    { title: "Notifications", icon: "tdesign:notification-filled" },
    { title: "Insights", icon: "gg:insights" },
  ]);

  return {
    sidebar,
  };
}
