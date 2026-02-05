export default function useCreateAdmin() {
  const { token } = useAuth();
  // form fields
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");

  // state
  const isLoading = ref(false);
  const errorMessage = ref("");

  // email validation
  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };
  watch(email, () => {
    if (email.value && !validateEmail(email.value)) {
      errorMessage.value = "Invalid email format.";
    } else {
      errorMessage.value = "";
    }
  });

  // create admin
  const createAdmin = async () => {
    errorMessage.value = "";
    isLoading.value = true;
    if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !password.value
    ) {
      errorMessage.value = "All fields are required.";
      isLoading.value = false;
      return;
    }
    try {
      await $fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
        },
      });
      navigateTo({
        path: "/verifyEmail",
        query: { email: email.value },
      });
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      isLoading.value = false;
    } catch (error) {
      errorMessage.value =
        error?.data?.statusMessage || "Failed to create admin.";
      isLoading.value = false;
    }
  };
  return {
    firstName,
    lastName,
    email,
    password,
    isLoading,
    errorMessage,
    createAdmin,
  };
}
