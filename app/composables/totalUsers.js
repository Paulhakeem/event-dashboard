export const totalUsers = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth();
  const users = ref([]);

  onMounted(async () => {
    try {
      const res = await $fetch(`${config.public.usersApi}`, {
        headers: {
          // send token
          Authorization: `Bearer ${token.value}`,
        },
      });
      users.value = res.users;
    } catch (error) {
      window.alert(error.message);
    }
  });
  return { users };
};
