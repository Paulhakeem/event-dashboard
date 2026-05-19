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

  // Restore from localStorage (client only)
  if (process.client && !token.value) {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedToken !== "undefined") {
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        token.value = savedToken;
      }
    }

    if (savedUser && savedUser !== "undefined") {
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        console.error("Invalid user JSON in localStorage", e);
        user.value = null;
      }
    }

    // Schedule logout when token expires
    if (token.value) {
      scheduleLogoutOnExpiry(token.value, () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigateTo("/");
      });
    }
  }

  const setAuth = (data) => {
    token.value = data.token;
    user.value = data.user;

    if (process.client) {
      localStorage.setItem("token", data.token ?? "");
      localStorage.setItem("user", JSON.stringify(data.user ?? {}));
      // Reschedule logout timer with new token
      scheduleLogoutOnExpiry(data.token, () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigateTo("/");
      });
    }
  };

  const logout = () => {
    clearLogoutTimer();
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
