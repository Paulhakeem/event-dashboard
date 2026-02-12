export default function useOrganiserSidebar() {
  const sidebar = ref([
    { title: "Dashboard", icon: "material-symbols:dashboard-rounded", component: "OrganiserDashboard" },
    { title: "Create Events", icon: "mdi:event-add", component: "OrganiserCreateEvents" },
    { title: "Track Events", icon: "carbon:event", component: "OrganiserTrackEvents" },
    { title: "Notifications", icon: "tdesign:notification-filled", component: "OrganiserNotifications" },
    { title: "Insights", icon: "gg:insights", component: "OrganiserInsights" },
  ]);

  return {
    sidebar,
  };
}
