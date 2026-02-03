export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  // Define public routes
  const publicPages = ["/", "/events", "/about", "/login", "/signup","/verifyEmail"];

  // ✅ Guest users → block private pages
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login"); // redirect to login instead of home
  }

  // Logged-in users → block login/signup
  if (user.value && ["/login", "/signup"].includes(to.path)) {
    if (user.value.role === "admin") {
      return navigateTo(`/admin/${user.value.id}`); // admin dashboard
    } else if (user.value.role === "organiser") {
      return navigateTo(`/organiser/${user.value.id}`); // organiser dashboard
    } else {
      return navigateTo(`/user/${user.value.id}`); // normal user dashboard
    }
  }

  // Protect admin routes
  if (to.path.startsWith("/admin")) {
    if (!user.value || user.value.role !== "admin") {
      return navigateTo("/login"); // force re-authentication
    }
  }

  // Protect organiser routes
  if (to.path.startsWith("/organiser")) {
    if (!user.value || user.value.role !== "organiser") {
      return navigateTo("/login");
    }
  }

  // Protect user routes
  if (to.path.startsWith("/user")) {
    if (!user.value || user.value.role !== "user") {
      return navigateTo("/login");
    }
  }
});