import UpcomingEvents from "~/components/User/UpcomingEvents.vue";
export const userDropdown = () => {
  const items = [
    { name: "Upcoming Events", component: UpcomingEvents },
    { name: "This Week" },
    { name: "All Upcoming Events" },
  ];

  const selectedItem = ref(items[0]);

  return { items, selectedItem };
};
