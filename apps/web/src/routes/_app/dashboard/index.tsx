import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Code2,
  Flame,
  type LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { Card } from "#/components/ui/card";
import {
  useDashboardStats,
  useLearningProgress,
  useUpcomingEvents,
} from "#/hooks/use-dashboard";

export const Route = createFileRoute("/_app/dashboard/")({
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
    <Card className="stagger-item flex flex-col gap-3 rounded-xl p-4.5 border border-card-border bg-card-bg shadow-none hover:border-sb-accent/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-sb-ink-muted">{label}</span>
        <div
          className="flex size-7 items-center justify-center rounded-md"
          style={{ background: `${color}14` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-sb-ink">{value}</p>
      </div>
    </Card>
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
        <h1 className="text-2xl font-bold tracking-tight text-sb-ink font-serif">
          Good morning 👋
        </h1>
        <p className="mt-1 text-sm text-sb-ink-muted">
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
        <Card className="stagger-item mb-6 rounded-xl p-5 border border-card-border bg-card-bg shadow-none">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-sb-ink-dim">
                Continue Learning
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-sb-ink">
                {progress.currentLesson}
              </h2>
              <p className="text-sm text-sb-ink-muted">
                {progress.currentCourse}
              </p>
            </div>
            <span className="text-lg font-bold text-sb-accent">
              {progress.progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-page-bg">
            <div
              className="h-full rounded-full transition-all duration-700 bg-sb-accent"
              style={{
                width: `${progress.progressPercent}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-sb-ink-dim">
            Next: {progress.nextMilestone}
          </p>
        </Card>
      )}

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <Card className="stagger-item rounded-xl p-5 border border-card-border bg-card-bg shadow-none">
          <p className="mb-3 text-xs font-medium text-sb-ink-dim">
            Upcoming Events
          </p>
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-page-bg"
              >
                <TrendingUp size={15} className="text-sb-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-sb-ink">
                    {event.title}
                  </p>
                  <p className="text-xs capitalize text-sb-ink-muted">
                    {event.type} · {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
