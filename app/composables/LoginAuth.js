export default function LoginAuth() {
  const email = ref("");
  const password = ref("");
  const role = ref("user");
  const errorMessage = ref("");
  const isLoading = ref(false);
  const token = ref(null);

  const login = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const { $router } = useNuxtApp();
      const res = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email: email.value, password: password.value },
      });
      token.value = res.token;
      role.value = res.role;

      localStorage.setItem("token", token.value);
      localStorage.setItem("role", role.value);

      // Redirect based on role
      if (response.data.user.role === "admin") {
        await $router.push("/admin/dashboard");
      } else {
        await $router.push("/user/dashboard");
      }
    } catch (error) {
      errorMessage.value =
        error.response?.data?.statusMessage ||
        "Login failed. Please try again.";
    }
    isLoading.value = false;
  };
  return {
    email,
    password,
    role,
    errorMessage,
    isLoading,
    login,
    token,
  };
}
