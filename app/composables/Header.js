export default function useHeader() {
  const menu = ref([
    { name: "Home", path: "/", icon: "material-symbols:home-outline" },
    { name: "About", path: "/about", icon: "material-symbols:info-outline" },
    {
      name: "Events",
      path: "/eventPage",
      icon: "material-symbols:event-outline",
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: "material-symbols:contact-page-outline",
    },
  ]);
  const openMenu = ref(false);

  const toggleMenu = () => {
    openMenu.value = !openMenu.value;
  };
  return { menu, toggleMenu, openMenu };
}
