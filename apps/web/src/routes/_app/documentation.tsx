import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/documentation")({
  component: DocumentationPage,
});
function DocumentationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1
        className="text-2xl font-bold"
        style={{
          color: "var(--sb-ink)",
          fontFamily: "'Fraunces', Georgia, serif",
        }}
      >
        Documentation
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
        Platform docs, API reference, and guides.
      </p>
    </div>
  );
}
