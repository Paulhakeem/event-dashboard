import { ref, watch } from "vue";

export default function useFormAuth() {
  const { setAuth } = useAuth();

  // form fields
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const role = ref("user");

  // state
  const isLoading = ref(false);
  const errorMessage = ref("");

  // image
  const previewImage = ref(null); // for UI preview
  const imageFile = ref(null); // actual File object

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

  // handle image selection
  const previewImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    imageFile.value = file;

    previewImage.value = URL.createObjectURL(file);
  };

  // signup
  const signup = async () => {
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
      const formData = new FormData();
      formData.append("firstName", firstName.value);
      formData.append("lastName", lastName.value);
      formData.append("email", email.value);
      formData.append("password", password.value);
      formData.append("role", role.value);

      if (imageFile.value) {
        formData.append("profileImage", imageFile.value);
      }

      const res = await fetch("/api/auth/regester", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // ✅ DO NOT set token here
      // ✅ Just go to verify email page
      navigateTo({
        path: "/verifyEmail",
        query: { email: email.value },
      });
    } catch (err) {
      errorMessage.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    role,
    previewImage,
    isLoading,
    errorMessage,
    previewImageFile,
    signup,
  };
}
