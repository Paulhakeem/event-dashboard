import { jwtDecode } from "jwt-decode";

const isTokenExpired = (rawToken) => {
  if (!rawToken) return true;
  try {
    const decoded = jwtDecode(rawToken);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export default defineNuxtRouteMiddleware((to) => {
  const { user, token, logout } = useAuth();

  if (process.client && token.value && isTokenExpired(token.value)) {
    logout();
    return navigateTo("/login");
  }

  const publicPages = ["/login"];

  // Guest → only login page allowed
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login");
  }

  // Logged-in users → block login page
  if (user.value && to.path === "/login") {
    return navigateTo(`/admin/${user.value.id}`);
  }

  // Only admins allowed in admin app
  if (to.path.startsWith("/admin") && user.value?.role !== "admin") {
    return navigateTo("/login");
  }
});