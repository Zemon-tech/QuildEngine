# Quild

An AI-powered learning platform for developers covering DSA, system design, interview prep, courses, and research.

## Actors

**Learner:**
The primary user who consumes content, solves problems, tracks progress, and participates in community.
_Avoid_: Student, user (too generic), member

**Admin:**
A privileged operator who creates/manages content and oversees platform operations via `apps/admin`.
_Avoid_: Moderator, superuser, staff

## Core Concepts

**BFF (Backend-for-Frontend):**
The `apps/web` layer running on Cloudflare Workers. Proxies requests to the API with token injection, aggregates responses, and handles SSR. Contains zero business logic.
_Avoid_: Frontend server, web server

**API:**
The `apps/api` Express backend. Owns all business logic, data access, and authorization. Serves both the BFF and the admin app.
_Avoid_: Backend (ambiguous — could refer to BFF), server

**Profile:**
Application-specific data about a Learner stored in the `profiles` table. Distinct from the Supabase Auth identity record.
_Avoid_: Account, user record

**Activity Event:**
An immutable log entry recording a meaningful action a Learner performed (problem solved, lesson completed). Source of truth for all stats.
_Avoid_: Action, log, interaction

**User Stats:**
Denormalized counters (problems solved, streak, hours learned) derived from Activity Events. Optimized for fast dashboard reads.
_Avoid_: Metrics, analytics

**Streak:**
Consecutive calendar days (in the Learner's timezone) with at least one qualifying Activity Event. Resets if a full day passes without one.
_Avoid_: Daily login count

**Feature Module:**
A self-contained folder under `src/modules/` owning a single domain concern (auth, profile, dashboard, dsa, etc.). Contains controller, service, types, and validation.
_Avoid_: Package, plugin, microservice

**Contracts:**
The `@quild/contracts` shared package containing API response types, Zod schemas, and enums used by both `apps/web` and `apps/api`.
_Avoid_: Shared types, common package
