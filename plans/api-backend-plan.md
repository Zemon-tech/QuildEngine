# API Backend Plan — `apps/api`

Backend for `@quild/web` and `@quild/admin`. Phase 1 covers auth, profile, and dashboard.

## Related Documents

- [CONTEXT.md](./CONTEXT.md) — Domain glossary and ubiquitous language
- [ADR-0001: Supabase JS Client over ORM](../docs/adr/0001-supabase-js-client-over-orm.md)
- [ADR-0002: Application-Layer Access Control, No RLS](../docs/adr/0002-application-layer-access-control-no-rls.md)

---

## Context

- **Monorepo:** Turborepo with `apps/web` (BFF on Cloudflare Workers), `apps/admin` (React SPA), `apps/api` (Express 5 backend).
- **BFF pattern:** `apps/web` proxies all backend calls via `backendFetch()` with token injection. The API never serves the browser directly — only the BFF and admin app call it.
- **Existing API skeleton:** Express 5, Pino logging, helmet, CORS, request IDs, error handler, `ApiError` class, typed response helpers (`sendSuccess`, `sendPaginated`, `sendError`). Single route: `GET /api/v1/health`.
- **Auth:** Supabase Auth. Users authenticate via Supabase client-side SDK. Supabase sets HttpOnly cookies. BFF reads token from cookie and forwards as `Authorization: Bearer <jwt>`.
- **Database:** Supabase Postgres accessed via `@supabase/supabase-js` with the secret key (`sb_secret_...`). Single admin client instance, no RLS — access control is in application code.
- **Schema management:** Raw SQL files stored in `apps/api/sql/`, applied manually against Supabase.
- **Roles:** Multiple roles supported: `learner` (default) for the public portal, and operator roles (`super_admin`, `admin`, `moderator`, `content_manager`) for the administrative portal. The role claim is securely resolved from the JWT payload by checking `app_metadata.role` with fallback to `user_metadata.role` (or `raw_user_meta_data.role`) to accommodate registration sync latency.
- **Shared package:** `@quild/contracts` — API response types, shared enums, shared Zod schemas. Used by both `apps/web` and `apps/api`.

---

## Constraints

- No business logic in the BFF (`apps/web`). All logic lives in the API.
- No ORM. Supabase JS client only.
- Supabase legacy keys deprecated — use `sb_secret_...` (new secret key format), not `service_role`.
- No RLS. Application-layer access control in services (filter by `user_id` explicitly).
- No Redis, no background jobs, no real-time, no rate limiting, no custom email in Phase 1.
- File uploads use S3 presigned URLs — API generates the URL, client uploads directly to S3. API never receives file bytes.
- All validation via Zod v4.
- Tests via Vitest. Unit tests for services (mock Supabase client). Integration tests for controllers (supertest).
- Deployment-agnostic. Must run as a standard Node.js process. Include a Dockerfile.
- API response shape is fixed:
  ```json
  { "data": T, "meta": { "timestamp": "..." } }
  { "data": T[], "pagination": {...}, "meta": {...} }
  { "error": { "code": "...", "message": "...", "details": [...] }, "meta": { "timestamp": "...", "requestId": "..." } }
  ```
- Learner routes: `/api/v1/...`
- Admin routes: `/api/v1/admin/...` (guarded by `requireRole("admin")`)
- Pagination: offset-based (`?page=1&limit=20`)
- Comments required on all modules, middleware, and service methods.

---

## Architecture

```
apps/api/src/
├── index.ts                    # Server entry
├── app.ts                      # Express app setup
├── config/
│   └── env.ts                  # Env vars (validated with Zod)
├── lib/
│   ├── logger.ts               # Pino logger
│   └── supabase.ts             # Supabase admin client singleton
├── middleware/
│   ├── request-id.ts           # X-Request-ID injection
│   ├── auth.ts                 # JWT verification, injects req.user
│   ├── require-role.ts         # Role guard middleware factory
│   ├── error-handler.ts        # Global error handler
│   └── not-found.ts            # 404 catch-all
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.types.ts
│   │   └── auth.validation.ts
│   ├── profile/
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   ├── profile.types.ts
│   │   └── profile.validation.ts
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   └── dashboard.types.ts
│   └── activity/
│       ├── activity.controller.ts
│       ├── activity.service.ts
│       ├── activity.types.ts
│       └── activity.validation.ts
├── routes/
│   └── v1/
│       ├── index.ts            # Mounts all v1 routes
│       └── admin.ts            # Mounts all admin routes (role-guarded)
├── utils/
│   ├── api-error.ts            # ApiError class (exists)
│   ├── api-response.ts         # Response helpers (exists)
│   └── pagination.ts           # Pagination param parsing & meta builder
├── sql/
│   ├── 001-profiles.sql
│   ├── 002-activity-events.sql
│   └── 003-user-stats.sql
└── tests/
    ├── setup.ts                # Vitest global setup
    ├── helpers/
    │   └── test-app.ts         # Creates test Express instance
    ├── unit/
    │   ├── auth.service.test.ts
    │   ├── profile.service.test.ts
    │   └── dashboard.service.test.ts
    └── integration/
        ├── auth.test.ts
        ├── profile.test.ts
        └── dashboard.test.ts
```

---

## SQL Schema (Phase 1)

### profiles

| Column               | Type        | Notes                                   |
| -------------------- | ----------- | --------------------------------------- |
| id                   | uuid        | PK, FK → auth.users.id                  |
| display_name         | text        | nullable                                |
| avatar_url           | text        | nullable                                |
| timezone             | text        | default 'UTC'                           |
| social_links         | jsonb       | `{ github?, linkedin?, behance?, ... }` |
| onboarding_completed | boolean     | default false                           |
| created_at           | timestamptz | default now()                           |
| updated_at           | timestamptz | default now()                           |

### activity_events

| Column      | Type        | Notes                                     |
| ----------- | ----------- | ----------------------------------------- |
| id          | uuid        | PK                                        |
| user_id     | uuid        | FK → profiles.id, indexed                 |
| event_type  | text        | e.g. `problem_solved`, `lesson_completed` |
| entity_id   | text        | nullable, reference to the entity         |
| entity_type | text        | nullable, e.g. `dsa_problem`, `lesson`    |
| metadata    | jsonb       | nullable, extra context                   |
| created_at  | timestamptz | default now(), indexed                    |

### user_stats

| Column             | Type        | Notes                        |
| ------------------ | ----------- | ---------------------------- |
| user_id            | uuid        | PK, FK → profiles.id         |
| problems_solved    | int         | default 0                    |
| lessons_completed  | int         | default 0                    |
| courses_enrolled   | int         | default 0                    |
| total_seconds      | int         | default 0                    |
| current_streak     | int         | default 0                    |
| longest_streak     | int         | default 0                    |
| last_activity_date | date        | nullable, in user's timezone |
| updated_at         | timestamptz | default now()                |

---

## TODOs

### Infrastructure

- [x] Update `apps/api/config/env.ts` — add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `JWT_SECRET` with Zod validation. Remove legacy key names.
- [x] Create `apps/api/src/lib/supabase.ts` — singleton admin client using `sb_secret_...` key.
- [x] Create `apps/api/src/middleware/auth.ts` — verify JWT locally using `jsonwebtoken` or `jose`, extract `user_id` and `role` (checking `app_metadata.role` with fallbacks for `user_metadata.role` and `raw_user_meta_data.role`) from claims, attach to `req.user`.
- [x] Create `apps/api/src/middleware/require-role.ts` — factory function `requireRole(...)` supporting multiple operator roles (`super_admin`, `admin`, `moderator`, `content_manager`).
- [ ] Create `apps/api/src/utils/pagination.ts` — parse `page`/`limit` from query, compute offset, build pagination meta from total count.
- [x] Add `@quild/contracts` package to `packages/contracts/` with shared types and Zod schemas.
- [ ] Add Dockerfile to `apps/api/`.
- [ ] Add Vitest config to `apps/api/`. Install vitest, supertest, @types/supertest.
- [ ] Create test helpers (mock Supabase client, test app factory).
- [ ] Update `apps/api/.env.example` with new env var names.

### Auth Module

- [x] `auth.controller.ts` — POST `/api/v1/auth/me` (returns current user from JWT, optional `auth.getUser()` for fresh data).
- [x] `auth.service.ts` — verify token, extract role fallback claims (app_metadata / user_metadata), get user from Supabase if needed, ensure profile exists (create on first login).
- [x] `auth.validation.ts` — Zod schemas for any auth-related request bodies.

### Profile Module

- [ ] `profile.controller.ts` — GET/PATCH `/api/v1/profile` (learner's own profile). GET/PATCH `/api/v1/admin/users/:id/profile` (admin access).
- [ ] `profile.service.ts` — get profile by user_id, update profile, handle social_links JSONB merge.
- [ ] `profile.validation.ts` — Zod schemas for profile update payload (display_name, avatar_url, timezone, social_links).

### Dashboard Module

- [ ] `dashboard.controller.ts` — GET `/api/v1/dashboard` (returns aggregated stats for the authenticated user).
- [ ] `dashboard.service.ts` — read from `user_stats` table, compute streak freshness, return dashboard data.

### Activity Module

- [ ] `activity.controller.ts` — POST `/api/v1/activity` (log an activity event).
- [ ] `activity.service.ts` — insert into `activity_events`, update denormalized counters in `user_stats`, recalculate streak.
- [ ] `activity.validation.ts` — Zod schema for activity event payload (event_type, entity_id, entity_type, metadata).

### SQL

- [ ] Write `sql/001-profiles.sql` — create `profiles` table with trigger to auto-create on `auth.users` insert.
- [ ] Write `sql/002-activity-events.sql` — create `activity_events` table with indexes.
- [ ] Write `sql/003-user-stats.sql` — create `user_stats` table with trigger to auto-create when profile is created.

### Contracts Package

- [x] `packages/contracts/src/index.ts` — Centralized model definitions (`User`, `Session`, `Profile`, `DashboardStats`, `PaginationParams`, and enums for `Role`, `Difficulty`, etc.).

---

## Acceptance Criteria

### Auth

- [ ] `GET /api/v1/auth/me` with valid JWT returns user profile and role.
- [ ] `GET /api/v1/auth/me` with expired/invalid JWT returns 401.
- [ ] First call auto-creates a profile row if one doesn't exist.
- [ ] Role is extracted from JWT claims, inspecting `app_metadata.role` with fallbacks for `user_metadata.role` and `raw_user_meta_data.role`.

### Profile

- [ ] `GET /api/v1/profile` returns the authenticated user's profile.
- [ ] `PATCH /api/v1/profile` updates allowed fields (display_name, avatar_url, timezone, social_links).
- [ ] `PATCH /api/v1/profile` rejects invalid timezone strings.
- [ ] `PATCH /api/v1/profile` merges social_links (doesn't overwrite unmentioned keys).
- [ ] `GET /api/v1/admin/users/:id/profile` returns any user's profile (admin only).
- [ ] Admin routes return 403 for non-admin JWTs.

### Dashboard

- [ ] `GET /api/v1/dashboard` returns stats from `user_stats` for the authenticated user.
- [ ] Response includes: `problems_solved`, `lessons_completed`, `courses_enrolled`, `total_seconds`, `current_streak`, `longest_streak`.
- [ ] If no stats row exists, returns zeros (not an error).

### Activity

- [ ] `POST /api/v1/activity` with valid payload inserts into `activity_events` and updates `user_stats` counters.
- [ ] Streak increments if `last_activity_date` is yesterday (in user's timezone).
- [ ] Streak resets to 1 if `last_activity_date` is before yesterday.
- [ ] Streak stays unchanged if `last_activity_date` is today.
- [ ] Invalid `event_type` returns 422 validation error.

### Infrastructure

- [ ] All endpoints return the standard response envelope (`data`/`error` + `meta`).
- [ ] Request IDs propagate through to error responses.
- [ ] Pino logs include request ID, method, path, status, and response time.
- [ ] Vitest unit tests pass for all service methods.
- [ ] Vitest integration tests pass for all endpoints (happy path + error cases).
- [ ] `docker build` succeeds and the container runs the API on the configured port.
- [ ] `@quild/contracts` builds and is importable from both `apps/web` and `apps/api`.
