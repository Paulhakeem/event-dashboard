export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  const publicPages = [
    "/",
    "/events",
    "/about",
    "/login",
    "/signup",
    "/verifyEmail",
  ];

  // Guest → block private pages
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login");
  }

  // Logged-in users → block login/signup
  if (user.value && ["/login", "/signup"].includes(to.path)) {
    return navigateTo(
      user.value.role === "admin"
        ? `/admin/${user.value.id}`
        : user.value.role === "organiser"
        ? `/organiser/${user.value.id}`
        : `/user/${user.value.id}`
    );
  }

  // Role protection
  if (to.path.startsWith("/admin") && user.value?.role !== "admin") {
    return navigateTo("/login");
  }

  if (to.path.startsWith("/organiser") && user.value?.role !== "organiser") {
    return navigateTo("/login");
  }

  if (to.path.startsWith("/user") && user.value?.role !== "user") {
    return navigateTo("/login");
  }
});
