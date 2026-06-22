import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useCourse } from "#/hooks/use-courses";

export const Route = createFileRoute("/_app/courses/$courseId/")({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const { data: course } = useCourse(courseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{
            color: "var(--sb-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          {course?.title ?? courseId}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          {course?.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {course?.modules.map((module, i) => (
          <div
            key={module.id}
            className="stagger-item flex items-center gap-4 rounded-xl px-4 py-3.5"
            style={{
              background: "oklch(1 0 0 / 0.04)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            <div
              className="flex size-8 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                background: "var(--sb-pill)",
                color: "var(--sb-accent)",
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "var(--sb-ink)" }}>
                {module.title}
              </p>
              <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
                {module.lessons} lessons
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--sb-ink-dim)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
