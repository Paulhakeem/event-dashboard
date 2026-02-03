// logout user if token expire
import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware((to) => {
  const { token, logout } = useAuth();

  if (!token.value) {
    return navigateTo("/login");
  }
  try {
    const decoded = jwtDecode(token.value);
    const now = Date.now() / 1000; // current time in seconds

    if (decoded.exp && decoded.exp < now) {
      // Token expired → clear auth and redirect
      logout();
      return navigateTo("/login");
    }
  } catch (error) {
    // Invalid token format → force logout
    logout();
    return navigateTo("/login");
  }
});
