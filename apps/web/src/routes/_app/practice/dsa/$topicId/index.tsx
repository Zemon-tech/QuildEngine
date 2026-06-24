import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProblemFilters } from "#/components/dsa/problem-filters";
import { ProblemTable } from "#/components/dsa/problem-table";
import { TopicStats } from "#/components/dsa/topic-stats";
import { type DSAProblem, dsaProblems } from "#/lib/dsa-problems-db";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/")({
  component: PracticeBoardTab,
});

/**
 * Practice Board tab — /practice/dsa/$topicId
 * Renders the problem table, subtopic sidebar, filters, and workspace drawer.
 */
function PracticeBoardTab() {
  const navigate = useNavigate();
  const { topicId } = Route.useParams();
  const [localProblems, setLocalProblems] = useState<DSAProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subtopicFilter, setSubtopicFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Sync problems when topic changes
  useEffect(() => {
    const list = dsaProblems[topicId] || [];
    setLocalProblems(list);
    setSubtopicFilter("All");
    setCompanyFilter("All");
  }, [topicId]);

  const availableSubtopics = useMemo(() => {
    const set = new Set<string>();
    for (const prob of localProblems) {
      set.add(prob.subCategory);
    }
    return Array.from(set);
  }, [localProblems]);

  const subtopicStats = useMemo(() => {
    const statsMap: Record<string, { total: number; solved: number }> = {};
    for (const prob of localProblems) {
      if (!statsMap[prob.subCategory]) {
        statsMap[prob.subCategory] = { total: 0, solved: 0 };
      }
      statsMap[prob.subCategory].total += 1;
      if (prob.status === "completed") {
        statsMap[prob.subCategory].solved += 1;
      }
    }
    return statsMap;
  }, [localProblems]);

  const handleToggleBookmark = (id: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );
  };

  const handleToggleStatus = (id: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          let nextStatus: "completed" | "in_progress" | "not_started";
          if (p.status === "not_started") nextStatus = "in_progress";
          else if (p.status === "in_progress") nextStatus = "completed";
          else nextStatus = "not_started";
          return { ...p, status: nextStatus };
        }
        return p;
      }),
    );
  };

  const processedProblems = useMemo(() => {
    let result = [...localProblems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (difficultyFilter !== "All") {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (subtopicFilter !== "All") {
      result = result.filter((p) => p.subCategory === subtopicFilter);
    }

    if (companyFilter !== "All") {
      result = result.filter((p) => p.companies?.includes(companyFilter));
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "difficulty") {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      if (sortBy === "acceptance") return b.acceptance - a.acceptance;
      if (sortBy === "status") {
        const statusWeight = { completed: 1, in_progress: 2, not_started: 3 };
        return statusWeight[a.status] - statusWeight[b.status];
      }
      return 0;
    });

    return result;
  }, [
    localProblems,
    searchQuery,
    difficultyFilter,
    statusFilter,
    subtopicFilter,
    companyFilter,
    sortBy,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Stats Summary Grid */}
      <div className="lg:col-span-12">
        <TopicStats problems={localProblems} currentStreak={6} />
      </div>

      {/* Left Column: Subtopic Sidebar — sticky while scrolling */}
      <div className="lg:col-span-3 flex flex-col gap-4 sticky top-[58px] z-30 bg-[var(--background)] pr-2 self-start">
        <div
          className="rounded-2xl border p-4 space-y-3.5"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div
            className="flex items-center justify-between pb-2 border-b"
            style={{ borderColor: "var(--sb-border)" }}
          >
            <h4
              className="font-bold text-xs"
              style={{ color: "var(--sb-ink)" }}
            >
              Syllabus Path
            </h4>
            <span className="text-[10px] font-bold text-zinc-400">
              {availableSubtopics.length} Sections
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {/* "All Subtopics" button */}
            <button
              type="button"
              onClick={() => setSubtopicFilter("All")}
              className={`w-full rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none ${
                subtopicFilter === "All"
                  ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                  : "text-[var(--sb-ink-muted)] hover:bg-zinc-50 dark:hover:bg-zinc-800/20"
              }`}
            >
              <span>All Subtopics</span>
              <span className="text-[10px] font-bold opacity-60">
                {localProblems.length}
              </span>
            </button>

            {/* Subtopics list */}
            {availableSubtopics.map((sub) => {
              const subStats = subtopicStats[sub] || { total: 0, solved: 0 };
              const isCompleted =
                subStats.total > 0 && subStats.solved === subStats.total;
              const isActive = subtopicFilter === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubtopicFilter(sub)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none ${
                    isActive
                      ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                      : "text-[var(--sb-ink-muted)] hover:bg-zinc-50 dark:hover:bg-zinc-800/20"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {isCompleted ? (
                      <Check className="text-emerald-500 size-3 shrink-0" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                    )}
                    <span className="truncate">{sub}</span>
                  </span>
                  <span className="text-[10px] font-bold opacity-60">
                    {subStats.solved}/{subStats.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Search, Filters & Problems Table */}
      <div className="lg:col-span-9 flex flex-col gap-5">
        <ProblemFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          difficulty={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          subtopic={subtopicFilter}
          onSubtopicChange={setSubtopicFilter}
          company={companyFilter}
          onCompanyChange={setCompanyFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableSubtopics={availableSubtopics}
        />

        <ProblemTable
          problems={processedProblems}
          onToggleStatus={handleToggleStatus}
          onToggleBookmark={handleToggleBookmark}
          onSelectProblem={(problem) => {
            navigate({
              to: "/practice/problem/$problemId",
              params: { problemId: problem.id.toString() },
            });
          }}
        />
      </div>
    </div>
  );
}
