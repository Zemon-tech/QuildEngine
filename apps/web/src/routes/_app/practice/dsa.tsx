import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/practice/dsa")({ component: DSAPage });
function DSAPage() {
  return <PlaceholderPage title="Data Structures & Algorithms" subtitle="Practice arrays, trees, graphs, DP, and more." />;
}
function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>{title}</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>{subtitle}</p>
    </div>
  );
}
