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
  PlayCircle,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAssessmentsCategory } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/assessments/$type")({
  component: AssessmentsTypePage,
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

function AssessmentsTypePage() {
  const { type } = Route.useParams();
  const { data: category, isLoading, error } = useAssessmentsCategory(type);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");

  const progress = useMemo(() => {
    if (!category) return 0;
    return category.totalQuestions > 0
      ? Math.round(
          (category.completedQuestions / category.totalQuestions) * 100,
        )
      : 0;
  }, [category]);

  const processedSubtopics = useMemo(() => {
    if (!category) return [];

    let list = [...category.subtopics];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.description.toLowerCase().includes(q),
      );
    }

    if (difficultyFilter !== "All") {
      list = list.filter((sub) => sub.difficulty === difficultyFilter);
    }

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
          Assessment category not found or failed to load.
        </p>
        <Link
          to="/practice/assessments"
          className="text-xs font-semibold text-[var(--sb-accent)] hover:underline"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-2 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/practice/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Assessments Hub
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
            {category.title}
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
              Completed Progress
            </span>
            <span className="text-[var(--sb-accent)]">{progress}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ background: "var(--sb-border)" }}
          >
            <div
              className="h-full rounded-full bg-[var(--sb-accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
            {category.completedQuestions} / {category.totalQuestions} cleared
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between pb-2">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-xs rounded-lg border outline-none transition-all focus:border-[var(--sb-accent)] focus:ring-1 focus:ring-[var(--sb-accent)]/50"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="text-zinc-400 size-3.5" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg border outline-none text-xs"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--sb-ink)",
              }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="text-zinc-400 size-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-2.5 rounded-lg border outline-none text-xs"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--sb-ink)",
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="progress">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subtopics Listing */}
      <div className="space-y-4">
        {processedSubtopics.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl border border-dashed"
            style={{ borderColor: "var(--sb-border)" }}
          >
            <p className="text-xs" style={{ color: "var(--sb-ink-muted)" }}>
              No challenges found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {processedSubtopics.map((sub, idx) => {
              const difficultyColors = {
                Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
              };

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={sub.id}
                  className="flex items-start gap-4 rounded-xl border p-4 hover:shadow-xs transition-all"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  {/* Status Indicator */}
                  <div className="pt-0.5 shrink-0">
                    {sub.status === "completed" ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : sub.status === "in_progress" ? (
                      <Clock className="size-5 text-amber-500" />
                    ) : (
                      <Circle className="size-5 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className="text-sm font-semibold tracking-tight"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {sub.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColors[sub.difficulty]}`}
                      >
                        {sub.difficulty}
                      </span>
                    </div>

                    <p
                      className="text-xs max-w-3xl leading-relaxed"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {sub.description}
                    </p>

                    <div
                      className="pt-1.5 flex items-center gap-4 text-[10px]"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      <span>{sub.questionCount} Problems</span>
                      <span className="capitalize">
                        Status: {sub.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 self-center">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] hover:bg-[var(--sb-accent)]/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <PlayCircle size={14} />
                      Start Test
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
