export const useAuth = () => {
  const user = useState("user", () => null);
  const token = useState("token", () => null);

  const login = (userData, jwt) => {
    user.value = userData;
    token.value = jwt;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    (user.value = null), (token.value = null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  //   restore from localstorage on refresh
  if (process.client && !user.value && localStorage.getItem("useer")) {
    user.value = JSON.parse(localStorage.getItem("user"));
    token.value = localStorage.getItem("token");
  }

  return {
    user,
    token,
    login,
    logout,
  };
};
