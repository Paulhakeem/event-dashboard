export default function useBookingData(){
  const { token } = useAuth();
  const booking = ref([]);
  onMounted(async () => {
    const res = await $fetch("/api/users/userEvents", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    booking.value = res.bookings;
  });

  return {
    booking,
  };
};
