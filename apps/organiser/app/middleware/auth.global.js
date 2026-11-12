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
  const { user, token, logout, setAuth } = useAuth();

  if (process.client && token.value && isTokenExpired(token.value)) {
    logout();
    return navigateTo("/login");
  }

  // A session that is not an organiser (e.g. a cookie shared from the web app
  // on the same host) must never be treated as logged in here. Drop it from
  // client state and keep the user on the login page.
  if (user.value && user.value.role !== "organiser") {
    setAuth(null);
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
    return;
  }

  const publicPages = ["/login"];

  // Guest → only login page allowed
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login");
  }

  // Logged-in organisers land on their dashboard
  if (user.value && (to.path === "/login" || to.path === "/")) {
    return navigateTo(`/organiser/${user.value.id}`);
  }

  // Only organisers allowed in the organiser app
  if (to.path.startsWith("/organiser") && user.value?.role !== "organiser") {
    return navigateTo("/login");
  }
});
