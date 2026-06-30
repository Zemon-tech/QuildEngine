import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookOpen, Clock, Star } from "lucide-react";

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    rating: number;
    totalHours: string;
    author: string;
    enrolled: boolean;
    progress: number;
    completedLessons?: number;
    totalLessons: number;
  };
  isBookmarked: boolean;
  onToggleBookmark: (courseId: string) => void;
  onEnroll: (courseId: string) => void;
  isEnrollPending: boolean;
}

export function CourseCard({
  course,
  isBookmarked,
  onToggleBookmark,
  onEnroll,
  isEnrollPending,
}: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="stagger-item flex flex-col gap-4 rounded-xl p-5 border transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background:
          "linear-gradient(165deg, var(--surface-strong), var(--surface))",
        borderColor: "var(--line)",
        boxShadow:
          "0 1px 0 var(--inset-glint) inset, 0 4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Card Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
              course.difficulty === "Advanced"
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : course.difficulty === "Intermediate"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
            }`}
          >
            {course.difficulty}
          </span>
          <h3
            className="font-bold text-base leading-tight mt-1"
            style={{ color: "var(--sb-ink)" }}
          >
            {course.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(course.id);
            }}
            className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] active:scale-95 text-[var(--sb-ink-muted)] hover:text-[var(--sb-accent)] transition-all cursor-pointer"
          >
            <Bookmark
              size={14}
              className={
                isBookmarked ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]" : ""
              }
            />
          </button>
          <div
            className={`size-10 rounded-xl bg-gradient-to-br ${course.thumbnail} border flex items-center justify-center font-bold text-lg text-[var(--sb-accent)]`}
          >
            {course.title.slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-xs line-clamp-3 leading-relaxed"
        style={{ color: "var(--sb-ink-muted)" }}
      >
        {course.description}
      </p>

      {/* Metadata */}
      <div className="mt-auto space-y-4">
        <div
          className="flex items-center justify-between text-xs border-t border-[var(--sb-border)] pt-3"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.totalHours}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            {course.rating}
          </span>
          <span className="flex items-center gap-1 text-[var(--sb-accent)] font-semibold">
            <BookOpen size={12} />
            {course.totalLessons} Lessons
          </span>
        </div>

        {/* Progress or Enrollment action */}
        {course.enrolled ? (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold text-[var(--sb-ink-dim)]">
              <span>
                Completed {course.completedLessons || 0} / {course.totalLessons}
              </span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--sb-pill)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${course.progress}%`,
                  background: "var(--sb-accent)",
                }}
              />
            </div>
            <button
              onClick={() => navigate({ to: `/courses/${course.id}` })}
              className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-active)] active:scale-[0.98] border border-[var(--sb-border)] transition-all flex items-center justify-center gap-1"
            >
              Resume Learning
            </button>
          </div>
        ) : (
          <button
            disabled={isEnrollPending}
            onClick={() => onEnroll(course.id)}
            className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer text-white hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            style={{
              background: "var(--sb-accent)",
              color: "var(--sb-accent-foreground)",
            }}
          >
            {isEnrollPending ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
}
