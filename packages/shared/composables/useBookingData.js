import { onMounted } from "vue";
import { useRuntimeConfig } from "#imports";
import { $fetch } from "ofetch";
import { useAuth } from "./useAuth.js";

export default function useBookingData() {
  const config = useRuntimeConfig();
  const { token, user } = useAuth();
  const booking = useState("user_booking_data", () => []);
  const loading = useState("user_booking_loading", () => true);
  const error = useState("user_booking_error", () => null);
  const cachedUserId = useState("user_booking_user_id", () => null);
  const loaded = useState("user_booking_loaded", () => false);
  const inFlight = useState("user_booking_in_flight", () => false);

  const fetchBookings = async ({ force = true } = {}) => {
    const userId = user.value?.id ? String(user.value.id) : null;
    if (cachedUserId.value !== userId) {
      cachedUserId.value = userId;
      booking.value = [];
      error.value = null;
      loaded.value = false;
    }

    if (!token.value) {
      loading.value = false;
      return;
    }

    if (inFlight.value || (!force && loaded.value)) return;

    const requestUserId = userId;
    loading.value = true;
    error.value = null;
    inFlight.value = true;
    try {
      const res = await $fetch(`${config.public.bookingData}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      if (cachedUserId.value === requestUserId) {
        booking.value = res.bookings || [];
        loaded.value = true;
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      if (cachedUserId.value === requestUserId) error.value = err;
    } finally {
      if (cachedUserId.value === requestUserId) {
        loading.value = false;
      }
      inFlight.value = false;
      if (cachedUserId.value !== requestUserId && token.value) {
        await fetchBookings({ force: false });
      }
    }
  };

  onMounted(() => fetchBookings({ force: false }));

  return {
    booking,
    loading,
    error,
    fetchBookings,
  };
}
