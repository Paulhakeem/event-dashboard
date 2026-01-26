import Home from "~/components/User/Home.vue";
import Profile from "~/components/User/Profile.vue";
import Tickets from "~/components/User/Tickets.vue";
import UserEventsList from "~/components/User/UserEventsList.vue";

export const userDashboardBar = () => {
  const userSidebarMenu = [
    {
      name: "Dashboard",
      icon: "material-symbols:home-outline-rounded",
      component: Home,
    },
    {
      name: "Events",
      icon: "material-symbols:event-note-outline",
      component: UserEventsList,
    },
    {
      name: "Tickets",
      icon: "icon-park-solid:tickets-one",
      component: Tickets,
    },
    {
      name: "Profile",
      icon: "material-symbols:person-outline-rounded",
      component: Profile,
    },
  ];
  return { userSidebarMenu };
};
