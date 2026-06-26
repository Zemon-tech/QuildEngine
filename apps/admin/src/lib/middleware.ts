/**
 * Admin middleware for TanStack Start.
 *
 * Two middleware layers:
 * - authMiddleware: reads session, injects into context (non-blocking)
 * - adminMiddleware: blocks non-admin roles with a redirect to /login
 */

import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { type AdminSession, getSession } from "./session.server";

const ADMIN_ROLES = ["superadmin", "admin", "editor", "moderator"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * Auth middleware — reads the session from cookies and injects it into context.
 * Does NOT block unauthenticated requests.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = getSession();
  return next({ context: { session } });
});

/**
 * Admin middleware — requires a valid session AND an admin-level role.
 * Throws a redirect to /login for unauthenticated or unauthorized users.
 *
 * Usage in a server function:
 * ```ts
 * const myAdminFn = createServerFn()
 *   .middleware([adminMiddleware])
 *   .handler(async ({ context }) => {
 *     // context.session is guaranteed to be a valid admin session
 *   });
 * ```
 */
export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const session = context.session as AdminSession | null;

    if (!session || !session.user) {
      throw redirect({ to: "/login" });
    }

    if (!ADMIN_ROLES.includes(session.user.role as AdminRole)) {
      throw redirect({ to: "/login" });
    }

    return next({
      context: {
        session: session satisfies AdminSession,
      },
    });
  });
