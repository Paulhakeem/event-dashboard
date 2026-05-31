export default function useEventSearch() {
  const config = useRuntimeConfig();
  const search = ref("");
  const results = ref([]);
  const isLoading = ref(false);

  const searchEvents = async () => {
    if (!search.value.trim()) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.searchApi}`, {
        params: { q: search.value },
      });
      if (data) {
        results.value = data.events || [];
      } else {
        results.value = [];
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      results.value = [];
    }
    isLoading.value = false;
  };
  watch(search, () => {
    searchEvents();
  });

  return {
    search,
    results,
    isLoading,
    searchEvents,
  };
}
