/**
 * Reusable middleware for TanStack Start server functions and route loaders.
 *
 * Middleware runs server-side and can:
 * - Read request headers / cookies
 * - Inject context (e.g. session, user) into downstream handlers
 * - Short-circuit with redirects or errors
 *
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/middleware
 */
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSession, type Session } from "./session.server";

/**
 * Auth middleware — reads the session from cookies and injects it into context.
 *
 * Usage in a server function:
 * ```ts
 * const myFn = createServerFn()
 *   .middleware([authMiddleware])
 *   .handler(async ({ context }) => {
 *     // context.session is available (or null if unauthenticated)
 *   });
 * ```
 *
 * This does NOT block unauthenticated requests — it only reads the session.
 * Use `protectedMiddleware` if you want to enforce authentication.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = getSession();

  return next({
    context: { session },
  });
});

/**
 * Protected middleware — requires a valid session.
 * If no session is found, throws a redirect to the login page.
 *
 * Usage in a server function:
 * ```ts
 * const myProtectedFn = createServerFn()
 *   .middleware([protectedMiddleware])
 *   .handler(async ({ context }) => {
 *     // context.session is guaranteed to be non-null here
 *   });
 * ```
 */
export const protectedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const session = getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return next({
      context: { session: session satisfies Session },
    });
  },
);
