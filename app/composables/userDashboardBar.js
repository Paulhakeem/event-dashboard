import Home from "~/components/User/Home.vue";
import Profile from "~/components/User/Profile.vue";

export const userDashboardBar = () => {
  const userSidebarMenu = [
    { name: "Dashboard", icon: "material-symbols:home-outline-rounded", component: Home },
    { name: "Profile", icon: "material-symbols:person-outline-rounded", component: Profile },
  ];
    return { userSidebarMenu };
};