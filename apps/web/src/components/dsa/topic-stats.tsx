import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  CheckCircle2,
  CheckSquare,
  Clock,
  Flame,
  HelpCircle,
  ListTodo,
  Percent,
  ChevronDown,
} from "lucide-react";
import type { DSAProblem } from "#/lib/dsa-problems-db";

interface TopicStatsProps {
  problems: DSAProblem[];
  currentStreak?: number;
}

export function TopicStats({ problems, currentStreak = 6 }: TopicStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const mainCards = cards.slice(0, 4);
  const extraCards = cards.slice(4);

  const renderCard = (card: typeof cards[0], idx: number) => {
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
        className="rounded-2xl border p-4 flex items-center gap-4 bg-white"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${card.color}`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            {card.title}
          </span>
          <div
            className="text-xl font-bold tracking-tight leading-none"
            style={{ color: "var(--sb-ink)" }}
          >
            {card.value}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {mainCards.map(renderCard)}
      </div>

      <div className="flex justify-center my-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {isExpanded ? "Hide Advanced Stats" : "Show Advanced Stats"}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pb-1">
              {extraCards.map(renderCard)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
