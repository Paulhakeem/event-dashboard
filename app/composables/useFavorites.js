import { computed, onMounted, ref } from "vue";

export default function useFavorites() {
  const { user, token } = useAuth();
  const favorites = ref([]);
  const loading = ref(false);
  const error = ref("");

  const favoriteIds = computed(
    () => new Set(favorites.value.map((event) => String(event._id))),
  );
  const isFavorite = (eventId) => favoriteIds.value.has(String(eventId));

  const fetchFavorites = async () => {
    if (!user.value || !token.value) return;
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/users/favorites", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      favorites.value = Array.isArray(response?.favorites)
        ? response.favorites
        : [];
    } catch (err) {
      error.value =
        err?.data?.message || err?.message || "Unable to load saved events.";
    } finally {
      loading.value = false;
    }
  };

  const toggleFavorite = async (eventId) => {
    if (!user.value || !token.value) {
      await navigateTo("/login");
      return;
    }
    if (user.value.role !== "user") return false;

    const response = await $fetch("/api/users/favorites", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { eventId },
    });
    favorites.value = Array.isArray(response?.favorites)
      ? response.favorites
      : favorites.value;
    return response?.saved;
  };

  onMounted(fetchFavorites);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    fetchFavorites,
    toggleFavorite,
  };
}
