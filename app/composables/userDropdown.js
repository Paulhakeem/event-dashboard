import UserUpcomingEv from ".././components/User/UpcomingEv.vue";
export const userDropdown = () => {
  const items = [
    { name: "Upcoming Events", component: UserUpcomingEv },
    { name: "This Week" },
    { name: "All Upcoming Events" },
  ];

  const selectedItem = ref(items[0]);

  return { items, selectedItem };
};
