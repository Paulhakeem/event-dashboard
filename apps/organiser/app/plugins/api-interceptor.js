import { $fetch as ofetch } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const { logout } = useAuth();

  const api = ofetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        logout();
      }
    },
  });

  if (process.client && typeof window !== "undefined") {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const requestUrl = typeof args[0] === "string" ? args[0] : args[0]?.url;
      const isApiRequest =
        typeof requestUrl === "string" &&
        (requestUrl.startsWith("/api/") ||
          requestUrl.includes(`${window.location.origin}/api/`));

      if (isApiRequest && response.status === 401) {
        logout();
      }

      return response;
    };
  }

  return {
    provide: {
      api,
    },
  };
});
