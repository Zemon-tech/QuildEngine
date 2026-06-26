import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Code2,
  Plus,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "#/components/admin/page-header";
import { StatCard } from "#/components/admin/stat-card";
import { Button } from "#/components/ui/button";
import { StatusBadge } from "#/components/admin/status-badge";
import { fetchOverviewStats } from "#/lib/server-fns/overview.functions";

export const Route = createFileRoute("/_admin/overview/")({
  loader: async () => {
    // In production this will batch 3 backend calls via backendBatch
    // For now, return mock data while backend is being wired up
    return {
      stats: {
        totalUsers: 2847,
        activeUsers: 1203,
        totalCourses: 42,
        publishedCourses: 38,
        totalProblems: 614,
        upcomingEvents: 5,
        newsletterSubscribers: 8921,
      },
      recentActivity: [
        { id: "1", type: "user_signup", description: "New user registered: sarah@example.com", timestamp: "2m ago" },
        { id: "2", type: "course_published", description: "Course 'Advanced DSA' published", timestamp: "14m ago" },
        { id: "3", type: "problem_created", description: "Problem 'Graph Traversal BFS' created", timestamp: "1h ago" },
        { id: "4", type: "user_signup", description: "New user registered: james@example.com", timestamp: "2h ago" },
        { id: "5", type: "event_created", description: "Event 'Live Mock Interview' scheduled", timestamp: "3h ago" },
      ],
    };
  },
  component: OverviewPage,
});

const QUICK_ACTIONS = [
  { label: "Add User", to: "/users", icon: Users, description: "Invite or create a new user" },
  { label: "New Course", to: "/courses/new", icon: BookOpen, description: "Create a new learning course" },
  { label: "New Problem", to: "/practice/dsa", icon: Code2, description: "Add a DSA problem" },
  { label: "New Event", to: "/cms/events", icon: Calendar, description: "Schedule an event" },
];

function OverviewPage() {
  const { stats, recentActivity } = Route.useLoaderData();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Overview"
        description="Platform health and quick actions at a glance"
        icon={BarChart3}
        breadcrumbs={[{ label: "Admin" }, { label: "Overview" }]}
        actions={[
          {
            label: "View Analytics",
            to: "/analytics",
            icon: TrendingUp,
            variant: "outline",
          },
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          delta={`${stats.activeUsers.toLocaleString()} active`}
          deltaDirection="up"
          className="stagger-item"
        />
        <StatCard
          title="Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          delta={`${stats.publishedCourses} published`}
          deltaDirection="up"
          className="stagger-item"
        />
        <StatCard
          title="DSA Problems"
          value={stats.totalProblems.toLocaleString()}
          icon={Code2}
          className="stagger-item"
        />
        <StatCard
          title="Events Upcoming"
          value={stats.upcomingEvents}
          icon={Calendar}
          className="stagger-item"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="island-shell rounded-xl p-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] group transition-all duration-150 active:scale-[0.98]"
                  style={{
                    border: "1px solid var(--sb-border)",
                    background: "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--sb-bg-hover)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "color-mix(in oklab, var(--sb-ink) 2%, transparent)";
                  }}
                >
                  <span
                    className="flex size-8 items-center justify-center rounded-[8px] shrink-0"
                    style={{
                      background: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
                      color: "var(--sb-ink-muted)",
                    }}
                  >
                    <action.icon size={14} />
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {action.label}
                    </span>
                    <span
                      className="text-[11px] truncate"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {action.description}
                    </span>
                  </div>
                  <ArrowRight
                    size={13}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ color: "var(--sb-ink-dim)" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="island-shell rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                Recent Activity
              </h2>
              <Link
                to="/audit"
                className="text-[11px] font-medium transition-opacity duration-100 hover:opacity-70"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                View all logs →
              </Link>
            </div>

            <div className="flex flex-col divide-y" style={{ borderColor: "var(--sb-border)" }}>
              {recentActivity.map((item: {id: string; type: string; description: string; timestamp: string}) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-3 stagger-item"
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-full mt-0.5 shrink-0"
                    style={{
                      background: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
                    }}
                  >
                    {item.type === "user_signup" && <Users size={11} style={{ color: "var(--sb-ink-muted)" }} />}
                    {item.type === "course_published" && <BookOpen size={11} style={{ color: "var(--sb-ink-muted)" }} />}
                    {item.type === "problem_created" && <Code2 size={11} style={{ color: "var(--sb-ink-muted)" }} />}
                    {item.type === "event_created" && <Calendar size={11} style={{ color: "var(--sb-ink-muted)" }} />}
                  </span>
                  <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
                    <span
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {item.description}
                    </span>
                    <span
                      className="text-[11px] shrink-0"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
