import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/practice/case-study")({ component: CaseStudyPage });
function CaseStudyPage() {
  return <PlaceholderPage title="Case Studies" subtitle="Product, system design, and business case studies." />;
}
function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>{title}</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>{subtitle}</p>
    </div>
  );
}
