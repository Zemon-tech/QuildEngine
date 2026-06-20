import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/research")({ component: ResearchPage });
function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>Research</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>Saved research, reports, and your research workspace.</p>
    </div>
  );
}
