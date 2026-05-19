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

  return {
    provide: {
      api,
    },
  };
});
