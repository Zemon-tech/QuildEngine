import {
  BarChart3,
  BookOpen,
  Clock,
  Code,
  Flame,
  Trophy,
  Zap,
} from "lucide-react";

export interface ActivityEvent {
  id: string;
  type: "course" | "dsa" | "research" | "certification" | "achievement";
  content: string;
  date: string;
}

export interface AchievementItem {
  title: string;
  event: string;
  rank?: string;
  date: string;
}

interface ProfileAnalyticsProps {
  stats: {
    coursesCompleted: number;
    dsaSolved: number;
    hoursLearned: number;
    streakDays: number;
  };
  activities: ActivityEvent[];
  achievements: AchievementItem[];
}

export function ProfileAnalytics({
  stats,
  activities,
  achievements,
}: ProfileAnalyticsProps) {
  // Generate data for the contribution-like Learning Grid (24 weeks)
  const totalWeeks = 24;
  const daysPerWeek = 7;

  // Custom seed values for colors to make it look realistic
  function getActivityLevel(colIndex: number, rowIndex: number): number {
    const sum = colIndex + rowIndex * 2;
    if (sum % 7 === 0) return 3; // active
    if (sum % 5 === 0) return 2; // medium
    if (sum % 3 === 0) return 1; // low
    return 0; // none
  }

  const gridColors = [
    "bg-[var(--card-border)]/40", // 0
    "bg-[var(--sb-accent)]/20", // 1
    "bg-[var(--sb-accent)]/50", // 2
    "bg-[var(--sb-accent)]", // 3
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Courses */}
        <div
          className="flex flex-col gap-2 rounded-xl p-4 border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--sb-bg-hover)]">
            <BookOpen size={16} className="text-[var(--sb-accent)]" />
          </div>
          <div>
            <p
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {stats.coursesCompleted}
            </p>
            <p className="text-[11px] text-[var(--sb-ink-muted)]">
              Courses Completed
            </p>
          </div>
        </div>

        {/* DSA Problems */}
        <div
          className="flex flex-col gap-2 rounded-xl p-4 border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--sb-bg-hover)]">
            <Code size={16} className="text-[var(--sb-accent)]" />
          </div>
          <div>
            <p
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {stats.dsaSolved}
            </p>
            <p className="text-[11px] text-[var(--sb-ink-muted)]">DSA Solved</p>
          </div>
        </div>

        {/* Hours Learned */}
        <div
          className="flex flex-col gap-2 rounded-xl p-4 border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--sb-bg-hover)]">
            <Clock size={16} className="text-[var(--sb-accent)]" />
          </div>
          <div>
            <p
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {stats.hoursLearned}h
            </p>
            <p className="text-[11px] text-[var(--sb-ink-muted)]">
              Hours Learned
            </p>
          </div>
        </div>

        {/* Streak */}
        <div
          className="flex flex-col gap-2 rounded-xl p-4 border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--sb-bg-hover)]">
            <Flame size={16} className="text-[var(--sb-accent)]" />
          </div>
          <div>
            <p
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {stats.streakDays}d
            </p>
            <p className="text-[11px] text-[var(--sb-ink-muted)]">
              Learning Streak
            </p>
          </div>
        </div>
      </div>

      {/* GitHub-style Learning Grid */}
      <div
        className="p-6 rounded-2xl border flex flex-col gap-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--page-ink)" }}
          >
            <Zap size={15} className="text-[var(--sb-accent)]" />
            Learning Activity Grid
          </h3>
          <span className="text-[10px] text-[var(--sb-ink-dim)]">
            Last {totalWeeks} weeks of practice
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex flex-col gap-1 min-w-[340px]">
            {Array.from({ length: daysPerWeek }).map((_, rIndex) => (
              <div key={rIndex} className="flex gap-1">
                {Array.from({ length: totalWeeks }).map((_, cIndex) => {
                  const level = getActivityLevel(cIndex, rIndex);
                  return (
                    <div
                      key={cIndex}
                      className={`size-3 rounded-[2px] transition-all hover:scale-110 ${gridColors[level]}`}
                      title={`Activity level: ${level}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 text-[9px] text-[var(--sb-ink-dim)]">
          <span>Less</span>
          <div className="size-2 bg-[var(--card-border)]/40 rounded-[1px]" />
          <div className="size-2 bg-[var(--sb-accent)]/20 rounded-[1px]" />
          <div className="size-2 bg-[var(--sb-accent)]/50 rounded-[1px]" />
          <div className="size-2 bg-[var(--sb-accent)] rounded-[1px]" />
          <span>More</span>
        </div>
      </div>

      {/* Two column lists for activity feed and achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievements Card */}
        <div
          className="p-5 rounded-2xl border flex flex-col gap-4"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3
            className="text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--page-ink)" }}
          >
            <Trophy size={15} className="text-[var(--sb-accent)]" />
            Achievements & Awards
          </h3>

          <div className="flex flex-col gap-3 text-[13px]">
            {achievements.length === 0 ? (
              <p className="text-xs text-[var(--sb-ink-muted)] py-4 text-center">
                No achievements listed yet.
              </p>
            ) : (
              achievements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-[var(--page-bg)]"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <Zap
                    size={14}
                    className="text-[var(--sb-accent)] mt-0.5 shrink-0"
                  />
                  <div>
                    <h4
                      className="font-semibold text-xs"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                      {item.event} {item.rank && `· Rank: ${item.rank}`}
                    </p>
                    <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed Card */}
        <div
          className="p-5 rounded-2xl border flex flex-col gap-4"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3
            className="text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--page-ink)" }}
          >
            <BarChart3 size={15} className="text-[var(--sb-accent)]" />
            Recent Activity Feed
          </h3>

          <div
            className="flex flex-col gap-3 text-[13px] relative pl-3 border-l"
            style={{ borderColor: "var(--card-border)" }}
          >
            {activities.length === 0 ? (
              <p className="text-xs text-[var(--sb-ink-muted)] py-4 text-center">
                No recent activities.
              </p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="relative flex flex-col gap-0.5">
                  {/* node */}
                  <div className="absolute -left-[18px] top-1.5 size-2 rounded-full bg-[var(--sb-accent)]" />

                  <p
                    className="font-medium text-xs"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {act.content}
                  </p>
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    {act.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
