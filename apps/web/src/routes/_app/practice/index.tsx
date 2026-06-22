import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Code2,
} from "lucide-react";
import { useDSAProblems } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/")({
  component: PracticePage,
});

const SECTIONS = [
  {
    to: "/practice/dsa" as const,
    label: "Algorithms & DSA",
    description: "Master data structures and algorithm patterns.",
    icon: Code2,
    color: "text-blue-500",
    bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
  },
  {
    to: "/practice/interview-qa" as const,
    label: "Interview Q&A",
    description: "Technical, behavioral, and AI-generated Q&A.",
    icon: Brain,
    color: "text-violet-500",
    bg: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
  },
  {
    to: "/practice/case-studies" as const,
    label: "Case Studies",
    description: "Real-world product, system-design & business cases.",
    icon: Briefcase,
    color: "text-amber-500",
    bg: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
  },
  {
    to: "/practice/assessments" as const,
    label: "Assessments",
    description: "Timed mock tests and weekly coding challenges.",
    icon: ClipboardList,
    color: "text-emerald-500",
    bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  },
] as const;

function PracticePage() {
  const { data: dsa } = useDSAProblems();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{
            color: "var(--sb-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          Practice
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Sharpen your skills with DSA problems, Q&A, case studies, and tests.
        </p>
      </div>

      {/* Quick navigation cards using TanStack Router Link */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.to}
              to={section.to}
              className="block rounded-xl border p-4 hover:shadow-sm transition-all"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${section.bg} ${section.color}`}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {section.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {dsa && (
        <div
          className="stagger-item mb-6 rounded-xl p-5"
          style={{
            background: "oklch(1 0 0 / 0.04)",
            border: "1px solid oklch(1 0 0 / 0.08)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={16} style={{ color: "var(--sb-accent)" }} />
              <span
                className="font-semibold"
                style={{ color: "var(--sb-ink)" }}
              >
                DSA Problems
              </span>
            </div>
            <span className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>
              {dsa.solved} / {dsa.total} solved
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dsa.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{ background: "oklch(1 0 0 / 0.04)" }}
              >
                <CheckCircle2
                  size={14}
                  style={{
                    color:
                      cat.solved > 0 ? "var(--sb-accent)" : "var(--sb-ink-dim)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {cat.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
                    {cat.solved}/{cat.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
