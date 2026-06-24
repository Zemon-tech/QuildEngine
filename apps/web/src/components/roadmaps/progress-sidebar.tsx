import * as Icons from "lucide-react";
import type { Roadmap, UserProgress } from "../../types/roadmaps";
import { Button } from "../ui/button";

interface ProgressSidebarProps {
  roadmap: Roadmap;
  progress: UserProgress;
  onSelectNode: (nodeId: string) => void;
}

export function ProgressSidebar({
  roadmap,
  progress,
  onSelectNode,
}: ProgressSidebarProps) {
  // Calculate completed nodes inside this active roadmap
  const roadmapNodeIds = roadmap.nodes.map((n) => n.id);
  const completedInRoadmap = roadmapNodeIds.filter((id) =>
    progress.completedNodes.includes(id)
  );
  
  const completionPercentage = roadmapNodeIds.length
    ? Math.round((completedInRoadmap.length / roadmapNodeIds.length) * 100)
    : 0;

  // Filter bookmarks belonging to this roadmap
  const bookmarks = roadmap.nodes.filter((n) =>
    progress.bookmarkedNodes.includes(n.id)
  );

  // Suggest "Next Chapter to Study"
  // Find first node that is NOT completed, and is NOT locked
  const findNextNode = () => {
    return roadmap.nodes.find((node) => {
      const isCompleted = progress.completedNodes.includes(node.id);
      if (isCompleted) return false;

      // Check if locked
      const inboundEdges = roadmap.edges.filter((e) => e.target === node.id);
      if (inboundEdges.length > 0) {
        const anySourceCompleted = inboundEdges.some((e) =>
          progress.completedNodes.includes(e.source)
        );
        return anySourceCompleted;
      }
      return true; // No prerequisites -> unlocked
    });
  };

  const nextNode = findNextNode();

  return (
    <div
      className="w-full md:w-80 rounded-2xl p-6 border border-[var(--card-border)] flex flex-col gap-6"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Title */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)]">
          My Status
        </span>
        <h3 className="text-base font-bold text-[var(--sb-ink)] mt-1 truncate">
          {roadmap.title}
        </h3>
      </div>

      {/* Progress Circle Meter */}
      <div className="flex items-center gap-4 border-b border-[var(--card-border)]/50 pb-5">
        <div className="relative size-14 flex items-center justify-center shrink-0">
          <svg className="size-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              className="fill-none stroke-[var(--page-bg)] stroke-[3.5]"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              className="fill-none stroke-[var(--sb-accent)] stroke-[3.5] transition-all duration-700"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - completionPercentage / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-[var(--sb-ink)]">
            {completionPercentage}%
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--sb-ink)]">
            {completedInRoadmap.length} of {roadmapNodeIds.length} Completed
          </p>
          <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">
            Keep completing nodes to level up.
          </p>
        </div>
      </div>

      {/* Streak Info */}
      <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl border border-[var(--card-border)]/50 bg-[var(--page-bg)]/50">
        <Icons.Flame className="size-5 text-orange-500 animate-pulse shrink-0" />
        <div>
          <p className="text-xs font-bold text-[var(--sb-ink)]">
            Streak: {progress.learningStreak} Days
          </p>
          <p className="text-[9px] text-[var(--sb-ink-dim)] mt-0.5 leading-snug">
            Maintain daily learning to unlock exclusive achievements!
          </p>
        </div>
      </div>

      {/* Recommended Node Action */}
      {nextNode ? (
        <div className="space-y-2 border-b border-[var(--card-border)]/50 pb-5">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)]">
            Recommended Next
          </p>
          <div className="p-3.5 rounded-xl border border-[var(--card-border)]/70 bg-[var(--page-bg)]/30">
            <h4 className="text-xs font-bold text-[var(--sb-ink)] truncate">
              {nextNode.data.title}
            </h4>
            <p className="text-[10px] text-[var(--sb-ink-dim)] mt-1 truncate">
              {nextNode.data.duration} · {nextNode.data.difficulty}
            </p>
            <Button
              onClick={() => onSelectNode(nextNode.id)}
              className="w-full h-8 mt-3.5 bg-[var(--sb-accent)] hover:opacity-90 text-white rounded-lg text-[11px] font-semibold transition-all border-0 shadow-none cursor-pointer"
            >
              Continue Guide
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 border border-emerald-500/10 rounded-xl bg-emerald-500/5 border-b border-[var(--card-border)]/50 pb-5">
          <Icons.CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
            Congratulations!
          </p>
          <p className="text-[10px] text-[var(--sb-ink-dim)] mt-1 leading-snug">
            You completed every node in this path!
          </p>
        </div>
      )}

      {/* Bookmarks Section */}
      <div className="flex-1 flex flex-col gap-2 min-h-[150px]">
        <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] flex items-center gap-1.5">
          <Icons.Bookmark size={11} />
          Bookmarks ({bookmarks.length})
        </p>

        {bookmarks.length === 0 ? (
          <div className="flex-1 border border-dashed border-[var(--card-border)] rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <Icons.BookmarkMinus size={16} className="text-[var(--sb-ink-dim)] mb-1.5" />
            <p className="text-[10px] text-[var(--sb-ink-dim)] max-w-[150px] leading-snug">
              Bookmark resources or chapters for quick reviews.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
            {bookmarks.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNode(n.id)}
                className="flex items-center justify-between text-left p-2.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--sb-accent)]/30 hover:bg-[var(--sb-bg-hover)] transition-all cursor-pointer group"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold truncate text-[var(--sb-ink)] group-hover:text-[var(--sb-accent)] transition-colors">
                    {n.data.title}
                  </p>
                  <p className="text-[9px] text-[var(--sb-ink-dim)] truncate mt-0.5">
                    {n.data.difficulty} · {n.data.duration}
                  </p>
                </div>
                <Icons.ChevronRight size={11} className="text-[var(--sb-ink-dim)] group-hover:text-[var(--sb-accent)] transition-transform group-hover:translate-x-0.5 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
