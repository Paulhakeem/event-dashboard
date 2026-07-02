import { jwtDecode } from "jwt-decode";

let _logoutTimer = null;

const clearLogoutTimer = () => {
  if (_logoutTimer) {
    clearTimeout(_logoutTimer);
    _logoutTimer = null;
  }
};

const isTokenExpired = (rawToken) => {
  if (!rawToken) return true;
  try {
    const decoded = jwtDecode(rawToken);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const scheduleLogoutOnExpiry = (rawToken, logoutFn) => {
  clearLogoutTimer();
  if (!rawToken) return;
  try {
    const decoded = jwtDecode(rawToken);
    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logoutFn();
      return;
    }
    _logoutTimer = setTimeout(logoutFn, msUntilExpiry);
  } catch {
    logoutFn();
  }
};

export const useAuth = () => {
  const user = useState("auth_user", () => null);
  const token = useState("auth_token", () => null);

  const setAuth = (data) => {
    token.value = data?.token ?? null;
    user.value = data?.user ?? null;

    if (process.client && data?.token) {
      scheduleLogoutOnExpiry(data.token, () => {
        token.value = null;
        user.value = null;
        navigateTo("/");
      });
    }
  };

  const logout = () => {
    clearLogoutTimer();
    token.value = null;
    user.value = null;
    navigateTo("/login");
  };

  return { user, token, setAuth, logout };
};
