const STORAGE_KEY = "happitwin-theme";

export function useTheme() {
  const theme = useState("theme", () => "light");

  const isDark = computed(() => theme.value === "dark");

  const apply = (value, persist = true) => {
    if (import.meta.server) return;
    document.documentElement.classList.toggle("dark", value === "dark");
    if (persist) {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const setTheme = (value) => {
    const next = value === "dark" ? "dark" : "light";
    theme.value = next;
    apply(next);
  };

  const toggleTheme = () => setTheme(isDark.value ? "light" : "dark");

  const syncFromDocument = () => {
    theme.value = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  };

  return { theme, isDark, setTheme, toggleTheme, apply, syncFromDocument };
}
