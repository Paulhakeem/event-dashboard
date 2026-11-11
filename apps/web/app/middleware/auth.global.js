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
  const config = useRuntimeConfig();

  const organiserAppUrl =
    config.public.organiserAppUrl || "http://localhost:3007";
  const organiserDashboard = (id) => `${organiserAppUrl}/organiser/${id}`;

  if (process.client && token.value && isTokenExpired(token.value)) {
    logout();
    return navigateTo("/login");
  }

  const publicPages = [
    "/",
    "/events",
    "/eventPage",
    "/about",
    "/contacts",
    "/login",
    "/signup",
    "/verifyEmail",
  ];

  const isPublicPage =
    publicPages.includes(to.path) || to.path.startsWith("/events/");

  // Guest → block private pages
  if (!user.value && !isPublicPage) {
    return navigateTo("/login");
  }

  // Logged-in users → block login/signup
  if (user.value && ["/login", "/signup"].includes(to.path)) {
    if (user.value.role === "organiser") {
      return navigateTo(organiserDashboard(user.value.id), { external: true });
    }
    return navigateTo(`/user/${user.value.id}`);
  }

  // Organisers are served by the dedicated organiser app
  if (user.value?.role === "organiser" && !isPublicPage) {
    return navigateTo(organiserDashboard(user.value.id), { external: true });
  }

  // Role protection
  if (to.path.startsWith("/user") && user.value?.role !== "user") {
    return navigateTo("/login");
  }
});
