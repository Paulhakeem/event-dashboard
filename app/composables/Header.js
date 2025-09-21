export default function useHeader() {
  const menu =ref( [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
  ])
  const openMenu = ref(false);

  const toggleMenu = () => {
    openMenu.value = !openMenu.value;
    
  };
  return { menu, toggleMenu, openMenu };
}
