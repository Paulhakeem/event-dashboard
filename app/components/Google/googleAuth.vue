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
const onGoogleSuccess = async (e) => {
  const { email, name, picture, sub } = e.claims;
  const user = $fetch("/api/auth/google", {
    method: "POST",
    body: { email, name, picture, googleId: sub },
  });

  // Save user to your app state/cookie/session
  console.log("Google user:", user);

  // Save user to state/cookie
  const authUser = useCookie("user");
  authUser.value = JSON.stringify(user);
  // Redirect based on role
  if (user.role === "admin") {
    navigateTo(`/admin/${user.id}`);
  } else if (user.role === "organiser") {
    navigateTo(`/organiser/${user.id}`);
  } else {
    navigateTo(`/user/${user.id}`);
  }
};

const onGoogleError = (error) => {
  console.error("Google login error:", error);
};
</script>
