export default defineNuxtRouteMiddleware((to, from) => {
  const role = process.client ? localStorage.getItem("role") : null;
  const token = process.client ? localStorage.getItem("token") : null;

// Protect admin routes
  if (to.path.startsWith("/admin") && role !== "admin") {
    return navigateTo("/login");
  }
  if ((to.path === "/login" || to.path === "/signup") && token) {
    if (role === "admin") {
      return navigateTo("/admin/dashboard");
    } else {
      return navigateTo("/user/dashboard");
    }
  }
});
