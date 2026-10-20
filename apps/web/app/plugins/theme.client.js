export default defineNuxtPlugin(() => {
  const { syncFromDocument, apply } = useTheme();

  syncFromDocument();

  if (!localStorage.getItem("happitwin-theme")) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", (event) => {
      apply(event.matches ? "dark" : "light", false);
      syncFromDocument();
    });
  }
});
