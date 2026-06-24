import * as Icons from "lucide-react";
import type { UserProgress } from "../../types/roadmaps";
import { cn } from "../../lib/utils";

interface StatsCardProps {
  progress: UserProgress;
}

export function StatsCard({ progress }: StatsCardProps) {
  // Mock weekly learning calendar (mon-sun)
  // Highlight completed days based on streak or completed nodes
  const weekDays = [
    { day: "M", completed: progress.completedNodes.length > 0 },
    { day: "T", completed: progress.completedNodes.length > 1 },
    { day: "W", completed: progress.completedNodes.length > 2 },
    { day: "T", completed: progress.completedNodes.length > 3 },
    { day: "F", completed: false },
    { day: "S", completed: false },
    { day: "S", completed: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-8">
      {/* Total XP Card */}
      <div
        className="flex items-center gap-4 rounded-xl p-5 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <Icons.Sparkles className="size-5" />
        </span>
        <div>
          <p className="text-xl font-bold tracking-tight text-[var(--sb-ink)]">
            {progress.xpPoints} <span className="text-xs font-semibold text-purple-500">XP</span>
          </p>
          <p className="text-[11px] font-semibold text-[var(--sb-ink-dim)] uppercase tracking-wider mt-0.5">
            Total Points Earned
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div
        className="flex items-center gap-4 rounded-xl p-5 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
          <Icons.Flame className="size-5" />
        </span>
        <div>
          <p className="text-xl font-bold tracking-tight text-[var(--sb-ink)]">
            {progress.learningStreak} <span className="text-xs font-semibold text-orange-500">Days</span>
          </p>
          <p className="text-[11px] font-semibold text-[var(--sb-ink-dim)] uppercase tracking-wider mt-0.5">
            Current Learning Streak
          </p>
        </div>
      </div>

      {/* Weekly Activity Tracker Card */}
      <div
        className="flex flex-col justify-between rounded-xl p-4 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)]">
            Weekly Activity
          </p>
          <span className="text-[10px] font-semibold text-[var(--sb-ink-muted)]">
            Jun 18 - Jun 24
          </span>
        </div>
        <div className="flex items-center justify-between gap-1.5 mt-3">
          {weekDays.map((wd, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[9px] font-bold text-[var(--sb-ink-muted)]">{wd.day}</span>
              <div
                className={cn(
                  "size-5 rounded-md border flex items-center justify-center transition-all duration-300",
                  wd.completed
                    ? "bg-[var(--sb-accent)] border-[var(--sb-accent)]/20 shadow-[0_0_8px_rgba(var(--sb-accent-rgb),0.2)]"
                    : "bg-[var(--page-bg)] border-[var(--card-border)]"
                )}
              >
                {wd.completed && <Icons.Check size={10} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
