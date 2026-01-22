export default function useBookingData(){
  const { token } = useAuth();
  const booking = ref([]);
  onMounted(async () => {
    const res = await $fetch("/api/users/userInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    booking.value = res.bookings;
    console.log(res.bookings)
  });

  return {
    booking,
  };
};
