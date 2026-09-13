<template>
  <ClientOnly>
    <GoogleLoginButton
      :verify-on-server="false"
      @success="onGoogleSuccess"
      @error="onGoogleError"
    />
  </ClientOnly>
</template>

<script setup>
const { setAuth } = useAuth();

const onGoogleSuccess = async (e) => {
  const credential = e.credential;
  if (!credential) {
    alert("Google login failed: missing credential");
    return;
  }

  const data = await $fetch("/api/auth/google", {
    method: "POST",
    body: { credential },
  });

  if (!data?.success) return;

  setAuth(data);

  if (data.user.role === "admin") {
    navigateTo(`/admin/${data.user.id}`);
  } else if (data.user.role === "organiser") {
    navigateTo(`/organiser/${data.user.id}`);
  } else {
    navigateTo(`/user/${data.user.id}`);
  }
};

const onGoogleError = (error) => {
  // error popup
  alert("Google login failed: " + error.message);
};
</script>
