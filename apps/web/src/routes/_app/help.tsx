import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/help")({ component: HelpPage });

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1
        className="text-2xl font-bold"
        style={{
          color: "var(--sb-ink)",
          fontFamily: "'Fraunces', Georgia, serif",
        }}
      >
        Help & Support
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
        Get help, read FAQs, or reach out to support.
      </p>
    </div>
  );
}
