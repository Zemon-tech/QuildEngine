/**
 * Server-side environment configuration.
 *
 * On Cloudflare Workers, env vars are injected by the runtime.
 * During local dev (with wrangler), they come from wrangler.jsonc [vars] or .dev.vars.
 *
 * We use a lazy-validated getter so that:
 * - Module-level imports don't crash during build/SSR bootstrapping
 * - Validation runs once on first access, then caches the result
 * - Missing vars fail loudly at runtime with clear messages
 */
import { z } from "zod/v4";

const envSchema = z.object({
  /**
   * Base URL of your dedicated backend API.
   * e.g. "http://localhost:8787" in dev, "https://api.quild.dev" in production.
   */
  BACKEND_URL: z.url(),

  /**
   * Supabase project URL for auth integration.
   * e.g. "https://<project-ref>.supabase.co"
   */
  SUPABASE_URL: z.url(),

  /**
   * Supabase publishable key (format: sb_publishable_...).
   * Replaces the legacy anon key. Safe for client-side use — identifies your app
   * with low-privilege access, respects Row Level Security.
   *
   * @see https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
   */
  SUPABASE_PUBLISHABLE_KEY: z.string().startsWith("sb_publishable_"),

  /**
   * Supabase secret key (format: sb_secret_...).
   * Replaces the legacy service_role key. Server-only — bypasses RLS.
   * Used for admin operations like verifying JWTs or managing users.
   * Keep this in .dev.vars locally, never commit to source control.
   *
   * @see https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
   */
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Returns validated environment variables.
 *
 * Call this inside server functions / loaders — not at module top-level.
 *
 * On Cloudflare Workers, env is accessed via the global `process.env` proxy
 * that the @cloudflare/vite-plugin injects during SSR. For direct binding
 * access (KV, R2, etc.), use `import { env } from "cloudflare:workers"` once
 * you install @cloudflare/workers-types.
 */
export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  cachedEnv = envSchema.parse({
    BACKEND_URL: process.env.BACKEND_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  });

  return cachedEnv;
}
