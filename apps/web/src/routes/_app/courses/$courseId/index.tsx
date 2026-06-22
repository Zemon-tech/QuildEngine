import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Play, BookOpen, Clock, Star, ArrowLeft, CheckCircle2, Circle, Bookmark } from "lucide-react";
import { useCourse, useEnrollInCourse, useToggleLessonCompletion, useBookmarks, useToggleLessonBookmark } from "#/hooks/use-courses";
import { useState } from "react";

export const Route = createFileRoute("/_app/courses/$courseId/")({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const { data: course, isLoading, error } = useCourse(courseId);
  const enrollMutation = useEnrollInCourse();
  const toggleLessonMutation = useToggleLessonCompletion();
  const { data: bookmarks } = useBookmarks();
  const toggleLessonBookmark = useToggleLessonBookmark();
  const navigate = useNavigate();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "arrays-strings": true,
    "load-balancers": true,
    "react-fiber": true,
    "kernel-bootstrapping": true,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-4xl p-12 text-center animate-pulse">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading course</h2>
        <Link to="/courses" className="mt-4 inline-block text-xs font-bold underline">Back to Catalog</Link>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Find first uncompleted lesson
  const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  const firstUncompleted = allLessons.find(l => !course.completedLessonIds.includes(l.id)) || allLessons[0];

  const handleStartResume = () => {
    if (!course.enrolled) {
      enrollMutation.mutate(course.id, {
        onSuccess: () => {
          if (firstUncompleted) {
            navigate({
              to: `/courses/${course.id}/modules/${firstUncompleted.moduleId}/lessons/${firstUncompleted.id}`,
            });
          }
        }
      });
    } else if (firstUncompleted) {
      navigate({
        to: `/courses/${course.id}/modules/${firstUncompleted.moduleId}/lessons/${firstUncompleted.id}`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
      >
        <ArrowLeft size={14} /> Back to Courses
      </Link>

      {/* Course Hero Banner */}
      <div
        className="stagger-item rounded-2xl p-6 md:p-8 border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--surface-strong), var(--surface))",
          borderColor: "var(--line)",
          boxShadow: "0 1px 0 var(--inset-glint) inset, 0 10px 30px rgba(0,0,0,0.02)"
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {course.difficulty}
            </span>
            <h1
              className="text-3xl font-extrabold tracking-tight display-title"
              style={{ color: "var(--sb-ink)" }}
            >
              {course.title}
            </h1>
            <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--sb-ink-muted)" }}>
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2" style={{ color: "var(--sb-ink-dim)" }}>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {course.totalHours}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {course.totalLessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                {course.rating} Rating
              </span>
              <span className="flex items-center gap-2">
                <span>Instructed by <strong className="text-[var(--sb-ink)]">{course.author}</strong></span>
                <Link
                  to="/courses/$courseId/articles"
                  params={{ courseId: course.id }}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[var(--sb-pill)] text-[var(--sb-accent)] border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen size={10} /> Articles
                </Link>
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[var(--sb-pill)] p-5 rounded-xl border border-[var(--sb-border)] min-w-[240px] text-center space-y-4">
            {course.enrolled ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[var(--sb-ink-muted)]">Progress</span>
                  <span className="font-bold text-[var(--sb-accent)]">{course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-[var(--sb-bg)] rounded-full overflow-hidden border border-[var(--sb-border)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${course.progress}%`,
                      background: "var(--sb-accent)"
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--sb-ink-muted)]">Get full lifetime access to curriculum resources and lessons.</p>
            )}

            <button
              onClick={handleStartResume}
              className="w-full py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-opacity flex items-center justify-center gap-2 text-white"
              style={{
                background: "var(--sb-accent)",
                color: "var(--sb-accent-foreground)"
              }}
            >
              <Play size={14} className="fill-current" />
              {course.enrolled 
                ? (course.progress === 0 ? "Start Learning" : "Resume Learning") 
                : (enrollMutation.isPending ? "Enrolling..." : "Enroll & Start")}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Syllabus Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold display-title" style={{ color: "var(--sb-ink)" }}>
          Course Syllabus
        </h2>

        <div className="flex flex-col gap-4">
          {course.modules.map((module, i) => {
            const isExpanded = expandedModules[module.id] ?? false;

            return (
              <div
                key={module.id}
                className="stagger-item rounded-xl border overflow-hidden"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--line)",
                }}
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 bg-[var(--sb-pill)] text-left cursor-pointer hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-7 items-center justify-center rounded-lg text-xs font-black"
                      style={{
                        background: "var(--sb-bg)",
                        color: "var(--sb-accent)",
                        border: "1px solid var(--sb-border)"
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--sb-ink)" }}>
                        {module.title}
                      </h3>
                      <p className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
                        {module.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--sb-ink-dim)" }}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Module Lessons List */}
                {isExpanded && (
                  <div className="divide-y divide-[var(--sb-border)]">
                    {module.lessons.map((lesson) => {
                      const isCompleted = course.completedLessonIds.includes(lesson.id);

                      const handleCheckboxClick = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (!course.enrolled) return;
                        toggleLessonMutation.mutate({ courseId: course.id, lessonId: lesson.id });
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
                          className={`flex items-center justify-between p-4 text-xs transition-colors ${
                            course.enrolled ? "hover:bg-[var(--sb-bg-hover)] cursor-pointer" : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleCheckboxClick}
                              className="text-[var(--sb-accent)] hover:scale-105 transition-transform"
                              disabled={!course.enrolled}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="fill-[var(--sb-accent)] text-[var(--sb-bg)]" />
                              ) : (
                                <Circle size={16} className="text-[var(--sb-ink-dim)]" />
                              )}
                            </button>
                            <span className="font-medium" style={{ color: "var(--sb-ink)" }}>
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-[var(--sb-ink-dim)]">
                            {course.enrolled && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLessonBookmark.mutate({
                                    courseId: course.id,
                                    moduleId: module.id,
                                    lessonId: lesson.id,
                                    title: lesson.title,
                                    courseTitle: course.title,
                                  });
                                }}
                                className="p-1 rounded hover:bg-[var(--sb-bg-active)] hover:text-[var(--sb-accent)] transition-colors cursor-pointer text-[var(--sb-ink-dim)]"
                              >
                                <Bookmark size={13} className={bookmarks?.lessons.some(l => l.lessonId === lesson.id) ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]" : ""} />
                              </button>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
