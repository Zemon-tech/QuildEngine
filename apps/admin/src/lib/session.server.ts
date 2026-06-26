/**
 * Session utilities for the admin BFF.
 * Reads the Supabase auth token from the incoming request cookies.
 * Mirrors apps/web/src/lib/session.server.ts exactly.
 */
import { getRequest } from "@tanstack/react-start/server";

export interface AdminSession {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
}

const AUTH_COOKIE_NAME = "sb-auth-token";

/**
 * Reads the admin session from request cookies.
 * Returns null if no valid session is present.
 */
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
    const decoded = JSON.parse(decodeURIComponent(rawToken));
    return {
      accessToken: decoded.access_token ?? decoded[0],
      refreshToken: decoded.refresh_token ?? decoded[1],
      user: decoded.user ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Gets just the access token for forwarding to the backend.
 */
export function getAccessToken(): string | null {
  const session = getSession();
  return session?.accessToken ?? null;
}
