export default function useEventSearch() {
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
      const { data } = await useFetch("/api/search/filter", {
        params: { q: search.value },
      });
      if (data) {
        console.log(data);
        results.value = data.value.events || [];
      } else {
        results.value = [];
        console.error(data.value.message);
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
