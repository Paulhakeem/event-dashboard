export default function useHeader() {
  const menu =ref( [
    { name: "Home", path: "/" },
    { name: "About", path: "/" },
    { name: "Events", path: "/" },
  ])
  const openMenu = ref(false);

  const toggleMenu = () => {
    openMenu.value = !openMenu.value;
    
  };
  return { menu, toggleMenu, openMenu };
}
