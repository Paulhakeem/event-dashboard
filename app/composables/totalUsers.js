export const totalUsers = () => {
  const { token } = useAuth();
  const users = ref([]);

  onMounted(async () => {
    try {
      const res = await $fetch("/api/users", {
        headers: {
          // send token
          Authorization: `Bearer ${token.value}`,
        },
      });
      users.value = res.users;
    } catch (error) {
      window.alert(err);
    }
  });
  return { users };
};
