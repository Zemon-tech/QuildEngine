/**
 * Server functions for the Dashboard page.
 *
 * These run on the Cloudflare Worker and handle:
 * - Batching multiple backend calls into one response
 * - Injecting auth tokens from the session cookie
 * - Providing typed data to the route loader
 *
 * The route loader calls these, so data is ready during SSR.
 */
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../middleware";
// import { backendFetch, backendBatch } from "../api.server";

// ─── Types ─────────────────────────────────────────────────────────────────────
// These will eventually match your backend API responses.
// For now they mirror the mock data shape from use-dashboard.ts

export interface DashboardStats {
  coursesEnrolled: number;
  lessonsCompleted: number;
  hoursLearned: number;
  streakDays: number;
}

export interface LearningProgress {
  currentCourse: string;
  currentLesson: string;
  progressPercent: number;
  nextMilestone: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface DashboardData {
  stats: DashboardStats;
  progress: LearningProgress | null;
  events: UpcomingEvent[];
}

// ─── Server Function ───────────────────────────────────────────────────────────

/**
 * Fetches all dashboard data in a single server function call.
 * Batches 3 backend requests in parallel — the client only sees one round-trip.
 *
 * Used in the dashboard route loader:
 * ```ts
 * export const Route = createFileRoute("/_app/dashboard")({
 *   loader: () => fetchDashboardData(),
 *   component: Dashboard,
 * });
 * ```
 */
export const fetchDashboardData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: _ctx }): Promise<DashboardData> => {
    // _ctx.session is available from authMiddleware (may be null for unauthenticated)

    // TODO: Replace with real backend calls once your API is ready:
    // const [stats, progress, events] = await backendBatch(
    //   backendFetch<DashboardStats>("/api/dashboard/stats"),
    //   backendFetch<LearningProgress>("/api/dashboard/progress"),
    //   backendFetch<UpcomingEvent[]>("/api/dashboard/events"),
    // );

    // ─── Stub data (mirrors existing use-dashboard.ts mocks) ─────────────
    const stats: DashboardStats = {
      coursesEnrolled: 4,
      lessonsCompleted: 47,
      hoursLearned: 23,
      streakDays: 7,
    };

    const progress: LearningProgress = {
      currentCourse: "Data Structures & Algorithms",
      currentLesson: "Binary Trees — Traversal",
      progressPercent: 64,
      nextMilestone: "Complete Module 5",
    };

    const events: UpcomingEvent[] = [
      { id: "1", title: "System Design Webinar", date: "2026-06-25", type: "webinar" },
      { id: "2", title: "Frontend Hackathon", date: "2026-07-01", type: "hackathon" },
    ];

    return { stats, progress, events };
  });
