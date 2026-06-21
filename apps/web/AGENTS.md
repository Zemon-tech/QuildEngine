# apps/web — BFF Layer Architecture

## Role

This app is **not** a traditional SPA. It is a **Backend-for-Frontend (BFF)** running on Cloudflare Workers via TanStack Start. It sits between the user's browser and the dedicated backend.

## Responsibilities

| This app handles | The dedicated backend handles |
|------------------|-------------------------------|
| Secure cookie/HttpOnly token reading & injection | Core business logic execution |
| UI-specific data aggregation (batching downstream calls) | Direct database management |
| Server-Side Rendering (SSR) data pre-fetching | Heavy compute (grading, test runners) |
| SEO meta injection for crawlers | Centralized auth & session generation |
| | Shared API endpoints (used by both web & admin) |

## Key Principle

**Never put business logic here.** This layer only proxies, aggregates, and renders. If a function makes a decision about data (validation rules, access control logic, scoring), it belongs in the backend.

## File Structure

```
src/lib/
├── env.server.ts           # Validated env vars (BACKEND_URL, SUPABASE_URL, SUPABASE_ANON_KEY)
├── session.server.ts       # Reads auth tokens from request cookies
├── api.server.ts           # backendFetch<T>() and backendBatch() — proxy with token injection
├── middleware.ts           # authMiddleware (optional) + protectedMiddleware (enforced)
└── server-fns/
    └── dashboard.ts        # Example: batches 3 backend calls into 1 server function
```

## Patterns

### Server Functions

Use `createServerFn` from `@tanstack/react-start` for any server-side work:

```ts
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../middleware";
import { backendFetch } from "../api.server";

export const fetchSomething = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return backendFetch<MyType>("/api/something");
  });
```

### Route Loaders (SSR)

Call server functions from route loaders so data arrives pre-rendered:

```ts
export const Route = createFileRoute("/_app/dashboard")({
  loader: () => fetchDashboardData(),
  component: Dashboard,
});
```

### Middleware

- `authMiddleware` — Reads session from cookies. Does NOT block. Use when you want session context but the page can work without auth.
- `protectedMiddleware` — Reads session and throws if missing. Use for pages that require login.

### Backend Proxy

Always use `backendFetch()` to call the dedicated backend:
- Automatically injects the user's auth token from cookies
- Normalizes errors into a typed `ApiError`
- Keeps tokens server-side (browser never sees them)

Use `backendBatch()` to parallelize multiple backend calls:

```ts
const [stats, progress] = await backendBatch(
  backendFetch<Stats>("/api/stats"),
  backendFetch<Progress>("/api/progress"),
);
```

## Environment

Env vars are defined in `wrangler.jsonc` under `vars` for local dev. In production, use `wrangler secret` or the Cloudflare dashboard.

Required vars (set in `wrangler.jsonc` `vars` for local dev):
- `BACKEND_URL` — Base URL of your dedicated backend
- `SUPABASE_URL` — Supabase project URL

Required secrets (set in `.dev.vars` locally, `wrangler secret` in production):
- `SUPABASE_PUBLISHABLE_KEY` — Format: `sb_publishable_...`. Replaces the legacy anon key. Low-privilege, safe for client-side use, respects RLS.
- `SUPABASE_SECRET_KEY` — Format: `sb_secret_...`. Replaces the legacy service_role key. Server-only, bypasses RLS. Used for JWT verification and admin operations.

Never commit secret keys to source control. Use a `.dev.vars` file (gitignored) for local development.

> **Note:** Supabase deprecated the legacy `anon` and `service_role` JWT keys in favor of the new publishable/secret key model. New projects use `sb_publishable_...` and `sb_secret_...` format keys which support rotation, revocation, and audit logging. See [Supabase API Key Migration Guide](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys).

## Auth Flow (when wired up)

1. User logs in via Supabase (client-side SDK or redirect)
2. Supabase sets an HttpOnly cookie with access + refresh tokens
3. On subsequent requests, `session.server.ts` reads the cookie
4. `api.server.ts` attaches the token when proxying to the backend
5. `protectedMiddleware` blocks unauthenticated access to protected routes

## Reference Skills

When working on routing, server functions, middleware, SSR, or deployment in this app, read the TanStack Start best practices skill for detailed rules and examples:

- **TanStack Start Best Practices**: `.agents/skills/tanstack-start-best-practices/SKILL.md`
  - Individual rules: `.agents/skills/tanstack-start-best-practices/rules/`
  - Consult when: creating server functions, adding middleware, configuring SSR/loaders, setting up auth guards, deploying to Cloudflare, or organizing server vs client code.

## Rules for AI Agents

- When adding new pages that need data: create a server function in `src/lib/server-fns/`, use `authMiddleware`, call `backendFetch`, and wire it into the route `loader`.
- When the page is public (no auth needed): use `backendFetch` with `{ public: true }` and skip middleware.
- Never import `.server.ts` files from client components — they run server-only.
- Never hardcode backend URLs — always use `getEnv().BACKEND_URL`.
- Never expose auth tokens to the client — the BFF handles injection invisibly.
- Keep server function files small and focused (one per page/feature).
- Use Zod (`zod/v4`) for any input validation on server functions that accept user input.
