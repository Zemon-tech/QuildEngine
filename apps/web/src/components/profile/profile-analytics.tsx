import {
  BarChart3,
  BookOpen,
  Clock,
  Code,
  Flame,
  Trophy,
  Zap,
} from "lucide-react";
import { Card } from "#/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "#/components/ui/empty";

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
        <Card className="flex flex-col gap-2 rounded-xl p-4 border border-card-border bg-card-bg shadow-none">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sb-bg-hover">
            <BookOpen size={16} className="text-sb-accent" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-sb-ink">
              {stats.coursesCompleted}
            </p>
            <p className="text-[11px] text-sb-ink-muted">Courses Completed</p>
          </div>
        </Card>

        {/* DSA Problems */}
        <Card className="flex flex-col gap-2 rounded-xl p-4 border border-card-border bg-card-bg shadow-none">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sb-bg-hover">
            <Code size={16} className="text-sb-accent" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-sb-ink">
              {stats.dsaSolved}
            </p>
            <p className="text-[11px] text-sb-ink-muted">DSA Solved</p>
          </div>
        </Card>

        {/* Hours Learned */}
        <Card className="flex flex-col gap-2 rounded-xl p-4 border border-card-border bg-card-bg shadow-none">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sb-bg-hover">
            <Clock size={16} className="text-sb-accent" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-sb-ink">
              {stats.hoursLearned}h
            </p>
            <p className="text-[11px] text-sb-ink-muted">Hours Learned</p>
          </div>
        </Card>

        {/* Streak */}
        <Card className="flex flex-col gap-2 rounded-xl p-4 border border-card-border bg-card-bg shadow-none">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sb-bg-hover">
            <Flame size={16} className="text-sb-accent" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-sb-ink">
              {stats.streakDays}d
            </p>
            <p className="text-[11px] text-sb-ink-muted">Learning Streak</p>
          </div>
        </Card>
      </div>

      {/* GitHub-style Learning Grid */}
      <Card className="p-6 rounded-2xl border border-card-border bg-card-bg shadow-none flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-page-ink">
            <Zap size={15} className="text-sb-accent" />
            Learning Activity Grid
          </h3>
          <span className="text-[10px] text-sb-ink-dim">
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
        <div className="flex items-center justify-end gap-1.5 text-[9px] text-sb-ink-dim">
          <span>Less</span>
          <div className="size-2 bg-card-border/40 rounded-[1px]" />
          <div className="size-2 bg-sb-accent/20 rounded-[1px]" />
          <div className="size-2 bg-sb-accent/50 rounded-[1px]" />
          <div className="size-2 bg-sb-accent rounded-[1px]" />
          <span>More</span>
        </div>
      </Card>

      {/* Two column lists for activity feed and achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievements Card */}
        <Card className="p-5 rounded-2xl border border-card-border bg-card-bg shadow-none flex flex-col gap-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-page-ink">
            <Trophy size={15} className="text-sb-accent" />
            Achievements & Awards
          </h3>

          <div className="flex flex-col gap-3 text-[13px]">
            {achievements.length === 0 ? (
              <Empty className="py-6 bg-transparent border-dashed border-card-border">
                <EmptyIcon className="bg-sb-bg-hover size-8 mb-2">
                  <Trophy size={14} className="text-sb-accent" />
                </EmptyIcon>
                <EmptyTitle className="text-xs">No Achievements</EmptyTitle>
                <EmptyDescription className="text-[10px]">
                  No achievements listed yet.
                </EmptyDescription>
              </Empty>
            ) : (
              achievements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-card-border bg-page-bg"
                >
                  <Zap size={14} className="text-sb-accent mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-xs text-sb-ink">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-sb-ink-muted mt-0.5">
                      {item.event} {item.rank && `· Rank: ${item.rank}`}
                    </p>
                    <p className="text-[10px] text-sb-ink-dim mt-0.5">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Activity Feed Card */}
        <Card className="p-5 rounded-2xl border border-card-border bg-card-bg shadow-none flex flex-col gap-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-page-ink">
            <BarChart3 size={15} className="text-sb-accent" />
            Recent Activity Feed
          </h3>

          <div className="flex flex-col gap-3 text-[13px] relative pl-3 border-l border-card-border">
            {activities.length === 0 ? (
              <Empty className="py-6 bg-transparent border-dashed border-card-border">
                <EmptyIcon className="bg-sb-bg-hover size-8 mb-2">
                  <Zap size={14} className="text-sb-accent" />
                </EmptyIcon>
                <EmptyTitle className="text-xs">No Activity</EmptyTitle>
                <EmptyDescription className="text-[10px]">
                  No recent activities logged.
                </EmptyDescription>
              </Empty>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="relative flex flex-col gap-0.5">
                  {/* node */}
                  <div className="absolute -left-[18px] top-1.5 size-2 rounded-full bg-sb-accent" />

                  <p className="font-medium text-xs text-sb-ink">
                    {act.content}
                  </p>
                  <span className="text-[10px] text-sb-ink-dim">
                    {act.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
