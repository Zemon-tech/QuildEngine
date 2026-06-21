/**
 * Session utilities for reading/verifying auth state from the incoming request.
 *
 * Your dedicated backend (Supabase) issues auth tokens. The web BFF:
 * 1. Reads the token from cookies on the incoming request
 * 2. Optionally verifies it server-side
 * 3. Passes it downstream when proxying to your backend
 *
 * This module is a placeholder — fill in once Supabase auth is integrated.
 */
import { getRequest } from "@tanstack/react-start/server";

export interface Session {
  /** Supabase access token (JWT) */
  accessToken: string;
  /** Supabase refresh token */
  refreshToken?: string;
  /** Decoded user info (minimal, from JWT) */
  user: {
    id: string;
    email: string;
  } | null;
}

/**
 * Cookie name where Supabase stores the auth tokens.
 * Supabase JS client uses `sb-<project-ref>-auth-token` by default.
 * Adjust if you customize the cookie name.
 */
const AUTH_COOKIE_NAME = "sb-auth-token";

/**
 * Reads the session from the incoming request cookies.
 * Returns null if no valid session cookie is found.
 *
 * TODO: Once Supabase auth is wired up:
 * - Parse the cookie value (JSON with access_token + refresh_token)
 * - Optionally verify the JWT signature with SUPABASE_JWT_SECRET
 * - Handle token refresh if expired
 */
export function getSession(): Session | null {
  const request = getRequest();
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) return null;

  // Parse cookies manually (Cloudflare Workers don't have a cookie jar API)
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c: string) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")] as const;
    }),
  );

  const rawToken = cookies[AUTH_COOKIE_NAME];
  if (!rawToken) return null;

  try {
    // Supabase stores tokens as a JSON array: [access_token, refresh_token, ...]
    // or as a base64-encoded JSON object depending on the client version.
    // This is a simplified placeholder — adjust to your actual cookie format.
    const decoded = JSON.parse(decodeURIComponent(rawToken));

    return {
      accessToken: decoded.access_token ?? decoded[0],
      refreshToken: decoded.refresh_token ?? decoded[1],
      user: null, // Will be populated after JWT decode
    };
  } catch {
    return null;
  }
}

/**
 * Gets just the access token for forwarding to the backend.
 * Returns null if not authenticated.
 */
export function getAccessToken(): string | null {
  const session = getSession();
  return session?.accessToken ?? null;
}
