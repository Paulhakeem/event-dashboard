import { ref } from "vue";
import { useRuntimeConfig } from "#imports";
import { $fetch } from "ofetch";
import { useAuth } from "./useAuth.js";

export const profileEditing = () => {
  const config = useRuntimeConfig();
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const loading = ref(false);
  const { token } = useAuth();
  const updateProfile = async () => {
    loading.value = true;
    try {
      const body = {
        firstName: firstName.value,
        lastName: lastName.value,
      };
      if (email.value !== undefined && email.value !== "") {
        body.email = email.value;
      }
      const response = await $fetch(`${config.public.profileUpdateApi}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body,
      });

      if (response && response.message) {
        alert(response.message + "✅");
      } else {
        alert("Profile updated successfully✅");
      }
    } catch (error) {
      const message =
        error?.data?.message || error?.statusMessage || "Failed to update profile❌";
      alert(message);
    } finally {
      loading.value = false;
    }
  };

  return {
    firstName,
    lastName,
    email,
    updateProfile,
    loading,
  };
};
