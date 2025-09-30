export const useAuth = () => {
  const user = ref(null);
  const token = ref(null);
  if (!token.value && process.client) {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) token.value = savedToken;
    if (savedUser) user.value = JSON.parse(savedUser);
  }

  const setAuth = (data) => {
    token.value = data.token;
    user.value = data.user;

    if (process.client) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return { user, token, setAuth, logout };
};
