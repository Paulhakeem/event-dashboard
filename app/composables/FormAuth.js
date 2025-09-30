export default function useFormAuth() {
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const isLoading = ref(false);
  const errorMessage = ref("");
  const role = ref("user" || "admin");
  const { setAuth } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // validate form fields
  watch([email, password], () => {
    if (email.value && !validateEmail(email.value)) {
      errorMessage.value = "Invalid email format.";
    } else {
      errorMessage.value = "";
    }
  });

  const signup = async () => {
    isLoading.value = true;
    if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !password.value
    ) {
      errorMessage.value = "All fields are required.";
      return;
    }

    try {
      const res = await fetch("/api/auth/regester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          role: role.value,
        }),
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to sign up");

      // save token
      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuth(data);
      }
      // check if user is admin
      if (role.value === "admin" && res.ok) {
        navigateTo("/admin/dashboard");
      } else {
        navigateTo("/user/dashboard");
      }

      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      isLoading.value = false;
      return data;
    } catch (error) {
      errorMessage.value = error.message;
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    isLoading,
    errorMessage,
    validateEmail,
    role,
    signup,
  };
}
