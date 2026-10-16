export default function useEventFunctions() {
  const config = useRuntimeConfig();
  const eventPosters = ref([]);

  const pendings = ref(true);

  const errorMessage = ref("");

  const total = ref(0);
  const limit = 10;
  const skip = ref(0);
  const loadingMore = ref(false);

  const fetchEvents = async (append = false) => {
    if (append) {
      loadingMore.value = true;
    } else {
      pendings.value = true;
      eventPosters.value = [];
      skip.value = 0;
    }
    errorMessage.value = "";
    try {
      const res = await $fetch(`${config.public.totalEventsApi}`, {
        query: { limit, skip: append ? eventPosters.value.length : 0 },
      });
      if (res.success) {
        if (append) {
          eventPosters.value = [...eventPosters.value, ...(res.events || [])];
        } else {
          eventPosters.value = res.events || [];
        }
        total.value = res.total || eventPosters.value.length;
      } else {
        errorMessage.value = res.message || "Failed to load events";
      }
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      pendings.value = false;
      loadingMore.value = false;
    }
  };

  const loadMore = async () => {
    await fetchEvents(true);
  };

  return { eventPosters, pendings, errorMessage, fetchEvents, loadMore, total, loadingMore };
}
