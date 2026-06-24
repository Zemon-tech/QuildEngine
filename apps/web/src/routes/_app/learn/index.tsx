import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpen, Clock, Flame, Map } from "lucide-react";
import { useCourses } from "#/hooks/use-courses";

export const Route = createFileRoute("/_app/learn/")({
  component: LearnPage,
});

function LearnPage() {
  const { data: courses, isLoading } = useCourses();
  const navigate = useNavigate();

  // Filter enrolled and explore courses
  const enrolledCourses = courses?.filter((c) => c.enrolled) || [];
  const exploreCourses = courses?.filter((c) => !c.enrolled) || [];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* ─── Hero Header & Stats Banner ─────────────────────────────────── */}
      <div
        className="stagger-item rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border"
        style={{
          background:
            "linear-gradient(135deg, var(--surface-strong), var(--surface))",
          borderColor: "var(--line)",
          boxShadow:
            "0 1px 0 var(--inset-glint) inset, 0 10px 30px rgba(23, 58, 64, 0.05)",
        }}
      >
        <div className="space-y-2">
          <span
            className="text-xs font-bold uppercase tracking-widest text-[var(--sb-accent)]"
            style={{ color: "var(--kicker)" }}
          >
            Student Workspace
          </span>
          <h1
            className="text-3xl font-extrabold tracking-tight display-title"
            style={{ color: "var(--sb-ink)" }}
          >
            Welcome back, Pioneer!
          </h1>
          <p
            className="text-sm max-w-md"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Your personalized curriculum is waiting. Continue building your
            low-level programming and system design mastery.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 bg-[var(--sb-pill)] p-4 rounded-xl border border-[var(--sb-border)]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-orange-500">
              <Flame size={18} className="fill-orange-500 animate-pulse" />
              <span className="text-xl font-black">7</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[var(--sb-ink-dim)]">
              Daily Streak
            </p>
          </div>
          <div className="text-center border-x border-[var(--sb-border)] px-4">
            <div className="flex items-center justify-center gap-1.5 text-[var(--sb-accent)]">
              <Award size={18} />
              <span className="text-xl font-black">47</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[var(--sb-ink-dim)]">
              Lessons Done
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-teal-600 dark:text-teal-400">
              <Clock size={18} />
              <span className="text-xl font-black">23h</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[var(--sb-ink-dim)]">
              Spent Time
            </p>
          </div>
        </div>
      </div>

      {/* ─── My Enrolled Courses (My Learning) ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold display-title flex items-center gap-2"
            style={{ color: "var(--sb-ink)" }}
          >
            <BookOpen size={20} className="text-[var(--sb-accent)]" />
            My Active Courses
          </h2>
          {enrolledCourses.length > 0 && (
            <Link
              to="/courses"
              className="text-xs font-semibold hover:underline flex items-center gap-1 text-[var(--sb-accent)]"
            >
              View all courses <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse bg-[var(--sb-pill)] border border-[var(--sb-border)]"
              />
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div
            className="stagger-item rounded-xl p-8 text-center border border-dashed flex flex-col items-center justify-center gap-4 bg-[var(--sb-bg-hover)]/30"
            style={{ borderColor: "var(--sb-border)" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              You haven't enrolled in any courses yet. Start your journey today!
            </p>
            <Link
              to="/courses"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--sb-accent)] text-white hover:opacity-90 transition-opacity"
              style={{ background: "var(--sb-accent)", color: "var(--sb-bg)" }}
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="stagger-item flex flex-col gap-4 rounded-xl p-5 border transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background:
                    "linear-gradient(165deg, var(--surface-strong), var(--surface))",
                  borderColor: "var(--line)",
                  boxShadow:
                    "0 1px 0 var(--inset-glint) inset, 0 4px 12px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      {course.difficulty}
                    </span>
                    <h3
                      className="font-bold text-base leading-tight mt-1"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {course.title}
                    </h3>
                    <p
                      className="text-xs line-clamp-1"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      by {course.author}
                    </p>
                  </div>
                  <div
                    className={`size-10 rounded-xl bg-gradient-to-br ${course.thumbnail} border flex items-center justify-center font-bold text-lg text-[var(--sb-accent)]`}
                  >
                    {course.title.slice(0, 2)}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[var(--sb-ink-muted)]">
                        {course.completedLessons} / {course.totalLessons}{" "}
                        Lessons
                      </span>
                      <span className="font-bold text-[var(--sb-accent)]">
                        {course.progress}%
                      </span>
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
                  </div>

                  <button
                    onClick={() =>
                      navigate({
                        to: "/courses/$courseId",
                        params: { courseId: course.id },
                      })
                    }
                    className="w-full py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-[var(--sb-border)] cursor-pointer bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-active)]"
                  >
                    Resume Course
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Explore Courses Catalog ───────────────────────────────────── */}
      {exploreCourses.length > 0 && (
        <div className="space-y-4">
          <h2
            className="text-xl font-bold display-title flex items-center gap-2"
            style={{ color: "var(--sb-ink)" }}
          >
            <Award size={20} className="text-amber-500" />
            Explore Courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCourses.map((course) => (
              <div
                key={course.id}
                className="stagger-item flex flex-col gap-4 rounded-xl p-5 border transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background:
                    "linear-gradient(165deg, var(--surface-strong), var(--surface))",
                  borderColor: "var(--line)",
                  boxShadow:
                    "0 1px 0 var(--inset-glint) inset, 0 4px 12px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {course.difficulty}
                    </span>
                    <h3
                      className="font-bold text-base leading-tight mt-1"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {course.title}
                    </h3>
                  </div>
                  <div
                    className={`size-10 rounded-xl bg-gradient-to-br ${course.thumbnail} border flex items-center justify-center font-bold text-lg text-[var(--sb-accent)]`}
                  >
                    {course.title.slice(0, 2)}
                  </div>
                </div>

                <p
                  className="text-xs line-clamp-2"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  {course.description}
                </p>

                <div
                  className="mt-auto pt-2 border-t border-[var(--sb-border)] flex items-center justify-between text-xs"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  <span>{course.totalHours}</span>
                  <span className="flex items-center gap-1">
                    ⭐ {course.rating}
                  </span>
                </div>

                <Link
                  to="/courses/$courseId"
                  params={{ courseId: course.id }}
                  className="w-full py-2 text-xs font-bold rounded-lg text-center transition-colors border border-[var(--sb-border)] bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)]"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Learning Roadmaps ────────────────────────────────────────── */}
      <div
        className="stagger-item rounded-xl p-6 border flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background:
            "linear-gradient(165deg, var(--surface-strong), var(--surface))",
          borderColor: "var(--line)",
          boxShadow: "0 1px 0 var(--inset-glint) inset",
        }}
      >
        <div className="flex gap-4 items-start">
          <div className="size-12 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Map size={24} />
          </div>
          <div className="space-y-1">
            <h3
              className="font-bold text-lg"
              style={{ color: "var(--sb-ink)" }}
            >
              Learning Roadmaps
            </h3>
            <p
              className="text-xs max-w-xl"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Navigate your computer science journey with interactive timelines
              guiding you from programming core fundamentals to expert backend
              and systems roles.
            </p>
          </div>
        </div>
        <Link
          to="/learn/roadmaps"
          className="px-5 py-2 text-xs font-bold rounded-lg text-white shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: "var(--sb-accent)", color: "var(--sb-bg)" }}
        >
          Explore Roadmaps
        </Link>
      </div>
    </div>
  );
}
