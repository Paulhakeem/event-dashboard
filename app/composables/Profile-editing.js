export const profileEditing = () => {
  const config = useRuntimeConfig();
  const firstName = ref("");
  const lastName = ref("");
  const loading = ref(false);

  const updateProfile = async () => {
    loading.value = true;
    try {
      const response = await $fetch(`${config.public.profileUpdateApi}`, {
        method: "POST",
        body: {
          firstName: firstName.value,
          lastName: lastName.value,
        },
      });

      if (response && response.message) {
        alert(response.message + "✅");
      } else {
        alert("Profile updated successfully✅");
      }
    } catch (error) {
      alert("Failed to update profile❌");
    } finally {
      loading.value = false;
    }
  };

  return {
    firstName,
    lastName,
    updateProfile,
    loading,
  };
};
