// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  const publicPages = ["/", "/events", "/about", "/login", "/signup"];

  // Guest → block private pages
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/");
  }

  // Logged-in user → block login/signup/home
  if (user.value && ["/login", "/signup", "/"].includes(to.path)) {
    return user.value.role === "admin"
      ? navigateTo("/admin/dashboard")
      : navigateTo("/user/dashboard");
  }

  // Protect admin routes
  if (to.path.startsWith("/admin") && user.value?.role !== "admin") {
    return navigateTo("/user/dashboard");
  }

  // Protect user routes
  if (to.path.startsWith("/user") && user.value?.role !== "user") {
    return navigateTo("/admin/dashboard");
  }
});
