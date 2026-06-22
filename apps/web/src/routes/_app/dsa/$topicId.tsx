import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  HelpCircle,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDSACategory } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/dsa/$topicId")({
  component: DSATopicPage,
});

type DifficultyType = "Easy" | "Medium" | "Hard";
type StatusType = "completed" | "in_progress" | "not_started";

const diffWeight: Record<DifficultyType, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const statusWeight: Record<StatusType, number> = {
  completed: 1,
  in_progress: 2,
  not_started: 3,
};

function DSATopicPage() {
  const { topicId } = Route.useParams();
  const { data: category, isLoading, error } = useDSACategory(topicId);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");

  // Calculate totals and progress
  const totals = useMemo(() => {
    if (!category) return { solved: 0, total: 0, progress: 0 };
    const total = category.totalProblems;
    const progress =
      total > 0 ? Math.round((category.solvedProblems / total) * 100) : 0;
    return { solved: category.solvedProblems, total, progress };
  }, [category]);

  // Process subtopics (search, filter, sort)
  const processedSubtopics = useMemo(() => {
    if (!category) return [];

    let list = [...category.subtopics];

    // 1. Search Query Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((sub) => sub.name.toLowerCase().includes(q));
    }

    // 2. Difficulty Filter
    if (difficultyFilter !== "All") {
      list = list.filter((sub) => sub.difficulty === difficultyFilter);
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "difficulty") {
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      if (sortBy === "progress") {
        return statusWeight[a.status] - statusWeight[b.status];
      }
      return 0;
    });

    return list;
  }, [category, search, difficultyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--sb-accent)] border-t-transparent" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <HelpCircle className="size-10 text-red-500" />
        <p className="text-sm font-semibold" style={{ color: "var(--sb-ink)" }}>
          Topic category not found or failed to load.
        </p>
        <Link
          to="/dsa"
          className="text-xs font-semibold text-[var(--sb-accent)] hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-2 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/dsa"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to DSA Dashboard
        </Link>
      </div>

      {/* Hero Header Area */}
      <div
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b pb-6"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <div className="space-y-1.5">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              color: "var(--sb-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            {category.name}
          </h1>
          <p
            className="max-w-2xl text-sm"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            {category.description}
          </p>
        </div>

        {/* Local Progress Metric */}
        <div
          className="flex flex-col gap-2 rounded-xl border p-4 w-[240px]"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex justify-between text-xs font-semibold">
            <span style={{ color: "var(--sb-ink-dim)" }}>
              Subtopics Progress
            </span>
            <span className="text-[var(--sb-accent)]">{totals.progress}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ background: "var(--sb-border)" }}
          >
            <div
              className="h-full rounded-full bg-[var(--sb-accent)] transition-all duration-300"
              style={{ width: `${totals.progress}%` }}
            />
          </div>
          <p
            className="text-[11px] font-medium"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Solved {totals.solved} of {totals.total} problems
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--sb-ink-dim)" }}
          />
          <input
            type="text"
            placeholder="Search subtopics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-4 py-2 text-xs outline-none transition-all focus:border-[var(--sb-accent)]"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={13} style={{ color: "var(--sb-ink-muted)" }} />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border px-3 py-2 text-xs font-medium cursor-pointer outline-none transition-all focus:border-[var(--sb-accent)]"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--sb-border)",
                color: "var(--sb-ink)",
              }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={13} style={{ color: "var(--sb-ink-muted)" }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border px-3 py-2 text-xs font-medium cursor-pointer outline-none transition-all focus:border-[var(--sb-accent)]"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--sb-border)",
                color: "var(--sb-ink)",
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Subtopic Cards */}
      {processedSubtopics.length === 0 ? (
        <div
          className="flex h-36 flex-col items-center justify-center gap-1.5 border border-dashed rounded-xl p-5 text-center"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            No subtopics matched your criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processedSubtopics.map((sub) => (
            <motion.div
              key={sub.name}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs hover:shadow-sm transition-all"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4
                    className="text-sm font-semibold truncate pr-2"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {sub.name}
                  </h4>
                  {/* Difficulty Badge */}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide border`}
                    style={{
                      backgroundColor:
                        sub.difficulty === "Easy"
                          ? "oklch(0.85 0.15 145 / 0.15)"
                          : sub.difficulty === "Medium"
                            ? "oklch(0.85 0.15 75 / 0.15)"
                            : "oklch(0.85 0.15 30 / 0.15)",
                      color:
                        sub.difficulty === "Easy"
                          ? "oklch(0.65 0.18 145)"
                          : sub.difficulty === "Medium"
                            ? "oklch(0.65 0.18 75)"
                            : "oklch(0.65 0.18 30)",
                      borderColor:
                        sub.difficulty === "Easy"
                          ? "oklch(0.65 0.18 145 / 0.25)"
                          : sub.difficulty === "Medium"
                            ? "oklch(0.65 0.18 75 / 0.25)"
                            : "oklch(0.65 0.18 30 / 0.25)",
                    }}
                  >
                    {sub.difficulty}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--sb-ink-muted)" }}>
                  {sub.problemsCount} problems available
                </p>
              </div>

              {/* Footer Status Indicators */}
              <div
                className="flex items-center justify-between border-t mt-4 pt-3.5"
                style={{ borderColor: "var(--sb-border)" }}
              >
                {sub.status === "completed" ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                    <CheckCircle2 size={13} className="shrink-0" />
                    Completed
                  </span>
                ) : sub.status === "in_progress" ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 animate-pulse">
                    <Clock size={13} className="shrink-0" />
                    In Progress
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                    <Circle size={13} className="shrink-0" />
                    Not Started
                  </span>
                )}

                <button
                  type="button"
                  className="rounded-lg border px-2 py-1 text-[10px] font-bold tracking-tight text-[var(--sb-accent)] border-[var(--sb-accent)]/20 bg-[var(--sb-accent)]/5 hover:bg-[var(--sb-accent)]/10 cursor-pointer outline-none transition-all active:scale-95"
                >
                  Solve
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
