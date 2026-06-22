import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardList, FileSearch, Trophy, Zap } from "lucide-react";
import { useAssessmentsCategories } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/assessments/")({
  component: AssessmentsLandingPage,
});

const iconMap: Record<string, any> = {
  "mock-tests": ClipboardList,
  assessments: FileSearch,
  "weekly-challenges": Zap,
};

const colorGradients: Record<string, string> = {
  "mock-tests":
    "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500",
  assessments:
    "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-500",
  "weekly-challenges":
    "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-500",
};

function AssessmentsLandingPage() {
  const { data: categories = [], isLoading } = useAssessmentsCategories();

  const totalQuestions = categories.reduce(
    (sum, cat) => sum + cat.totalQuestions,
    0,
  );
  const completedQuestions = categories.reduce(
    (sum, cat) => sum + cat.completedQuestions,
    0,
  );
  const overallProgress =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

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
            Assessments Hub
          </h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Measure your skills with timed mock tests, standard language
            assessments, and weekly coding challenges.
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
              {completedQuestions} / {totalQuestions}{" "}
              <span
                className="text-xs font-normal"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                Completed
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
          <ClipboardList size={18} className="text-[var(--sb-accent)]" />
          <h2 className="text-lg font-bold" style={{ color: "var(--sb-ink)" }}>
            Select Assessment Type
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.id] || ClipboardList;
            const progress =
              cat.totalQuestions > 0
                ? Math.round(
                    (cat.completedQuestions / cat.totalQuestions) * 100,
                  )
                : 0;
            const gradientClasses =
              colorGradients[cat.id] ||
              "from-neutral-500/10 to-neutral-600/10 text-neutral-500 border-neutral-500/20";

            // Completion Status
            const completionStatus =
              progress === 100
                ? "Completed"
                : progress > 0
                  ? "In Progress"
                  : "Not Started";

            return (
              <Link
                key={cat.id}
                to="/practice/assessments/$type"
                params={{ type: cat.id }}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-[240px] flex-col justify-between rounded-2xl border p-5 shadow-xs hover:shadow-md cursor-pointer select-none transition-all"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-lg font-bold tracking-tight line-clamp-1"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {cat.title}
                        </h3>
                      </div>
                      <p
                        className="line-clamp-3 text-xs leading-relaxed"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        {cat.description}
                      </p>
                    </div>

                    {/* Icon container */}
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${gradientClasses}`}
                    >
                      <IconComponent size={22} />
                    </div>
                  </div>

                  {/* Extra metadata for assessments */}
                  <div
                    className="flex gap-4 text-[10px] pb-1"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    <div>
                      <span
                        className="font-semibold block"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        Difficulty
                      </span>
                      <span>{cat.difficulty}</span>
                    </div>
                    <div>
                      <span
                        className="font-semibold block"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        Status
                      </span>
                      <span
                        className={
                          completionStatus === "In Progress"
                            ? "text-amber-500 font-semibold"
                            : completionStatus === "Completed"
                              ? "text-emerald-500 font-semibold"
                              : ""
                        }
                      >
                        {completionStatus}
                      </span>
                    </div>
                    <div>
                      <span
                        className="font-semibold block"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        Questions
                      </span>
                      <span>{cat.totalQuestions}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-end justify-between text-xs">
                      <span style={{ color: "var(--sb-ink-muted)" }}>
                        {cat.completedQuestions} / {cat.totalQuestions} tasks
                        completed
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
