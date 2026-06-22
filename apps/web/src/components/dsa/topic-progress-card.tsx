import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface TopicProgressCardProps {
  solvedCount: number;
  totalCount: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  currentStreak?: number;
}

export function TopicProgressCard({
  solvedCount,
  totalCount,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
  currentStreak = 4, // Default mock streak
}: TopicProgressCardProps) {
  const percentage =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // SVG Circular progress details
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-all"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <h2
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            Progress & Metrics
          </h2>
          <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10">
            <Flame size={12} fill="currentColor" />
            <span>{currentStreak} Day Streak</span>
          </div>
        </div>

        {/* Circular Progress & Percentage Row */}
        <div className="flex items-center justify-around gap-4">
          <div className="relative flex items-center justify-center">
            {/* SVG Circle */}
            <svg className="size-28 -rotate-90">
              <title>Progress Circle</title>
              {/* Background circle */}
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-zinc-100 dark:stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />

              {/* Foreground circle with animation */}
              <motion.circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-[var(--sb-accent)]"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--sb-ink)" }}
              >
                {percentage}%
              </span>
              <span
                className="text-[10px]"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                {solvedCount}/{totalCount}
              </span>
            </div>
          </div>

          {/* Simple Overall Progress Stat summary */}
          <div className="space-y-1.5 flex-1">
            <div
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{ color: "var(--sb-ink)" }}
            >
              <Trophy size={14} className="text-yellow-500" />
              <span>Category Status</span>
            </div>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              You solved{" "}
              <strong className="text-[var(--sb-accent)]">{solvedCount}</strong>{" "}
              problems in this topic. Keep practicing to maintain your daily
              streak!
            </p>
          </div>
        </div>

        {/* Difficulty Bars Breakdown */}
        <div
          className="space-y-3.5 pt-2 border-t"
          style={{ borderColor: "var(--sb-border)" }}
        >
          {/* Easy Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-500 font-semibold">Easy</span>
              <span style={{ color: "var(--sb-ink-muted)" }}>
                {easySolved} / {easyTotal}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-emerald-500/10 overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Medium Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-amber-500 font-semibold">Medium</span>
              <span style={{ color: "var(--sb-ink-muted)" }}>
                {mediumSolved} / {mediumTotal}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-500/10 overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Hard Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-rose-500 font-semibold">Hard</span>
              <span style={{ color: "var(--sb-ink-muted)" }}>
                {hardSolved} / {hardTotal}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-rose-500/10 overflow-hidden">
              <motion.div
                className="h-full bg-rose-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
