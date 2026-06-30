import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, Clock, Play, Star, Trash2 } from "lucide-react";
import {
  useBookmarks,
  useCourses,
  useToggleCourseBookmark,
  useToggleLessonBookmark,
} from "#/hooks/use-courses";
import { useRoadmaps } from "#/hooks/use-roadmaps";
import { MOCK_ROADMAPS } from "#/lib/server-fns/roadmaps";

interface BookmarksSearch {
  tab?: "courses" | "lessons" | "roadmaps";
}

export const Route = createFileRoute("/_app/courses/bookmarks")({
  validateSearch: (search: Record<string, unknown>): BookmarksSearch => {
    return {
      tab:
        (search.tab as "courses" | "lessons" | "roadmaps" | undefined) ||
        "courses",
    };
  },
  component: BookmarksPage,
});

function BookmarksPage() {
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarks();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const {
    isLoading: roadmapsLoading,
    progress,
    toggleNodeBookmark,
    toggleRoadmapFavorite,
    categories,
  } = useRoadmaps();

  const toggleCourseBookmark = useToggleCourseBookmark();
  const toggleLessonBookmark = useToggleLessonBookmark();
  const navigate = Route.useNavigate();

  const { tab: activeTab = "courses" } = Route.useSearch();

  // Get full course objects for bookmarked course IDs
  const bookmarkedCourses =
    courses?.filter((c) => bookmarks?.courses.includes(c.id)) || [];
  const bookmarkedLessons = bookmarks?.lessons || [];

  const bookmarkedNodes = (progress?.bookmarkedNodes ?? [])
    .map((nodeId) => {
      for (const [roadmapId, roadmap] of Object.entries(MOCK_ROADMAPS)) {
        const node = roadmap.nodes.find((n) => n.id === nodeId);
        if (node) {
          return {
            nodeId,
            nodeTitle: node.data.title,
            nodeDescription: node.data.description,
            roadmapId,
            roadmapTitle: roadmap.title,
            difficulty: node.data.difficulty,
          };
        }
      }
      return null;
    })
    .filter((n): n is Exclude<typeof n, null> => n !== null);

  const favoritedRoadmaps = (progress?.favorites ?? [])
    .map((roadmapId) => {
      const roadmap = MOCK_ROADMAPS[roadmapId];
      if (roadmap) {
        const category = categories?.find((cat) => cat.id === roadmapId);
        return {
          roadmapId,
          title: roadmap.title,
          description: roadmap.description,
          difficulty: roadmap.difficulty,
          duration: roadmap.duration,
          progress: category?.progress ?? 0,
          topicsCount: roadmap.nodes.length,
        };
      }
      return null;
    })
    .filter((n): n is Exclude<typeof n, null> => n !== null);

  const isLoading = bookmarksLoading || coursesLoading || roadmapsLoading;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight display-title flex items-center gap-2"
          style={{ color: "var(--sb-ink)" }}
        >
          <Bookmark className="text-[var(--sb-accent)]" />
          My Bookmarks
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Access your watch-later playlist and saved courses in one dashboard.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[var(--sb-pill)] p-1 rounded-lg border border-[var(--sb-border)] self-start max-w-md">
        <button
          onClick={() => navigate({ search: { tab: "courses" } })}
          className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === "courses"
              ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
              : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
          }`}
        >
          Courses ({bookmarkedCourses.length})
        </button>
        <button
          onClick={() => navigate({ search: { tab: "lessons" } })}
          className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === "lessons"
              ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
              : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
          }`}
        >
          Lessons ({bookmarkedLessons.length})
        </button>
        <button
          onClick={() => navigate({ search: { tab: "roadmaps" } })}
          className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === "roadmaps"
              ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
              : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
          }`}
        >
          Roadmaps ({bookmarkedNodes.length + favoritedRoadmaps.length})
        </button>
      </div>

      {/* Main Panel Content */}
      {isLoading ? (
        <div className="p-12 text-center animate-pulse">
          Loading bookmarks...
        </div>
      ) : activeTab === "courses" ? (
        /* Courses Tab */
        bookmarkedCourses.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--sb-border)] rounded-xl bg-[var(--sb-bg-hover)]/30 space-y-4">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              You haven't bookmarked any courses yet.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold rounded-lg text-white px-4 py-2"
              style={{ background: "var(--sb-accent)", color: "var(--sb-bg)" }}
            >
              Browse Catalog <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedCourses.map((course) => (
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
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--sb-pill)] text-[var(--sb-ink)]">
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
                      onClick={() => toggleCourseBookmark.mutate(course.id)}
                      className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-red-500/10 hover:text-red-500 text-[var(--sb-ink-dim)] transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div
                      className={`size-10 rounded-xl bg-gradient-to-br ${course.thumbnail} border flex items-center justify-center font-bold text-lg text-[var(--sb-accent)]`}
                    >
                      {course.title.slice(0, 2)}
                    </div>
                  </div>
                </div>

                <p
                  className="text-xs line-clamp-3 leading-relaxed"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  {course.description}
                </p>

                <div className="mt-auto space-y-3">
                  <div
                    className="flex items-center justify-between text-xs border-t border-[var(--sb-border)] pt-3"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {course.totalHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="fill-amber-500 text-amber-500"
                      />
                      {course.rating}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate({
                        to: "/courses/$courseId",
                        params: { courseId: course.id },
                      })
                    }
                    className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-active)] border border-[var(--sb-border)] transition-colors flex items-center justify-center gap-1"
                  >
                    View syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "lessons" ? (
        /* Lessons Tab (Watch Later) */
        bookmarkedLessons.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--sb-border)] rounded-xl bg-[var(--sb-bg-hover)]/30 space-y-4">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              No individual lessons have been saved yet.
            </p>
            <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
              Enroll in a course and click the bookmark flag next to any lesson
              to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {bookmarkedLessons.map((lesson) => (
              <div
                key={lesson.lessonId}
                className="stagger-item flex items-center justify-between p-4 border rounded-xl transition-all hover:bg-[var(--sb-bg-hover)]"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--line)",
                  boxShadow: "0 1px 0 var(--inset-glint) inset",
                }}
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-wider text-[var(--sb-ink-dim)] uppercase">
                    From Course: {lesson.courseTitle}
                  </span>
                  <h3
                    className="font-bold text-sm"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleLessonBookmark.mutate(lesson)}
                    className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-red-500/10 hover:text-red-500 text-[var(--sb-ink-dim)] transition-colors cursor-pointer"
                    title="Remove from watch later"
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    onClick={() =>
                      navigate({
                        to: "/courses/$courseId/modules/$moduleId/lessons/$lessonId",
                        params: {
                          courseId: lesson.courseId,
                          moduleId: lesson.moduleId,
                          lessonId: lesson.lessonId,
                        },
                      })
                    }
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-white cursor-pointer transition-opacity"
                    style={{
                      background: "var(--sb-accent)",
                      color: "var(--sb-bg)",
                    }}
                  >
                    <Play size={12} className="fill-current" />
                    Play Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Roadmaps Tab */
        <div className="space-y-10">
          {/* Section 1: Saved Pathways */}
          <div className="space-y-4">
            <h2
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: "var(--sb-ink)" }}
            >
              <Star className="size-4 text-amber-500 fill-amber-500" />
              Saved Pathways ({favoritedRoadmaps.length})
            </h2>
            {favoritedRoadmaps.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[var(--sb-border)] rounded-xl bg-[var(--sb-bg-hover)]/30 space-y-2">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  No pathways saved to favorites yet.
                </p>
                <Link
                  to="/learn/roadmaps"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold rounded-lg text-white px-3 py-1.5"
                  style={{
                    background: "var(--sb-accent)",
                    color: "var(--sb-bg)",
                  }}
                >
                  Explore Roadmaps
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favoritedRoadmaps.map((pathway) => (
                  <div
                    key={pathway.roadmapId}
                    className="stagger-item flex flex-col gap-4 rounded-xl p-5 border transition-all duration-200 hover:translate-y-[-2px] group"
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
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--sb-pill)] text-[var(--sb-ink)]">
                          {pathway.difficulty}
                        </span>
                        <h3
                          className="font-bold text-base leading-tight mt-1 group-hover:text-[var(--sb-accent)] transition-colors duration-200"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {pathway.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleRoadmapFavorite(pathway.roadmapId)}
                        className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-red-500/10 hover:text-red-500 text-[var(--sb-ink-dim)] transition-colors cursor-pointer shrink-0"
                        title="Remove Pathway"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p
                      className="text-xs line-clamp-2 leading-relaxed"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {pathway.description}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div
                        className="flex items-center justify-between text-[11px] border-t border-[var(--sb-border)] pt-3"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        <span>{pathway.topicsCount} Chapters</span>
                        <span>{pathway.duration}</span>
                      </div>

                      {pathway.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-medium">
                            <span style={{ color: "var(--sb-ink-dim)" }}>
                              Progress
                            </span>
                            <span className="text-[var(--sb-accent)]">
                              {pathway.progress}%
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full overflow-hidden bg-[var(--sb-pill)]">
                            <div
                              className="h-full bg-[var(--sb-accent)]"
                              style={{ width: `${pathway.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() =>
                          navigate({
                            to: "/learn/roadmaps",
                            search: { id: pathway.roadmapId },
                          })
                        }
                        className="w-full py-2 text-xs font-bold rounded-lg cursor-pointer bg-[var(--sb-bg-hover)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-active)] border border-[var(--sb-border)] transition-colors flex items-center justify-center gap-1"
                      >
                        Open Roadmap <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Saved Topics */}
          <div className="space-y-4">
            <h2
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: "var(--sb-ink)" }}
            >
              <Bookmark className="size-4 text-[var(--sb-accent)]" />
              Saved Topics ({bookmarkedNodes.length})
            </h2>
            {bookmarkedNodes.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[var(--sb-border)] rounded-xl bg-[var(--sb-bg-hover)]/30 space-y-2">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  No individual topics saved yet.
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Open any roadmap and bookmark specific steps to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl">
                {bookmarkedNodes.map((topic) => (
                  <div
                    key={topic.nodeId}
                    className="stagger-item flex items-center justify-between p-4 border rounded-xl transition-all hover:bg-[var(--sb-bg-hover)]"
                    style={{
                      background: "var(--surface)",
                      borderColor: "var(--line)",
                      boxShadow: "0 1px 0 var(--inset-glint) inset",
                    }}
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold tracking-wider text-[var(--sb-ink-dim)] uppercase">
                        From Path: {topic.roadmapTitle}
                      </span>
                      <h3
                        className="font-bold text-sm"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {topic.nodeTitle}
                      </h3>
                      <p
                        className="text-xs line-clamp-1"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        {topic.nodeDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleNodeBookmark(topic.nodeId)}
                        className="p-1.5 rounded-lg border border-[var(--sb-border)] hover:bg-red-500/10 hover:text-red-500 text-[var(--sb-ink-dim)] transition-colors cursor-pointer"
                        title="Remove Topic"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        onClick={() =>
                          navigate({
                            to: "/learn/roadmaps",
                            search: {
                              id: topic.roadmapId,
                              node: topic.nodeId,
                            },
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-white cursor-pointer transition-opacity"
                        style={{
                          background: "var(--sb-accent)",
                          color: "var(--sb-bg)",
                        }}
                      >
                        Open Topic <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default BookmarksPage;
