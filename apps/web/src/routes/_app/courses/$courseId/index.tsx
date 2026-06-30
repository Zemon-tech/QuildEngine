import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
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
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useBookmarks,
  useCourse,
  useEnrollInCourse,
  useToggleLessonBookmark,
  useToggleLessonCompletion,
} from "#/hooks/use-courses";

interface CourseArticle {
  id: string;
  moduleId: string; // Groups by topic/module ID
  title: string;
  description: string;
  readTime: string;
  publishedAt: string;
  author: string;
  likes: number;
  content: string;
}

// Initial Mock Database mapped by courseId
const initialCourseArticlesDb: Record<string, CourseArticle[]> = {
  "dsa-fundamentals": [
    {
      id: "amortized-analysis",
      moduleId: "arrays-strings",
      title: "Amortized Cost Analysis in Dynamic Vectors",
      description:
        "Understand the mathematical proof of amortized O(1) performance during capacity expansion in dynamic arrays like vector or ArrayList.",
      readTime: "8 min read",
      publishedAt: "June 20, 2026",
      author: "Shivansh Kumar",
      likes: 198,
      content: `## Amortized Cost Analysis in Dynamic Vectors

When we allocate memory for a static array, its capacity is fixed. To allow dynamic expansion, collections like vectors (in C++) and ArrayLists (in Java) allocate a larger block of memory under the hood once the array is full, copy elements over, and delete the old memory block.

### Why is the expansion factor 2?
V8 and C++ standard libraries typically use a growth factor of 2 (or 1.5). Let's prove why dynamic insertion is O(1) in the amortized sense.

### Mathematical Proof
Suppose we start with capacity 1 and double it whenever full:
1. Insertion 1: cost 1
2. Insertion 2: cost 1 (insertion) + 1 (copy) = 2
3. Insertion 3: cost 1 (insertion) + 2 (copy) = 3
4. Insertion 4: cost 1 (insertion) = 1
5. Insertion 5: cost 1 (insertion) + 4 (copy) = 5

For N elements, the number of copies is:
1 + 2 + 4 + 8 + ... + N/2 = N - 1 copies.

Total cost for N insertions = N (insertions) + N - 1 (copies) ≈ 2N.
Amortized cost per insertion = 2N / N = O(1) constant time!
`,
    },
    {
      id: "hash-collision-strategies",
      moduleId: "arrays-strings",
      title: "Advanced Collision Resolution in Hash Tables",
      description:
        "Inspect linear probing, quadratic probing, and robin hood hashing. Analyze memory caches and cache-line lookups.",
      readTime: "11 min read",
      publishedAt: "June 12, 2026",
      author: "Shivansh Kumar",
      likes: 242,
      content: `## Advanced Collision Resolution in Hash Tables

Hash tables map keys to indexes via a hash function. When two distinct keys map to the same index, a collision occurs.

### 1. Separate Chaining (Linked Lists)
Every bucket contains a linked list of entries. Easy to implement, but poor CPU cache utilization because nodes are scattered in memory.

### 2. Open Addressing
Store all entries directly in the table array.
- **Linear Probing**: If bucket is occupied, check the next bucket sequentially. Excellent CPU cache locality, but suffers from primary clustering.
- **Robin Hood Hashing**: A variation of linear probing where rich keys (keys close to their home bucket) yield their spot to poor keys (keys far from home). Reduces variance in probe lengths.
`,
    },
  ],
  "system-design": [
    {
      id: "distributed-caching-scalability",
      moduleId: "caching-layer",
      title: "Distributed Caching: Consistent Hashing Ring & Eviction Policies",
      description:
        "How to scale your distributed caching clusters using consistent hashing rings. Mitigate cache stampedes and hotspotting.",
      readTime: "14 min read",
      publishedAt: "June 18, 2026",
      author: "Shivansh Kumar",
      likes: 412,
      content: `## Distributed Caching: Consistent Hashing Rings

In a standard modulo caching cluster (\`hash(key) % N\`), adding or removing a node invalidates almost all keys. Consistent hashing solves this by mapping both nodes and keys to a 360-degree circular ring.

### Consistent Hashing Steps:
1. Hash both server IPs and keys to the ring.
2. Store key on the next clockwise server.
3. Adding a new server only requires remapping a small fraction of keys (roughly K / N).

### Preventing Hotspots with Virtual Nodes
If servers are not evenly distributed, some carry double the load. Consistent hashing mitigates this by mapping multiple virtual nodes per physical server to achieve uniform load distributions.
`,
    },
  ],
};

const defaultArticles: CourseArticle[] = [
  {
    id: "v8-compiler-optimizations",
    moduleId: "general",
    title: "V8 Compiler Optimization Loops",
    description:
      "Deep dive into JIT compilation, inlining, and inline cache mechanisms in Javascript runtimes.",
    readTime: "9 min read",
    publishedAt: "June 08, 2026",
    author: "Shivansh Kumar",
    likes: 88,
    content: `## V8 Compiler Optimizations

Google's V8 JIT compiler optimizes code dynamically. When code is identified as hot, it compiles it directly into machine assembly.

### Inline Caching
Inline caching remembers the shapes of objects passed to a function. If the shape doesn't change, V8 skips the slow lookup of property locations in memory.
`,
  },
];

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

  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({
    "arrays-strings": true,
    "load-balancers": true,
    "react-fiber": true,
    "kernel-bootstrapping": true,
  });

  // Articles States
  const [selectedArticle, setSelectedArticle] = useState<CourseArticle | null>(
    null,
  );
  const [localArticles, setLocalArticles] = useState<CourseArticle[]>([]);

  // Load from local storage or initial DB
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`course_articles_${courseId}`);
      if (saved) {
        setLocalArticles(JSON.parse(saved));
      } else {
        const initial = initialCourseArticlesDb[courseId] || defaultArticles;
        setLocalArticles(initial);
      }
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center animate-pulse">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading course</h2>
        <Link
          to="/courses"
          className="mt-4 inline-block text-xs font-bold underline"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Find first uncompleted lesson
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id })),
  );
  const firstUncompleted =
    allLessons.find((l) => !course.completedLessonIds.includes(l.id)) ||
    allLessons[0];

  const handleStartResume = () => {
    if (!course.enrolled) {
      enrollMutation.mutate(course.id, {
        onSuccess: () => {
          if (firstUncompleted) {
            navigate({
              to: `/courses/${course.id}/modules/${firstUncompleted.moduleId}/lessons/${firstUncompleted.id}`,
            });
          }
        },
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
          background:
            "linear-gradient(135deg, var(--surface-strong), var(--surface))",
          borderColor: "var(--line)",
          boxShadow:
            "0 1px 0 var(--inset-glint) inset, 0 10px 30px rgba(0,0,0,0.02)",
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
            <p
              className="text-sm max-w-xl leading-relaxed"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              {course.description}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 text-xs pt-2"
              style={{ color: "var(--sb-ink-dim)" }}
            >
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
                <span>
                  Instructed by{" "}
                  <strong className="text-[var(--sb-ink)]">
                    {course.author}
                  </strong>
                </span>
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[var(--sb-pill)] p-5 rounded-xl border border-[var(--sb-border)] min-w-[240px] text-center space-y-4">
            {course.enrolled ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[var(--sb-ink-muted)]">
                    Progress
                  </span>
                  <span className="font-bold text-[var(--sb-accent)]">
                    {course.progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[var(--sb-bg)] rounded-full overflow-hidden border border-[var(--sb-border)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${course.progress}%`,
                      background: "var(--sb-accent)",
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--sb-ink-muted)]">
                Get full lifetime access to curriculum resources and lessons.
              </p>
            )}

            <button
              onClick={handleStartResume}
              className="w-full py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-opacity flex items-center justify-center gap-2 text-white"
              style={{
                background: "var(--sb-accent)",
                color: "var(--sb-accent-foreground)",
              }}
            >
              <Play size={14} className="fill-current" />
              {course.enrolled
                ? course.progress === 0
                  ? "Start Learning"
                  : "Resume Learning"
                : enrollMutation.isPending
                  ? "Enrolling..."
                  : "Enroll & Start"}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Syllabus Section */}
      <div className="space-y-4">
        <h2
          className="text-xl font-bold display-title"
          style={{ color: "var(--sb-ink)" }}
        >
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
                <div className="w-full flex items-center justify-between p-4 bg-[var(--sb-pill)] text-left border-b border-[var(--sb-border)]/40">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div
                      className="flex size-7 items-center justify-center rounded-lg text-xs font-black shrink-0"
                      style={{
                        background: "var(--sb-bg)",
                        color: "var(--sb-accent)",
                        border: "1px solid var(--sb-border)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--sb-ink)]">
                        {module.title}
                      </h3>
                      <p className="text-[10px] text-[var(--sb-ink-dim)]">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ChevronRight
                      onClick={() => toggleModule(module.id)}
                      size={16}
                      style={{ color: "var(--sb-ink-dim)" }}
                      className={`transition-transform duration-200 cursor-pointer ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Module Lessons List */}
                {isExpanded && (
                  <div className="divide-y divide-[var(--sb-border)]">
                    {module.lessons.map((lesson) => {
                      const isCompleted = course.completedLessonIds.includes(
                        lesson.id,
                      );

                      const handleCheckboxClick = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (!course.enrolled) return;
                        toggleLessonMutation.mutate({
                          courseId: course.id,
                          lessonId: lesson.id,
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
                          className={`flex items-center justify-between p-4 text-xs transition-colors ${
                            course.enrolled
                              ? "hover:bg-[var(--sb-bg-hover)] cursor-pointer"
                              : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-3">
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
                                <Circle
                                  size={16}
                                  className="text-[var(--sb-ink-dim)]"
                                />
                              )}
                            </button>
                            <span
                              className="font-medium"
                              style={{ color: "var(--sb-ink)" }}
                            >
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
                                <Bookmark
                                  size={13}
                                  className={
                                    bookmarks?.lessons.some(
                                      (l) => l.lessonId === lesson.id,
                                    )
                                      ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]"
                                      : ""
                                  }
                                />
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

                    {/* Render articles under this module */}
                    {localArticles
                      .filter(
                        (art) =>
                          art.moduleId === module.id ||
                          (i === 0 && art.moduleId === "general"),
                      )
                      .map((article) => {
                        return (
                          <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="flex items-center justify-between p-4 text-xs hover:bg-[var(--sb-bg-hover)] cursor-pointer transition-colors border-l-2 border-indigo-500/80 bg-indigo-500/5"
                          >
                            <div className="flex items-center gap-3">
                              <FileText
                                size={16}
                                className="text-indigo-500 shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-[var(--sb-ink)]">
                                  {article.title}
                                </span>
                                <span className="text-[10px] text-[var(--sb-ink-dim)] ml-2">
                                  (Article)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-[var(--sb-ink-dim)]">
                              <span className="text-[10px]">
                                By {article.author}
                              </span>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{article.readTime}</span>
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

      {/* Reader Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-2xl h-[85vh] rounded-2xl border flex flex-col overflow-hidden bg-[var(--sb-bg)] shadow-2xl"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--sb-border)]">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--sb-pill)] text-[var(--sb-accent)] flex items-center gap-1">
                  <Sparkles size={10} /> Topic Article
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="size-8 rounded-lg border border-[var(--sb-border)] flex items-center justify-center hover:bg-[var(--sb-bg-hover)] cursor-pointer text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] active:scale-95 transition-all duration-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 select-text">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black display-title leading-tight text-[var(--sb-ink)]">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--sb-ink-dim)]">
                    <span>
                      Written by{" "}
                      <strong className="text-[var(--sb-ink)]">
                        {selectedArticle.author}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>{selectedArticle.publishedAt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {selectedArticle.readTime}
                    </span>
                  </div>
                </div>

                <div className="prose dark:prose-invert text-xs leading-relaxed max-w-none pt-4 text-[var(--sb-ink)] border-t border-[var(--sb-border)]/40">
                  <div className="whitespace-pre-wrap font-sans space-y-4">
                    {selectedArticle.content.split("\n\n").map((para, k) => {
                      if (para.startsWith("## ")) {
                        return (
                          <h3
                            key={k}
                            className="text-base font-bold display-title mt-4 border-b border-[var(--sb-border)] pb-1"
                          >
                            {para.replace("## ", "")}
                          </h3>
                        );
                      }
                      if (para.startsWith("### ")) {
                        return (
                          <h4
                            key={k}
                            className="text-sm font-bold display-title mt-3"
                          >
                            {para.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (para.startsWith("1. ")) {
                        return (
                          <ol
                            key={k}
                            className="list-decimal pl-5 space-y-1 my-2"
                          >
                            {para.split("\n").map((li, idx) => (
                              <li key={idx}>{li.replace(/^\d+\.\s+/, "")}</li>
                            ))}
                          </ol>
                        );
                      }
                      return <p key={k}>{para}</p>;
                    })}
                  </div>
                </div>
              </div>

              <div
                className="p-4 border-t border-[var(--sb-border)] flex items-center justify-between text-[10px]"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                <span className="flex items-center gap-1 font-semibold">
                  ❤️ {selectedArticle.likes} Likes
                </span>
                <span>Click close or press ESC to exit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
