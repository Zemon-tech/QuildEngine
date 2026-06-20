import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, TrendingUp, BookOpen, Clock, Flame, Code2 } from "lucide-react";
import { useDashboardStats, useLearningProgress, useUpcomingEvents } from "#/hooks/use-dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="stagger-item flex flex-col gap-2 rounded-xl p-4"
      style={{
        background: "oklch(1 0 0 / 0.04)",
        border: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      <div
        className="flex size-9 items-center justify-center rounded-lg"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--sb-ink)" }}>
          {value}
        </p>
        <p className="mt-0.5 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: stats } = useDashboardStats();
  const { data: progress } = useLearningProgress();
  const { data: events } = useUpcomingEvents();

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Good morning 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Here's what's happening in your learning journey today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Courses enrolled"
          value={stats?.coursesEnrolled ?? "—"}
          color="var(--sb-accent)"
        />
        <StatCard
          icon={Code2}
          label="Lessons completed"
          value={stats?.lessonsCompleted ?? "—"}
          color="oklch(0.7 0.18 145)"
        />
        <StatCard
          icon={Clock}
          label="Hours learned"
          value={stats?.hoursLearned ?? "—"}
          color="oklch(0.7 0.18 260)"
        />
        <StatCard
          icon={Flame}
          label="Day streak"
          value={stats?.streakDays ? `${stats.streakDays}d` : "—"}
          color="oklch(0.72 0.22 55)"
        />
      </div>

      {/* Continue Learning */}
      {progress && (
        <div
          className="stagger-item mb-6 rounded-xl p-5"
          style={{
            background: "oklch(1 0 0 / 0.04)",
            border: "1px solid oklch(1 0 0 / 0.08)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
                Continue Learning
              </p>
              <h2 className="mt-0.5 text-base font-semibold" style={{ color: "var(--sb-ink)" }}>
                {progress.currentLesson}
              </h2>
              <p className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>
                {progress.currentCourse}
              </p>
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: "var(--sb-accent)" }}
            >
              {progress.progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "oklch(1 0 0 / 0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress.progressPercent}%`,
                background: "var(--sb-accent)",
              }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--sb-ink-dim)" }}>
            Next: {progress.nextMilestone}
          </p>
        </div>
      )}

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <div
          className="stagger-item rounded-xl p-5"
          style={{
            background: "oklch(1 0 0 / 0.04)",
            border: "1px solid oklch(1 0 0 / 0.08)",
          }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
            Upcoming Events
          </p>
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{ background: "oklch(1 0 0 / 0.04)" }}
              >
                <TrendingUp size={15} style={{ color: "var(--sb-accent)" }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--sb-ink)" }}>
                    {event.title}
                  </p>
                  <p className="text-xs capitalize" style={{ color: "var(--sb-ink-muted)" }}>
                    {event.type} · {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
