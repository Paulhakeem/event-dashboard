// Restores the logged-in user after a hard reload.
//
// The auth_token cookie is httpOnly, so browser JS can never read it. Without
// this plugin the in-memory auth state (useState) is rebuilt only when the
// user logs in within the same SPA session - a refresh leaves `user` null,
// which blanks user?.email on the events page and blocks booking.
//
// During SSR this plugin reads the cookie via the server-side fetch (which
// forwards the incoming request headers), verifies it, and stores the session
// in state. The client picks it up from the Nuxt payload - no client-side
// token access is ever needed.
export default defineNuxtPlugin(async () => {
  const { setAuth } = useAuth();

  try {
    if (process.server) {
      const reqFetch = useRequestFetch();
      const session = await reqFetch("/api/auth/session");
      setAuth(
        session?.token && session?.user ? session : null,
      );
    }
  } catch (error) {
    console.error("Auth session hydration failed:", error);
  }
});