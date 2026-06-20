import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/courses/$courseId/modules/$moduleId/lessons/$lessonId/")({
  component: LessonPage,
});

function LessonPage() {
  const { courseId, moduleId, lessonId } = Route.useParams();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>
        Lesson: {lessonId}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
        Module: {moduleId} · Course: {courseId}
      </p>
    </div>
  );
}
