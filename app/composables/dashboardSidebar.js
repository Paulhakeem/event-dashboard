import Users from "@/components/Dashboard/Users.vue";
import Events from "@/components/Dashboard/Events.vue";
import Graph from "@/components/Dashboard/Graph.vue";
import Notifications from "@/components/Dashboard/Notifications.vue";
import Reports from "@/components/Dashboard/Reports.vue";

export const dashboardSidebar = () => {
  const sidebarMenu = [
    {
      name: "Dashboard",
      icon: "material-symbols:home-outline-rounded",
      component: Graph,
    },
    { name: "Users", icon: "majesticons:users", component: Users },
    { name: "Events", icon: "material-symbols:event", component: Events },
    {
      name: "Notifications",
      icon: "material-symbols:notifications",
      component: Notifications,
    },
    { name: "Reports", icon: "material-symbols:report", component: Reports },
  ];

  return { sidebarMenu };
};
