import { createServerFn } from "@tanstack/react-start";
import { getEnv } from "../env.server.js";
import { backendFetch } from "../api.server.js";
import { getSession, type Session } from "../session.server.js";
import type { User } from "@quild/contracts";

/**
 * Server function to safely return the public Supabase config to the client.
 */
export const getPublicConfigFn = createServerFn({ method: "GET" }).handler(async () => {
  const env = getEnv();
  return {
    supabaseUrl: env.SUPABASE_URL,
    supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY,
  };
});

/**
 * Server function to get the verified server session.
 */
export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Session | null> => {
    return getSession();
  }
);

interface AuthMeResponse {
  user: User;
  profile: any;
}

/**
 * Server function to fetch the current user's profile and roles from the backend API.
 * Leverages token injection on the BFF.
 */
export const getMeFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthMeResponse | null> => {
    try {
      return await backendFetch<AuthMeResponse>("/api/v1/auth/me");
    } catch (error) {
      return null;
    }
  },
);
