export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  // Define public routes
  const publicPages = ["/", "/events", "/about", "/login", "/signup"];

  // ✅ Guest users → block private pages
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login"); // redirect to login instead of home
  }

  // Logged-in users → block login/signup
  if (user.value && ["/login", "/signup"].includes(to.path)) {
    return user.value.role === "admin"
      ? navigateTo("/admin/dashboard")
      : navigateTo("/user/dashboard");
  }

  // Protect admin routes
  if (to.path.startsWith("/admin")) {
    if (!user.value || user.value.role !== "admin") {
      return navigateTo("/login"); // force re-authentication
    }
  }

  // Protect user routes
  if (to.path.startsWith("/user")) {
    if (!user.value || user.value.role !== "user") {
      return navigateTo("/login");
    }
  }
});