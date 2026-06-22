import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/courses/$courseId/modules/$moduleId/",
)({
  component: ModulePage,
});

function ModulePage() {
  const { courseId, moduleId } = Route.useParams();
  return (
    <div className="mx-auto max-w-3xl">
      <h1
        className="text-2xl font-bold"
        style={{
          color: "var(--sb-ink)",
          fontFamily: "'Fraunces', Georgia, serif",
        }}
      >
        Module: {moduleId}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
        Course: {courseId}
      </p>
    </div>
  );
}
