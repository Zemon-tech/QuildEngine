import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

/**
 * Singleton Supabase admin client.
 * Uses the secret key (sb_secret_...) to bypass RLS policies and manage application operations.
 * Session persistence is disabled since this is a stateless Node.js server.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
