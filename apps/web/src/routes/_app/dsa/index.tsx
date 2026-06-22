import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Binary,
  Code2,
  Coins,
  Compass,
  Cpu,
  GitBranch,
  Hash,
  Key,
  Layers,
  LineChart,
  Link2,
  ListOrdered,
  Network,
  RotateCcw,
  Search,
  SearchCode,
  Split,
  Triangle,
  Trophy,
  Type,
} from "lucide-react";
import { useDSACategories } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/dsa/")({
  component: DSALandingPage,
});

const iconMap: Record<string, any> = {
  arrays: Hash,
  strings: Type,
  "linked-list": Link2,
  stack: Layers,
  queue: ListOrdered,
  recursion: RotateCcw,
  hashing: Key,
  "binary-search": Search,
  trees: GitBranch,
  "binary-search-tree": Split,
  heap: Triangle,
  graph: Network,
  "dynamic-programming": Cpu,
  greedy: Coins,
  backtracking: Compass,
  tries: SearchCode,
  "segment-tree": LineChart,
  "bit-manipulation": Binary,
};

const colorGradients: Record<string, string> = {
  arrays: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500",
  strings:
    "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500",
  "linked-list":
    "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-500",
  stack:
    "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-500",
  queue: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-500",
  recursion:
    "from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-500",
  hashing:
    "from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20 text-fuchsia-500",
  "binary-search":
    "from-sky-500/10 to-indigo-500/10 border-sky-500/20 text-sky-500",
  trees: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 text-teal-500",
  "binary-search-tree":
    "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-500",
  heap: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-yellow-500",
  graph:
    "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-500",
  "dynamic-programming":
    "from-red-500/10 to-rose-500/10 border-red-500/20 text-rose-500",
  greedy: "from-lime-500/10 to-emerald-500/10 border-lime-500/20 text-lime-500",
  backtracking:
    "from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-500",
  tries: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-500",
  "segment-tree":
    "from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-500",
  "bit-manipulation":
    "from-zinc-500/10 to-slate-500/10 border-zinc-500/20 text-zinc-500",
};

function DSALandingPage() {
  const { data: categories = [], isLoading } = useDSACategories();

  const totalProblems = categories.reduce(
    (sum, cat) => sum + cat.totalProblems,
    0,
  );
  const solvedProblems = categories.reduce(
    (sum, cat) => sum + cat.solvedProblems,
    0,
  );
  const overallProgress =
    totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--sb-accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-2 space-y-8">
      {/* Header and Summary Panel */}
      <div
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b pb-6"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              color: "var(--sb-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            Algorithms & DSA Categories
          </h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Explore core concepts, study subtopics, and practice problems to
            master algorithms.
          </p>
        </div>

        {/* Global Progress Card */}
        <div
          className="flex items-center gap-5 rounded-2xl p-5 border shadow-sm min-w-[280px]"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--sb-accent)]/10 text-[var(--sb-accent)]">
            <Trophy size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--sb-ink-muted)" }}>
                Overall Progress
              </span>
              <span className="text-[var(--sb-accent)]">
                {overallProgress}%
              </span>
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--sb-ink)" }}
            >
              {solvedProblems} / {totalProblems}{" "}
              <span
                className="text-xs font-normal"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                Problems
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: "var(--sb-border)" }}
            >
              <div
                className="h-full rounded-full bg-[var(--sb-accent)] transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Canva-style cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-[var(--sb-accent)]" />
          <h2 className="text-lg font-bold" style={{ color: "var(--sb-ink)" }}>
            Select a Concept to Begin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.id] || Code2;
            const progress =
              cat.totalProblems > 0
                ? Math.round((cat.solvedProblems / cat.totalProblems) * 100)
                : 0;
            const gradientClasses =
              colorGradients[cat.id] ||
              "from-neutral-500/10 to-neutral-600/10 text-neutral-500 border-neutral-500/20";

            return (
              <Link
                key={cat.id}
                to="/dsa/$topicId"
                params={{ topicId: cat.id }}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-[210px] flex-col justify-between rounded-2xl border p-5 shadow-xs hover:shadow-md cursor-pointer select-none transition-all"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 pr-2">
                      <h3
                        className="text-base font-bold tracking-tight line-clamp-1"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {cat.name}
                      </h3>
                      <p
                        className="line-clamp-3 text-xs leading-relaxed"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        {cat.description}
                      </p>
                    </div>

                    {/* Styled Category Icon container */}
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${gradientClasses}`}
                    >
                      <IconComponent size={22} />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-end justify-between text-xs">
                      <span style={{ color: "var(--sb-ink-muted)" }}>
                        {cat.solvedProblems} / {cat.totalProblems} solved
                      </span>
                      <span className="font-bold text-[var(--sb-accent)]">
                        {progress}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full"
                      style={{ background: "var(--sb-border)" }}
                    >
                      <div
                        className="h-full rounded-full bg-[var(--sb-accent)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
