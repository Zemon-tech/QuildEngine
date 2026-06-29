import { getRequest } from "@tanstack/react-start/server";
import {
  type Role,
  type Permission,
  normalizeRole,
  ROLE_PERMISSIONS,
} from "@quild/contracts";

export interface AdminSession {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: Role;
    permissions: Permission[];
  } | null;
}

const AUTH_COOKIE_NAME = "sb-auth-token";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getSession(): AdminSession | null {
  const request = getRequest();
  if (!request) return null;

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c: string) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")] as const;
    }),
  );

  const rawToken = cookies[AUTH_COOKIE_NAME];
  if (!rawToken) return null;

  try {
    const decodedCookie = JSON.parse(decodeURIComponent(rawToken));
    const accessToken = decodedCookie.access_token ?? decodedCookie[0];
    const refreshToken = decodedCookie.refresh_token ?? decodedCookie[1];

    if (!accessToken) return null;

    const jwtPayload = decodeJwtPayload(accessToken);
    if (!jwtPayload || !jwtPayload.sub) return null;

    const rawRole = jwtPayload.app_metadata?.role || jwtPayload.user_metadata?.role || jwtPayload.raw_user_meta_data?.role;
    const role = normalizeRole(rawRole);
    const permissions = ROLE_PERMISSIONS[role] || [];

    return {
      accessToken,
      refreshToken,
      user: {
        id: jwtPayload.sub,
        email: jwtPayload.email || "",
        role,
        permissions,
      },
    };
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  const session = getSession();
  return session?.accessToken ?? null;
}
