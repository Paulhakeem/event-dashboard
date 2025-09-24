export default function LoginAuth() {
  const user = ref(null);

  const setUser = (u, token) => {
    user.value = u;
    localStorage.setItem("token", token);
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("token");
    navigateTo("/login");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };
  return { setUser, user, logout, getToken };
}
