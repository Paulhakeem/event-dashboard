import { deleteCookie, getCookie, setCookie } from "h3";

const AUTH_COOKIE_NAME = "auth_token";

export function getAuthToken(event) {
  const authHeader = event.node.req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return getCookie(event, AUTH_COOKIE_NAME);
}

export function setAuthCookie(event, token, config) {
  const isSecure =
    config?.appUrl?.startsWith("https://") ||
    process.env.NODE_ENV === "production";

  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export function clearAuthCookie(event) {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: "/",
  });
}
