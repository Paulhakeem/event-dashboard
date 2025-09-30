// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  // If no user, only allow home, login, signup, events, about
  const publicPages = ["/", "/about", "/events", "/login", "/signup"];

  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login"); // redirect to login
  }
});
