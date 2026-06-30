import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import {
  useBookmarks,
  useCourses,
  useEnrollInCourse,
  useToggleCourseBookmark,
} from "#/hooks/use-courses";
import { CourseCard } from "#/components/courses/course-card";

export const Route = createFileRoute("/_app/courses/")({
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const enrollMutation = useEnrollInCourse();
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleCourseBookmark();
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
            <CourseCard
              key={course.id}
              course={course}
              isBookmarked={bookmarks?.courses.includes(course.id) ?? false}
              onToggleBookmark={(id) => toggleBookmark.mutate(id)}
              onEnroll={(id) => enrollMutation.mutate(id)}
              isEnrollPending={enrollMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
