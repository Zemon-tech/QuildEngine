import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Play,
  Trophy,
} from "lucide-react";
import {
  useBookmarks,
  useCourse,
  useToggleLessonBookmark,
  useToggleLessonCompletion,
} from "#/hooks/use-courses";

export const Route = createFileRoute(
  "/_app/courses/$courseId/modules/$moduleId/",
)({
  component: ModulePage,
});

function ModulePage() {
  const { courseId, moduleId } = Route.useParams();
  const { data: course, isLoading, error } = useCourse(courseId);
  const toggleLessonMutation = useToggleLessonCompletion();
  const { data: bookmarks } = useBookmarks();
  const toggleLessonBookmark = useToggleLessonBookmark();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center animate-pulse text-xs font-semibold text-[var(--sb-ink-muted)]">
        Loading module overview...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading module details</h2>
        <Link
          to="/courses"
          className="mt-4 inline-block text-xs font-bold underline text-[var(--sb-accent)]"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const module = course.modules.find((m) => m.id === moduleId);

  if (!module) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Module not found</h2>
        <Link
          to="/courses/$courseId"
          params={{ courseId }}
          className="mt-4 inline-block text-xs font-bold underline text-[var(--sb-accent)]"
        >
          Back to Course Curriculum
        </Link>
      </div>
    );
  }

  // Calculate completion percentage specifically for this module
  const totalLessonsCount = module.lessons.length;
  const completedLessonsCount = module.lessons.filter((l) =>
    course.completedLessonIds.includes(l.id),
  ).length;
  const moduleProgress =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Navigation Breadcrumbs / Back button */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--sb-ink-muted)]">
        <Link
          to="/courses"
          className="hover:text-[var(--sb-ink)] transition-colors"
        >
          Courses
        </Link>
        <ChevronRight size={12} className="text-[var(--sb-ink-dim)]" />
        <Link
          to="/courses/$courseId"
          params={{ courseId }}
          className="hover:text-[var(--sb-ink)] transition-colors"
        >
          {course.title}
        </Link>
        <ChevronRight size={12} className="text-[var(--sb-ink-dim)]" />
        <span className="text-[var(--sb-ink)] font-bold">{module.title}</span>
      </div>

      <Link
        to="/courses/$courseId"
        params={{ courseId }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
      >
        <ArrowLeft size={14} /> Back to Course Syllabus
      </Link>

      {/* Module Banner / Progress Summary */}
      <div
        className="stagger-item rounded-2xl p-6 md:p-8 border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background:
            "linear-gradient(135deg, var(--surface-strong), var(--surface))",
          borderColor: "var(--line)",
          boxShadow:
            "0 1px 0 var(--inset-glint) inset, 0 10px 30px rgba(0,0,0,0.02)",
        }}
      >
        <div className="space-y-3 flex-1">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Course Module
          </span>
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-tight display-title"
            style={{ color: "var(--sb-ink)" }}
          >
            {module.title}
          </h1>
          <p
            className="text-xs md:text-sm max-w-xl leading-relaxed"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Explore core concepts, run code models, and test your understanding of the concepts covered in this module.
          </p>

          <div
            className="flex items-center gap-4 text-xs pt-1"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {totalLessonsCount} Lessons & Articles
            </span>
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <CheckCircle2 size={14} />
              {completedLessonsCount} / {totalLessonsCount} completed
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-[var(--sb-pill)] p-5 rounded-xl border border-[var(--sb-border)] min-w-[240px] space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--sb-accent)]/10 text-[var(--sb-accent)]">
              <Trophy size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]"
              >
                Module Progress
              </p>
              <p
                className="text-lg font-black"
                style={{ color: "var(--sb-ink)" }}
              >
                {moduleProgress}%
              </p>
            </div>
          </div>

          <div className="h-1.5 w-full bg-[var(--sb-bg)] rounded-full overflow-hidden border border-[var(--sb-border)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${moduleProgress}%`,
                background: "var(--sb-accent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4">
        <h2
          className="text-lg font-bold display-title"
          style={{ color: "var(--sb-ink)" }}
        >
          Curriculum Contents
        </h2>

        <div
          className="rounded-xl border divide-y overflow-hidden"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
          }}
        >
          {module.lessons.map((lesson, idx) => {
            const isCompleted = course.completedLessonIds.includes(lesson.id);
            const isVideo = lesson.type === "video";

            const handleCheckboxClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!course.enrolled) return;
              toggleLessonMutation.mutate({
                courseId: course.id,
                lessonId: lesson.id,
              });
            };

            const handleBookmarkClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!course.enrolled) return;
              toggleLessonBookmark.mutate({
                courseId: course.id,
                moduleId: module.id,
                lessonId: lesson.id,
                title: lesson.title,
                courseTitle: course.title,
              });
            };

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (!course.enrolled) return;
                  navigate({
                    to: `/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}`,
                  });
                }}
                className={`flex items-center justify-between p-4 text-xs transition-all duration-150 ${
                  course.enrolled
                    ? "hover:bg-[var(--sb-bg-hover)] cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Left Side: Index, Type Icon, Title */}
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-mono text-[var(--sb-ink-dim)] w-4 shrink-0 text-right">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <button
                    onClick={handleCheckboxClick}
                    className="text-[var(--sb-accent)] hover:scale-105 transition-transform"
                    disabled={!course.enrolled}
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        size={16}
                        className="fill-[var(--sb-accent)] text-[var(--sb-bg)]"
                      />
                    ) : (
                      <Circle size={16} className="text-[var(--sb-ink-dim)]" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {isVideo ? (
                      <Play size={13} className="text-[var(--sb-accent)] fill-current shrink-0" />
                    ) : (
                      <FileText size={13} className="text-indigo-500 shrink-0" />
                    )}
                    <span
                      className="font-semibold text-[var(--sb-ink)] hover:text-[var(--sb-accent)] transition-colors"
                    >
                      {lesson.title}
                    </span>
                  </div>
                </div>

                {/* Right Side: Bookmark, Duration, Play action indicator */}
                <div className="flex items-center gap-4 text-[var(--sb-ink-dim)]">
                  {course.enrolled && (
                    <button
                      onClick={handleBookmarkClick}
                      className="p-1 rounded hover:bg-[var(--sb-bg-active)] hover:text-[var(--sb-accent)] transition-colors cursor-pointer text-[var(--sb-ink-dim)]"
                    >
                      <Bookmark
                        size={13}
                        className={
                          bookmarks?.lessons.some((l) => l.lessonId === lesson.id)
                            ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]"
                            : ""
                        }
                      />
                    </button>
                  )}
                  <div className="flex items-center gap-1 text-[10px]">
                    <Clock size={12} />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
