import { createFileRoute } from "@tanstack/react-router";
import { useDSAProblems } from "#/hooks/use-practice";
import { Code2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/practice/")({
  component: PracticePage,
});

function PracticePage() {
  const { data: dsa } = useDSAProblems();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>
          Practice
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Sharpen your skills with DSA problems, Q&A, case studies, and tests.
        </p>
      </div>

      {dsa && (
        <div className="stagger-item mb-6 rounded-xl p-5" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={16} style={{ color: "var(--sb-accent)" }} />
              <span className="font-semibold" style={{ color: "var(--sb-ink)" }}>DSA Problems</span>
            </div>
            <span className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>
              {dsa.solved} / {dsa.total} solved
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dsa.categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: "oklch(1 0 0 / 0.04)" }}>
                <CheckCircle2 size={14} style={{ color: cat.solved > 0 ? "var(--sb-accent)" : "var(--sb-ink-dim)" }} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--sb-ink)" }}>{cat.name}</p>
                  <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>{cat.solved}/{cat.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
