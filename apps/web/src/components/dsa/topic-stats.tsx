import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  CheckSquare,
  Clock,
  Flame,
  HelpCircle,
  ListTodo,
  Percent,
} from "lucide-react";
import type { DSAProblem } from "#/lib/dsa-problems-db";

interface TopicStatsProps {
  problems: DSAProblem[];
  currentStreak?: number;
}

export function TopicStats({ problems, currentStreak = 6 }: TopicStatsProps) {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === "completed").length;
  const remaining = total - solved;
  const completionPercentage =
    total > 0 ? Math.round((solved / total) * 100) : 0;

  // Mocked analytics stats that scale realistically
  const accuracyRate = total > 0 ? 76 + (solved % 10) : 0; // realistic mock value based on progress
  const timeSpent = solved * 25 + (remaining > 0 ? 15 : 0); // approx minutes spent
  const formattedTime =
    timeSpent > 60
      ? `${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`
      : `${timeSpent}m`;

  const avgAcceptance = useMemo(() => {
    if (total === 0) return 0;
    const sum = problems.reduce((acc, p) => acc + p.acceptance, 0);
    return Math.round((sum / total) * 10) / 10;
  }, [problems, total]);

  const cards = [
    {
      title: "Total Problems",
      value: total,
      desc: "Available in category",
      icon: ListTodo,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Solved Problems",
      value: solved,
      desc: "Syllabus completed",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Remaining Problems",
      value: remaining,
      desc: "To be completed",
      icon: HelpCircle,
      color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
    },
    {
      title: "Current Streak",
      value: `${currentStreak} Days`,
      desc: "Consecutive practice",
      icon: Flame,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Time Spent",
      value: formattedTime,
      desc: "Total interactive study",
      icon: Clock,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Accuracy Rate",
      value: `${accuracyRate}%`,
      desc: "First submit success",
      icon: Percent,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "Acceptance Rate",
      value: `${avgAcceptance}%`,
      desc: "Global category avg",
      icon: Award,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Completion Ratio",
      value: `${completionPercentage}%`,
      desc: "Study path coverage",
      icon: CheckSquare,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.04,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="rounded-2xl border p-4.5 flex flex-col justify-between h-[125px]"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                {card.title}
              </span>
              <div
                className={`flex size-7 items-center justify-center rounded-lg border ${card.color}`}
              >
                <Icon size={14} />
              </div>
            </div>

            <div className="space-y-0.5">
              <div
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--sb-ink)" }}
              >
                {card.value}
              </div>
              <p
                className="text-[10px]"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                {card.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

import { useMemo } from "react";
