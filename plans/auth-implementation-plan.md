# Implementation Plan — Production-Ready Authentication Foundation

Implement the complete production-ready authentication foundation for Quild_Engine. This includes JWT role-based access control (RBAC), a premium login page, route guards, session persistence, token auto-refresh, and local JWT verification in the Express API backend.

## User Review Required

> [!IMPORTANT]
> - **Publishable vs Service Keys**: Frontend apps (`apps/web` and `apps/admin`) will only use the `SUPABASE_PUBLISHABLE_KEY` and client-side SDK. They will write credentials and tokens to an `sb-auth-token` cookie.
> - **JWT Roles**: User roles will be stored in the custom claim `app_metadata.role` within the Supabase JWT. We decode this token both on the client side (for routing/UI) and on the Express backend (for endpoint protection).
> - **Centralized Role-to-Permissions Matrix**: A shared `@quild/contracts` package will define the types and map permissions for each role so that client and server are always aligned.

## Open Questions

> [!NOTE]
> 1. Do we have access to an active Supabase project for testing, or should we set up a local mock for development verification?
> 2. For the right-side visual on the login card, should we use a dynamic CSS gradient or generate a high-quality placeholder image via the `generate_image` tool?

---

## Proposed Changes

### Shared Component & Types (`@quild/contracts`)

We will create a new shared workspace package `@quild/contracts` under `packages/contracts/` to manage all cross-project schemas, roles, and types.

#### [NEW] [package.json](file:///c:/Zemon/QuildEngine/packages/contracts/package.json)
- Define package `@quild/contracts` as a private module.
- Add `zod` as a dependency.

#### [NEW] [tsconfig.json](file:///c:/Zemon/QuildEngine/packages/contracts/tsconfig.json)
- Extend standard TS config.

#### [NEW] [src/index.ts](file:///c:/Zemon/QuildEngine/packages/contracts/src/index.ts)
- Define user roles: `super_admin`, `admin`, `moderator`, `mentor`, `instructor`, `researcher`, `content_manager`, `student`, `professional`, `guest`.
- Define permissions: `research.read`, `research.write`, `research.publish`, `course.read`, `course.write`, `course.publish`, `roadmap.read`, `roadmap.edit`, `practice.manage`, `events.manage`, `newsletter.manage`, `users.manage`, `admins.manage`, `analytics.view`, `settings.manage`.
- Define permissions map (`ROLE_PERMISSIONS`).
- Define helper `hasPermission(role: string, permission: string): boolean`.
- Define Zod schemas for user login.

---

### Backend API (`apps/api`)

Build local JWT verification, RBAC middleware, and the auth user controller.

#### [MODIFY] [package.json](file:///c:/Zemon/QuildEngine/apps/api/package.json)
- Add `@quild/contracts`, `@supabase/supabase-js`, and `jsonwebtoken` as dependencies.
- Add `@types/jsonwebtoken` to `devDependencies`.

#### [MODIFY] [env.ts](file:///c:/Zemon/QuildEngine/apps/api/src/config/env.ts)
- Add Zod validation schema for environment variables (`PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `JWT_SECRET`).

#### [NEW] [supabase.ts](file:///c:/Zemon/QuildEngine/apps/api/src/lib/supabase.ts)
- Create single admin instance using `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

#### [NEW] [auth.ts](file:///c:/Zemon/QuildEngine/apps/api/src/middleware/auth.ts)
- Extract Bearer token from `Authorization` header.
- Verify JWT using `jsonwebtoken` and `JWT_SECRET`.
- Extract `sub` (User ID), user email, and `app_metadata.role`, and attach to `req.user`.

#### [NEW] [require-role.ts](file:///c:/Zemon/QuildEngine/apps/api/src/middleware/require-role.ts)
- Express middleware to verify if the authenticated user has the necessary role or permission.

#### [NEW] [auth.controller.ts](file:///c:/Zemon/QuildEngine/apps/api/src/modules/auth/auth.controller.ts)
- Implement `GET /api/v1/auth/me` to return user profile and verified roles.

#### [MODIFY] [index.ts](file:///c:/Zemon/QuildEngine/apps/api/src/routes/v1/index.ts)
- Mount `/auth/me` protected routes.

---

### Web BFF & Frontend (`apps/web`)

Configure Supabase Auth client, build the premium login page, and setup route guards.

#### [MODIFY] [package.json](file:///c:/Zemon/QuildEngine/apps/web/package.json)
- Add `@supabase/supabase-js`, `@tanstack/react-form`, and `@quild/contracts` to dependencies.

#### [NEW] [supabase.ts](file:///c:/Zemon/QuildEngine/apps/web/src/auth/services/supabase.ts)
- Initialize browser-safe Supabase client using public `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.

#### [NEW] [AuthProvider.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/auth/providers/AuthProvider.tsx)
- Create central authentication React context.
- Manage auth state (user, role, permissions, loading, tokens).
- Attach auth state listener `supabase.auth.onAuthStateChange` to set/clear the `sb-auth-token` cookie for SSR and BFF.

#### [NEW] [useAuth.ts](file:///c:/Zemon/QuildEngine/apps/web/src/auth/hooks/useAuth.ts)
- Reusable hook to fetch the current session, user profile, role, and permission-checkers.

#### [NEW] [AuthGuard.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/auth/guards/AuthGuard.tsx)
- Define `<AuthGuard>`, `<RoleGuard>`, `<GuestGuard>`, and `<AuthLayout>` wrappers.

#### [NEW] [LoginForm.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/auth/components/LoginForm.tsx)
- Premium, desktop-first login interface matching the layout shown in the user's uploaded mock.
- Standard form inputs with validation (using `@tanstack/react-form` + `zod`).
- Keyboard accessibility, password visibility toggle, forgot password, remember me checkbox, loading states.

#### [NEW] [login.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/routes/_auth/login.tsx)
- Route for `/login`.

#### [NEW] [_auth.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/routes/_auth.tsx)
- Route layout wrapper for unauthenticated flows.

#### [MODIFY] [session.server.ts](file:///c:/Zemon/QuildEngine/apps/web/src/lib/session.server.ts)
- Decode and verify the `sb-auth-token` cookie.
- Implement server-side JWT validation and refresh token invocation if expired.

#### [MODIFY] [_app.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/routes/_app.tsx)
- Secure learner routes via TanStack Router's `beforeLoad` hook or wrap with `<AuthGuard>`.

---

### Admin App (`apps/admin`)

Mirror authentication flow, update route guards, and replace mock login screen.

#### [MODIFY] [package.json](file:///c:/Zemon/QuildEngine/apps/admin/package.json)
- Add `@supabase/supabase-js`, `@tanstack/react-form`, and `@quild/contracts` to dependencies.

#### [NEW] [supabase.ts](file:///c:/Zemon/QuildEngine/apps/admin/src/auth/services/supabase.ts)
- Create browser-safe Supabase client.

#### [NEW] [AuthProvider.tsx](file:///c:/Zemon/QuildEngine/apps/admin/src/auth/providers/AuthProvider.tsx)
- Create central authentication context for admin.

#### [MODIFY] [login.tsx](file:///c:/Zemon/QuildEngine/apps/admin/src/routes/_auth/login.tsx)
- Replace mock login submission with the production-ready `LoginForm` connected to Supabase Auth.

#### [MODIFY] [_admin.tsx](file:///c:/Zemon/QuildEngine/apps/admin/src/routes/_admin.tsx)
- Update route verification from checking mock cookies to utilizing JWT-verified role data.

---

## Verification Plan

### Automated Tests
- Run Express API tests: `npm run test` or direct vitest runs inside `apps/api`.
- Run frontend type checking: `npm run check-types`.

### Manual Verification
- Deploy local dev servers (`npm run dev`) and test login pages.
- Authenticate with varying roles and confirm that redirect paths are correct.
- Verify that accessing routes without permission leads to automatic redirection or a polished "Access Denied" page.
- Check cookie contents and verify they are successfully received and parsed by the BFF.
