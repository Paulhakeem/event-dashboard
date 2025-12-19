export const useAdminMenu = () => {
  const profile = ref(false);

  const openProfile = () => {
    // Logic to open profile settings or dropdown
    profile.value = !profile.value;
    console.log('Profile menu toggled:', profile.value);
  };

  return {
    profile,
    openProfile,
  };
};
