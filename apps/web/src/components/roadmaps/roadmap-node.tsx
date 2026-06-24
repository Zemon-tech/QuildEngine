import { Handle, Position } from "@xyflow/react";
import * as Icons from "lucide-react";
import type { RoadmapNodeData } from "../../types/roadmaps";
import { cn } from "../../lib/utils";

interface RoadmapNodeProps {
  data: RoadmapNodeData;
  selected?: boolean;
}

export function RoadmapNode({ data, selected }: RoadmapNodeProps) {
  // Styles for each difficulty level
  const difficultyColors = {
    beginner: {
      border: "border-emerald-500/20 group-hover:border-emerald-500/40",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/20",
      bg: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
      completedBg: "bg-emerald-500 text-white",
      completedBorder: "border-emerald-600",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    intermediate: {
      border: "border-blue-500/20 group-hover:border-blue-500/40",
      activeBorder: "border-blue-500 ring-2 ring-blue-500/20",
      bg: "bg-blue-500/5 group-hover:bg-blue-500/10",
      completedBg: "bg-blue-500 text-white",
      completedBorder: "border-blue-600",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    },
    advanced: {
      border: "border-purple-500/20 group-hover:border-purple-500/40",
      activeBorder: "border-purple-500 ring-2 ring-purple-500/20",
      bg: "bg-purple-500/5 group-hover:bg-purple-500/10",
      completedBg: "bg-purple-500 text-white",
      completedBorder: "border-purple-600",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    },
  };

  const colors = difficultyColors[data.difficulty];
  const isCompleted = data.status === "completed";
  const isInProgress = data.status === "in_progress";
  const isLocked = data.status === "locked";

  return (
    <div className="relative group select-none">
      {/* Target input handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[var(--card-border)] !w-3 !h-3 !border-2 !border-[var(--page-bg)]"
      />

      {/* Main Node Card */}
      <div
        className={cn(
          "w-56 rounded-xl p-4 transition-all duration-200 border text-left",
          "active:scale-98 relative cursor-pointer",
          isLocked
            ? "bg-[var(--card-bg)]/40 border-[var(--card-border)]/50 opacity-50 cursor-not-allowed"
            : isCompleted
            ? cn("border-[var(--sb-accent)]", colors.glow)
            : isInProgress
            ? cn("border-[var(--sb-accent)] border-dashed bg-[var(--sb-accent)]/5 shadow-md", colors.glow)
            : cn("bg-[var(--card-bg)]", colors.border),
          selected && !isLocked && "ring-2 ring-[var(--sb-accent)] border-[var(--sb-accent)]"
        )}
        style={{
          background: isLocked
            ? "rgba(var(--card-bg-rgb), 0.4)"
            : isCompleted || isInProgress
            ? undefined
            : "var(--card-bg)",
          borderColor: selected ? "var(--sb-accent)" : undefined,
        }}
      >
        {/* Glow effect on hover */}
        {!isLocked && (
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-[var(--sb-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}

        {/* Header: Difficulty + Status Icon */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider",
              colors.badge
            )}
          >
            {data.difficulty}
          </span>

          {/* Status Icon */}
          <span className="flex size-5 items-center justify-center rounded-full text-xs">
            {isLocked && <Icons.Lock size={11} className="text-[var(--sb-ink-dim)]" />}
            {isCompleted && (
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <Icons.Check size={10} strokeWidth={3} />
              </span>
            )}
            {isInProgress && (
              <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-white animate-pulse">
                <Icons.Flame size={10} strokeWidth={2.5} />
              </span>
            )}
            {!isLocked && !isCompleted && !isInProgress && (
              <Icons.Circle size={12} className="text-[var(--sb-ink-dim)] group-hover:text-[var(--sb-accent)] transition-colors" />
            )}
          </span>
        </div>

        {/* Title */}
        <h4
          className={cn(
            "text-xs font-bold leading-snug line-clamp-2",
            isLocked ? "text-[var(--sb-ink-muted)]" : "text-[var(--sb-ink)]"
          )}
        >
          {data.title}
        </h4>

        {/* Info row */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--sb-ink-dim)] mt-3">
          <span className="flex items-center gap-1">
            <Icons.Clock size={10} />
            {data.duration}
          </span>
          <span className="flex items-center gap-1">
            <Icons.FolderClosed size={10} />
            {data.resourceCount} resources
          </span>
        </div>
      </div>

      {/* Source output handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[var(--card-border)] !w-3 !h-3 !border-2 !border-[var(--page-bg)]"
      />
    </div>
  );
}
export default RoadmapNode;
