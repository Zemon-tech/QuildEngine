import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useCourses } from "#/hooks/use-courses";

export const Route = createFileRoute("/_app/courses/")({
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses } = useCourses();

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
          Coures
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Browse and continue your learning paths.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="stagger-item flex flex-col gap-3 rounded-xl p-4"
            style={{
              background: "oklch(1 0 0 / 0.04)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ background: "var(--sb-pill)" }}
            >
              <BookOpen size={18} style={{ color: "var(--sb-accent)" }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "var(--sb-ink)" }}>
                {course.title}
              </h2>
              <p
                className="mt-0.5 text-sm"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                {course.completedLessons} / {course.totalLessons} lessons
              </p>
            </div>
            <div className="mt-auto">
              <div
                className="mb-1.5 h-1 w-full overflow-hidden rounded-full"
                style={{ background: "oklch(1 0 0 / 0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${course.progress}%`,
                    background: "var(--sb-accent)",
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
                {course.progress}% complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
