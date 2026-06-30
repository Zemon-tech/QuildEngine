import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import type { Roadmap, UserProgress } from "../../types/roadmaps";
import { Button } from "../ui/button";

interface ResourcePanelProps {
  roadmap: Roadmap;
  nodeId: string;
  progress: UserProgress;
  onClose: () => void;
  onToggleCompletion: (
    nodeId: string,
    roadmapId: string,
    status: "completed" | "in_progress" | "not_started",
  ) => void;
  onToggleBookmark: (nodeId: string) => void;
  onSelectNode?: (nodeId: string) => void;
}

type TabType =
  | "overview"
  | "articles"
  | "documentation"
  | "videos"
  | "practice"
  | "github"
  | "notes";

export function ResourcePanel({
  roadmap,
  nodeId,
  progress,
  onClose,
  onToggleCompletion,
  onToggleBookmark,
  onSelectNode,
}: ResourcePanelProps) {
  // Find node details
  const node = roadmap.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const isCompleted = progress.completedNodes.includes(nodeId);
  const isBookmarked = progress.bookmarkedNodes.includes(nodeId);

  // Tabs management
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const tabsList: { key: TabType; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Icons.BookOpen },
    { key: "documentation", label: "Docs", icon: Icons.Compass },
    { key: "articles", label: "Articles", icon: Icons.FileText },
    { key: "videos", label: "Videos", icon: Icons.Play },
    { key: "practice", label: "Practice", icon: Icons.CheckSquare },
    { key: "github", label: "GitHub", icon: Icons.Github },
    { key: "notes", label: "Notes", icon: Icons.FileEdit },
  ];

  // Notes LocalStorage management
  const [noteText, setNoteText] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNote = localStorage.getItem(`quild_roadmap_note_${nodeId}`);
      setNoteText(savedNote ?? "");
    }
    setActiveTab("overview"); // reset tab on node change
  }, [nodeId]);

  const handleNoteSave = (text: string) => {
    setNoteText(text);
    if (typeof window !== "undefined") {
      localStorage.setItem(`quild_roadmap_note_${nodeId}`, text);
    }
  };

  // Filter resources based on selected tab
  const filteredResources = node.data.resources.filter(
    (res) => res.type === activeTab,
  );

  // Find downstream connected nodes first, or fallback to first uncompleted unlocked node
  const getNextConnectedNodeId = (): string | null => {
    const outboundEdges = roadmap.edges.filter((e) => e.source === nodeId);
    if (outboundEdges.length > 0) {
      return outboundEdges[0].target;
    }

    const uncompleted = roadmap.nodes.find((n) => {
      const isNodeCompleted = progress.completedNodes.includes(n.id);
      if (isNodeCompleted || n.id === nodeId) return false;

      const inboundEdges = roadmap.edges.filter((e) => e.target === n.id);
      if (inboundEdges.length > 0) {
        const anySourceCompleted = inboundEdges.some((e) =>
          progress.completedNodes.includes(e.source),
        );
        return anySourceCompleted;
      }
      return true;
    });

    return uncompleted ? uncompleted.id : null;
  };

  const nextNodeId = getNextConnectedNodeId();
  const nextNodeObj = nextNodeId
    ? roadmap.nodes.find((n) => n.id === nextNodeId)
    : null;

  // Easing curve for drawer transition from right
  const easeDrawer: [number, number, number, number] = [0.32, 0.72, 0, 1]; // custom cubic-bezier

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end select-none pointer-events-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] pointer-events-auto"
        />

        {/* Slide-out Drawer content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ ease: easeDrawer, duration: 0.35 }}
          className="relative w-full max-w-lg h-full border-l border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl flex flex-col justify-between pointer-events-auto page-enter z-10"
          style={{
            background: "var(--card-bg)",
            borderLeft: "1px solid var(--card-border)",
          }}
        >
          {/* Header Panel */}
          <div className="p-5 border-b border-[var(--card-border)]/50">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-accent)] bg-[var(--sb-accent)]/10 px-2 py-0.5 rounded-full">
                {node.data.difficulty}
              </span>

              <div className="flex items-center gap-1">
                {/* Bookmark Toggle Button */}
                <button
                  onClick={() => onToggleBookmark(nodeId)}
                  className={cn(
                    "p-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer",
                    isBookmarked
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "border-[var(--card-border)] text-[var(--sb-ink-dim)] hover:bg-[var(--sb-bg-hover)]",
                  )}
                >
                  <Icons.Bookmark
                    size={14}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>

                {/* Close Panel Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-[var(--card-border)] text-[var(--sb-ink-dim)] hover:bg-[var(--sb-bg-hover)] transition-all active:scale-95 cursor-pointer"
                >
                  <Icons.X size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-[var(--sb-ink)] leading-snug">
              {node.data.title}
            </h3>
            <p className="text-[11px] text-[var(--sb-ink-dim)] mt-1.5 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Icons.Clock size={11} />
                {node.data.duration} Study
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Icons.Layers size={11} />
                {node.data.resources.length} resources
              </span>
            </p>
          </div>

          {/* Custom Tabs Navigation (Dynamic Framer Motion slider indicator) */}
          <div className="flex items-center gap-1 border-b border-[var(--card-border)]/50 px-4 py-1.5 overflow-x-auto shrink-0 bg-[var(--page-bg)]/30">
            {tabsList.map((t) => {
              const isSelected = activeTab === t.key;
              const TabIcon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "relative px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer active:scale-95 shrink-0",
                    isSelected
                      ? "text-[var(--sb-accent)]"
                      : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]",
                  )}
                >
                  <TabIcon size={12} />
                  {t.label}
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute inset-0 bg-[var(--sb-accent)]/5 rounded-lg -z-10 border border-[var(--sb-accent)]/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tabs Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)]">
                    Description
                  </span>
                  <p className="text-xs leading-relaxed text-[var(--sb-ink-muted)]">
                    {node.data.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--page-bg)]/30 space-y-2">
                  <h4 className="text-xs font-bold text-[var(--sb-ink)] flex items-center gap-1.5">
                    <Icons.Lightbulb
                      size={13}
                      className="text-[var(--sb-accent)]"
                    />
                    How to complete this guide
                  </h4>
                  <ul className="text-[11px] leading-relaxed text-[var(--sb-ink-muted)] list-disc pl-4 space-y-1">
                    <li>Read the official documentation in the second tab.</li>
                    <li>
                      Go through the curated articles and training videos.
                    </li>
                    <li>Attempt the practice challenges.</li>
                    <li>
                      Add your study notes to persist your learnings locally.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="h-full flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)]">
                  My Study Notes
                </span>
                <textarea
                  placeholder="Type or paste markdown study notes here... Auto-saves locally."
                  value={noteText}
                  onChange={(e) => handleNoteSave(e.target.value)}
                  className="flex-1 w-full min-h-[300px] text-xs p-3 rounded-xl border border-[var(--card-border)] bg-[var(--page-bg)]/30 focus-visible:ring-1 focus-visible:ring-[var(--sb-accent)] focus-visible:border-[var(--sb-accent)] focus-visible:outline-none resize-none font-mono"
                  style={{
                    border: "1px solid var(--card-border)",
                  }}
                />
              </div>
            )}

            {activeTab !== "overview" && activeTab !== "notes" && (
              <div className="space-y-3">
                {filteredResources.length === 0 ? (
                  <div className="border border-dashed border-[var(--card-border)] rounded-xl py-12 flex flex-col items-center justify-center text-center p-4">
                    <Icons.FileQuestion
                      size={24}
                      className="text-[var(--sb-ink-dim)] mb-2"
                    />
                    <p className="text-xs font-bold text-[var(--sb-ink-muted)]">
                      No resources added
                    </p>
                    <p className="text-[10px] text-[var(--sb-ink-dim)] mt-1 max-w-[200px] leading-snug">
                      We haven't added resources for this category yet. Check
                      other tabs.
                    </p>
                  </div>
                ) : (
                  filteredResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-4 rounded-xl border border-[var(--card-border)] hover:border-[var(--sb-accent)]/30 bg-[var(--card-bg)] hover:bg-[var(--sb-bg-hover)] transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xs font-bold text-[var(--sb-ink)] group-hover:text-[var(--sb-accent)] transition-colors leading-snug">
                          {res.title}
                        </h4>
                        <Icons.ArrowUpRight
                          size={14}
                          className="text-[var(--sb-ink-dim)] group-hover:text-[var(--sb-accent)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--sb-ink-dim)] mt-3">
                        <span className="flex items-center gap-1">
                          <Icons.Globe size={9} />
                          {res.source}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Icons.Clock size={9} />
                          {res.duration}
                        </span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions Area */}
          <div className="p-5 border-t border-[var(--card-border)]/50 flex gap-3 shrink-0 bg-[var(--page-bg)]/10">
            <Button
              onClick={() => {
                const nextStatus = isCompleted ? "not_started" : "completed";
                onToggleCompletion(nodeId, roadmap.id, nextStatus);
              }}
              className={cn(
                "flex-1 h-10 rounded-xl text-xs font-semibold select-none cursor-pointer active:scale-97 transition-all border-0",
                isCompleted
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500"
                  : "bg-[var(--sb-accent)] text-white hover:opacity-90",
              )}
            >
              {isCompleted ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Icons.CheckCircle2 size={14} strokeWidth={2.5} />
                  Mark Uncompleted
                </span>
              ) : (
                "Mark as Completed"
              )}
            </Button>

            {nextNodeObj && (
              <Button
                onClick={() => {
                  // Auto-complete current node if not already done, then go next
                  if (!isCompleted) {
                    onToggleCompletion(nodeId, roadmap.id, "completed");
                  }
                  onSelectNode?.(nextNodeObj.id);
                }}
                className="h-10 rounded-xl text-xs font-semibold px-4 border border-[var(--card-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] cursor-pointer select-none active:scale-97 transition-all bg-transparent"
              >
                <span className="flex items-center gap-1.5">
                  Next Chapter
                  <Icons.ArrowRight size={13} />
                </span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default ResourcePanel;
