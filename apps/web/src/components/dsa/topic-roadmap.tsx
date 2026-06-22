import { motion } from "framer-motion";
import { BookOpen, Check, Clock, Lock, Play } from "lucide-react";
import type { DSAProblem } from "#/lib/dsa-problems-db";

interface RoadmapNode {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
}

interface TopicRoadmapProps {
  topicId: string;
  problems: DSAProblem[];
  onSelectSubtopic: (subtopic: string) => void;
}

const subtopicsMap: Record<string, RoadmapNode[]> = {
  arrays: [
    { name: "Basics", difficulty: "Easy", estimatedTime: "1.5 hrs" },
    { name: "Prefix Sum", difficulty: "Medium", estimatedTime: "2 hrs" },
    { name: "Two Pointers", difficulty: "Medium", estimatedTime: "3 hrs" },
    { name: "Sliding Window", difficulty: "Medium", estimatedTime: "3 hrs" },
    { name: "Binary Search", difficulty: "Medium", estimatedTime: "4 hrs" },
    { name: "Matrix Problems", difficulty: "Medium", estimatedTime: "3.5 hrs" },
  ],
  strings: [
    { name: "Basics", difficulty: "Easy", estimatedTime: "1 hr" },
    { name: "Pattern Matching", difficulty: "Medium", estimatedTime: "3 hrs" },
    { name: "Manipulation", difficulty: "Medium", estimatedTime: "2.5 hrs" },
  ],
  "linked-list": [
    { name: "Basics", difficulty: "Easy", estimatedTime: "1.5 hrs" },
    { name: "Operations", difficulty: "Easy", estimatedTime: "2 hrs" },
    { name: "Advanced", difficulty: "Medium", estimatedTime: "3 hrs" },
  ],
  trees: [
    { name: "Traversals", difficulty: "Easy", estimatedTime: "2 hrs" },
    { name: "BST", difficulty: "Easy", estimatedTime: "2.5 hrs" },
    { name: "Properties", difficulty: "Medium", estimatedTime: "3 hrs" },
  ],
  graphs: [
    { name: "Traversals", difficulty: "Medium", estimatedTime: "3 hrs" },
    { name: "Paths", difficulty: "Medium", estimatedTime: "4 hrs" },
    { name: "Advanced", difficulty: "Hard", estimatedTime: "5 hrs" },
  ],
  "dynamic-programming": [
    { name: "Basics", difficulty: "Easy", estimatedTime: "2.5 hrs" },
    { name: "Sequences", difficulty: "Medium", estimatedTime: "4 hrs" },
    { name: "Decisions", difficulty: "Hard", estimatedTime: "5 hrs" },
  ],
};

export function TopicRoadmap({
  topicId,
  problems,
  onSelectSubtopic,
}: TopicRoadmapProps) {
  const nodes = subtopicsMap[topicId] || [
    { name: "Basics", difficulty: "Easy", estimatedTime: "2 hrs" },
    { name: "Advanced", difficulty: "Medium", estimatedTime: "3 hrs" },
  ];

  return (
    <div className="w-full py-2 max-w-4xl mx-auto relative">
      {/* Visual Roadmap node list wrapper */}
      <div className="relative flex flex-col items-center gap-10">
        {/* Node connections tracks (vertical background line) */}
        <div
          className="absolute top-10 bottom-10 w-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{ background: "var(--sb-border)" }}
        />

        {nodes.map((node, index) => {
          // Calculate problems solved & total in this subtopic
          const subProblems = problems.filter(
            (p) => p.subCategory.toLowerCase() === node.name.toLowerCase(),
          );
          const totalCount = subProblems.length;
          const solvedCount = subProblems.filter(
            (p) => p.status === "completed",
          ).length;
          const completionRate =
            totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

          // Determine status state
          let statusState: "completed" | "in_progress" | "next_up" | "locked" =
            "locked";
          if (completionRate === 100 && totalCount > 0) {
            statusState = "completed";
          } else if (solvedCount > 0 || (index === 0 && solvedCount === 0)) {
            statusState = "in_progress";
          } else {
            // Check if previous node is completed
            const prevNode = nodes[index - 1];
            if (prevNode) {
              const prevProbs = problems.filter(
                (p) =>
                  p.subCategory.toLowerCase() === prevNode.name.toLowerCase(),
              );
              const prevSolved = prevProbs.filter(
                (p) => p.status === "completed",
              ).length;
              const prevRate =
                prevProbs.length > 0
                  ? Math.round((prevSolved / prevProbs.length) * 100)
                  : 0;
              statusState = prevRate === 100 ? "next_up" : "locked";
            } else {
              statusState = "next_up";
            }
          }

          return (
            <motion.div
              key={`roadmap-node-${node.name}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="relative z-10 w-full sm:w-[480px]"
            >
              {/* Connector Pin Dot */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-[-20px] sm:left-1/2 sm:-translate-x-1/2 size-7 rounded-full border-4 flex items-center justify-center transition-all ${
                  statusState === "completed"
                    ? "bg-emerald-500 border-emerald-200 dark:border-emerald-950 text-white"
                    : statusState === "in_progress"
                      ? "bg-amber-500 border-amber-200 dark:border-amber-950 text-white"
                      : statusState === "next_up"
                        ? "bg-[var(--card-bg)] border-[var(--sb-accent)] text-[var(--sb-accent)] scale-110 shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                }`}
              >
                {statusState === "completed" ? (
                  <Check size={11} strokeWidth={3} />
                ) : statusState === "in_progress" ? (
                  <div className="size-2 bg-white rounded-full animate-ping" />
                ) : statusState === "locked" ? (
                  <Lock size={10} />
                ) : (
                  <Play
                    size={10}
                    fill="currentColor"
                    className="translate-x-0.5"
                  />
                )}
              </div>

              {/* Node Card */}
              <div
                className={`ml-5 sm:ml-0 rounded-2xl border p-5 transition-all shadow-xs ${
                  statusState === "next_up"
                    ? "ring-2 ring-[var(--sb-accent)]/20"
                    : ""
                }`}
                style={{
                  background: "var(--card-bg)",
                  borderColor:
                    statusState === "next_up"
                      ? "var(--sb-accent)"
                      : "var(--card-border)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className="font-bold text-sm"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {node.name}
                      </h4>
                      {statusState === "next_up" && (
                        <span className="rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5">
                          Next Up
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-3 text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      <span className="flex items-center gap-0.5">
                        <Clock size={11} />
                        {node.estimatedTime}
                      </span>
                      <span>·</span>
                      <span className="font-semibold">{node.difficulty}</span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="text-right">
                    <div
                      className="text-xs font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {completionRate}%
                    </div>
                    <div
                      className="text-[9px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {solvedCount}/{totalCount} Solved
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {totalCount > 0 && (
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        statusState === "completed"
                          ? "bg-emerald-500"
                          : statusState === "in_progress"
                            ? "bg-amber-500"
                            : "bg-[var(--sb-accent)]"
                      }`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                )}

                {/* Card Actions */}
                <div
                  className="flex items-center justify-between border-t mt-4 pt-3.5"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    <BookOpen size={12} />
                    <span>Focus on core patterns</span>
                  </div>

                  <button
                    type="button"
                    disabled={statusState === "locked"}
                    onClick={() => onSelectSubtopic(node.name)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-tight border active:scale-95 transition-all select-none cursor-pointer ${
                      statusState === "locked"
                        ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 cursor-not-allowed opacity-50"
                        : "bg-[var(--sb-accent)]/5 hover:bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] border-[var(--sb-accent)]/10"
                    }`}
                  >
                    Practice Section
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
