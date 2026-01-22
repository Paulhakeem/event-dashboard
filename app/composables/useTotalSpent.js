export default function useBookingData() {
  const { token } = useAuth();
  const totalSpent = ref(0);

  onMounted(async () => {
    const res = await $fetch("/api/users/total-spent", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    console.log(res)
  });
  return {
    totalSpent,
  };
}
