/**
 * Overview server functions — batches stats for the admin dashboard.
 */
import { createServerFn } from "@tanstack/react-start";
import { backendBatch, backendFetch } from "../api.server";
import { adminMiddleware } from "../middleware";

export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalProblems: number;
  upcomingEvents: number;
  newsletterSubscribers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type:
    | "user_signup"
    | "course_published"
    | "problem_created"
    | "event_created";
  description: string;
  timestamp: string;
  actor?: string;
}

export const fetchOverviewStats = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const [users, courses, events] = await backendBatch(
      backendFetch<{ total: number; active: number }>(
        "/api/v1/admin/stats/users",
      ),
      backendFetch<{ total: number; published: number; problems: number }>(
        "/api/v1/admin/stats/courses",
      ),
      backendFetch<{ upcoming: number }>("/api/v1/admin/stats/events"),
    );

    return {
      totalUsers: users.total,
      activeUsers: users.active,
      totalCourses: courses.total,
      publishedCourses: courses.published,
      totalProblems: courses.problems,
      upcomingEvents: events.upcoming,
      newsletterSubscribers: 0,
      recentActivity: [],
    } satisfies OverviewStats;
  });
