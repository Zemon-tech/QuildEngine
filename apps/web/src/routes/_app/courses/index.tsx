import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookOpen, Clock, Filter, Search, Star } from "lucide-react";
import { useState } from "react";
import {
  useBookmarks,
  useCourses,
  useEnrollInCourse,
  useToggleCourseBookmark,
} from "#/hooks/use-courses";

export const Route = createFileRoute("/_app/courses/")({
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const enrollMutation = useEnrollInCourse();
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleCourseBookmark();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "learning">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredCourses =
    courses?.filter((course) => {
      // Filter by tab
      if (activeTab === "learning" && !course.enrolled) return false;

      // Filter by search query
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by difficulty
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    }) || [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight display-title"
          style={{
            color: "var(--sb-ink)",
          }}
        >
          Courses Catalog
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Expand your knowledge by browsing all available courses or checking
          your active learning streams.
        </p>
      </div>

      {/* Filters & Tabs Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--sb-border)]">
        {/* Tabs */}
        <div className="flex bg-[var(--sb-pill)] p-1 rounded-lg border border-[var(--sb-border)] self-start">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "learning"
                ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            My Learning
          </button>
        </div>

        {/* Search & Difficulty Filter */}
        <div className="flex flex-1 max-w-xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-[var(--sb-ink-dim)]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--sb-bg)] pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--sb-border)] focus:outline-none focus:ring-1 focus:ring-[var(--sb-accent)]/50 text-[var(--sb-ink)]"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--sb-bg)] px-3 py-2 rounded-lg border border-[var(--sb-border)]">
            <Filter size={12} className="text-[var(--sb-ink-dim)]" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-[var(--sb-ink)]"
            >
              <option
                value="all"
                className="bg-[var(--sb-bg)] text-[var(--sb-ink)]"
              >
                All Difficulties
              </option>
              <option
                value="beginner"
                className="bg-[var(--sb-bg)] text-[var(--sb-ink)]"
              >
                Beginner
              </option>
              <option
                value="intermediate"
                className="bg-[var(--sb-bg)] text-[var(--sb-ink)]"
              >
                Intermediate
              </option>
              <option
                value="advanced"
                className="bg-[var(--sb-bg)] text-[var(--sb-ink)]"
              >
                Advanced
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl animate-pulse bg-[var(--sb-pill)] border border-[var(--sb-border)]"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--sb-border)] rounded-xl bg-[var(--sb-bg-hover)]/30">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            {activeTab === "learning"
              ? "You haven't enrolled in any courses yet. Browse 'All Courses' to find one!"
              : "No courses match your filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
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
                      toggleBookmark.mutate(course.id);
                    }}
                    className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-accent)] transition-colors cursor-pointer"
                  >
                    <Bookmark
                      size={14}
                      className={
                        bookmarks?.courses.includes(course.id)
                          ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]"
                          : ""
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
                        Completed {course.completedLessons} /{" "}
                        {course.totalLessons}
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
                      className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-active)] border border-[var(--sb-border)] transition-colors flex items-center justify-center gap-1"
                    >
                      Resume Learning
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={enrollMutation.isPending}
                    onClick={() => enrollMutation.mutate(course.id)}
                    className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer text-white transition-opacity flex items-center justify-center gap-1.5"
                    style={{
                      background: "var(--sb-accent)",
                      color: "var(--sb-accent-foreground)",
                    }}
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
