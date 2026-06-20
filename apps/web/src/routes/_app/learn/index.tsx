import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, FileText, Map, StickyNote } from "lucide-react";

export const Route = createFileRoute("/_app/learn/")({
  component: LearnPage,
});

const sections = [
  { icon: ScrollText, label: "Tutorials", count: 142, desc: "Step-by-step coding tutorials" },
  { icon: FileText, label: "Articles", count: 380, desc: "In-depth technical articles" },
  { icon: Map, label: "Roadmaps", count: 18, desc: "Structured learning paths" },
  { icon: StickyNote, label: "Notes", count: 0, desc: "Your personal learning notes" },
];

function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>
          Learn
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Tutorials, articles, roadmaps, and your notes — all in one place.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map(({ icon: Icon, label, count, desc }) => (
          <div
            key={label}
            className="stagger-item flex items-center gap-4 rounded-xl p-4"
            style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}
          >
            <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: "var(--sb-pill)" }}>
              <Icon size={18} style={{ color: "var(--sb-accent)" }} />
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--sb-ink)" }}>{label}</p>
              <p className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>{desc}</p>
            </div>
            <span className="ml-auto text-lg font-bold" style={{ color: "var(--sb-accent)" }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
