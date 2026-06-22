import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/learn/roadmaps")({
  component: RoadmapsPage,
});
function RoadmapsPage() {
  return (
    <PlaceholderPage
      title="Roadmaps"
      subtitle="Structured learning paths to master any skill."
    />
  );
}
function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{
          color: "var(--sb-ink)",
          fontFamily: "'Fraunces', Georgia, serif",
        }}
      >
        {title}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
        {subtitle}
      </p>
      <div className="mt-8 flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="stagger-item h-16 rounded-xl"
            style={{
              background: "oklch(1 0 0 / 0.04)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
