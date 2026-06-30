import * as Icons from "lucide-react";
import { cn } from "../../lib/utils";
import type { Achievement } from "../../types/roadmaps";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = (Icons as any)[achievement.iconName] || Icons.Award;
  const isUnlocked = achievement.status === "unlocked";

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300 border",
        isUnlocked
          ? "bg-[var(--card-bg)] border-[var(--sb-accent)]/20 shadow-md"
          : "bg-[var(--card-bg)]/40 border-[var(--card-border)]/50 opacity-60",
      )}
      style={{
        background: "var(--card-bg)",
        border: isUnlocked
          ? "1px solid var(--sb-accent)/20"
          : "1px solid var(--card-border)",
      }}
    >
      {/* Icon Badge */}
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300",
          isUnlocked
            ? "bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] scale-105 shadow-[0_0_12px_rgba(var(--sb-accent-rgb),0.1)]"
            : "bg-[var(--page-bg)] text-[var(--sb-ink-dim)]",
        )}
      >
        <IconComponent
          className={cn("size-5", isUnlocked && "animate-pulse")}
        />
      </div>

      {/* Description Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs font-bold truncate",
              isUnlocked
                ? "text-[var(--sb-ink)]"
                : "text-[var(--sb-ink-muted)]",
            )}
          >
            {achievement.title}
          </p>
          <span
            className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-transparent",
              isUnlocked
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-[var(--page-bg)] text-[var(--sb-ink-dim)]",
            )}
          >
            +{achievement.xpValue} XP
          </span>
        </div>
        <p className="text-[10px] text-[var(--sb-ink-dim)] leading-snug mt-1 line-clamp-2">
          {achievement.description}
        </p>
        {isUnlocked && achievement.unlockedAt && (
          <p className="text-[8px] text-emerald-600 dark:text-emerald-500 font-semibold mt-1">
            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
