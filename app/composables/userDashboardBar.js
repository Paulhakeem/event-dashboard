import Home from "~/components/User/Home.vue";
import Profile from "~/components/User/Profile.vue";
import Tickets from "~/components/User/Tickets.vue";
import UserEventsList from "~/components/User/UserEventsList.vue";
import Notifications from "~/components/Dashboard/Notifications.vue";
import SavedEvents from "~/components/User/SavedEvents.vue";

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
      name: "Notifications",
      icon: "material-symbols:notifications-outline-rounded",
      component: Notifications,
    },
    {
      name: "Saved Events",
      icon: "material-symbols:favorite-outline-rounded",
      component: SavedEvents,
    },
    {
      name: "Profile",
      icon: "material-symbols:person-outline-rounded",
      component: Profile,
    },
  ];
  return { userSidebarMenu };
};
