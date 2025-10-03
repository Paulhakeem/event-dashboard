export const useAuth = () => {
  const user = useState("auth_user", () => null);
  const token = useState("auth_token", () => null);

  // Restore from localStorage (client only)
  if (process.client && !token.value) {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedToken !== "undefined") {
      token.value = savedToken;
    }

    if (savedUser && savedUser !== "undefined") {
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        console.error("Invalid user JSON in localStorage", e);
        user.value = null;
      }
    }
  }

  const setAuth = (data) => {
    token.value = data.token;
    user.value = data.user;

    if (process.client) {
      localStorage.setItem("token", data.token ?? "");
      localStorage.setItem("user", JSON.stringify(data.user ?? {}));
    }
  };
  const logout = () => {
    token.value = null;
    user.value = null;
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigateTo("/");
  };

  return { user, token, setAuth, logout };
};
