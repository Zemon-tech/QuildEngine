import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCourse, useToggleLessonCompletion, useBookmarks, useToggleLessonBookmark } from "#/hooks/use-courses";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, CheckCircle2, Circle, Clock, Sparkles, ChevronRight, BookOpen, Bookmark
} from "lucide-react";

export const Route = createFileRoute(
  "/_app/courses/$courseId/modules/$moduleId/lessons/$lessonId/",
)({
  component: LessonPage,
});

function LessonPage() {
  const { courseId, moduleId, lessonId } = Route.useParams();
  const { data: course, isLoading, error } = useCourse(courseId);
  const toggleLessonMutation = useToggleLessonCompletion();
  const { data: bookmarks } = useBookmarks();
  const toggleLessonBookmark = useToggleLessonBookmark();
  const navigate = useNavigate();

  // Tabs for the workspace details
  const [activeTab, setActiveTab] = useState<"overview" | "scratchpad" | "discussion">("overview");
  
  // Scratchpad notes state
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem(`quild_notes_${lessonId}`);
      setNotes(savedNotes || "");
    }
  }, [lessonId]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    localStorage.setItem(`quild_notes_${lessonId}`, e.target.value);
  };

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse">Loading lesson workspace...</div>;
  }

  if (error || !course) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading lesson</h2>
        <Link to="/courses" className="mt-4 inline-block text-xs font-bold underline">Back to Catalog</Link>
      </div>
    );
  }

  // Find current module and lesson
  const currentModule = course.modules.find(m => m.id === moduleId);
  const currentLesson = currentModule?.lessons.find(l => l.id === lessonId);

  if (!currentLesson) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Lesson not found</h2>
        <Link to="/courses/$courseId" params={{ courseId }} className="mt-4 inline-block text-xs font-bold underline">Back to Syllabus</Link>
      </div>
    );
  }

  const isCurrentCompleted = course.completedLessonIds.includes(lessonId);

  // Flattened lessons list to handle "Next Lesson" logic
  const flatLessons = course.modules.flatMap(m => 
    m.lessons.map(l => ({ ...l, moduleId: m.id }))
  );
  const currentIdx = flatLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentIdx < flatLessons.length - 1 ? flatLessons[currentIdx + 1] : null;

  const handleMarkCompleteNext = () => {
    // Mark completed if not already completed
    if (!isCurrentCompleted) {
      toggleLessonMutation.mutate({ courseId: course.id, lessonId });
    }

    // Go to next lesson
    if (nextLesson) {
      navigate({
        to: "/courses/$courseId/modules/$moduleId/lessons/$lessonId",
        params: { courseId, moduleId: nextLesson.moduleId, lessonId: nextLesson.id },
      });
    } else {
      // Completed last lesson of course! Take back to course page
      navigate({ to: "/courses/$courseId", params: { courseId } });
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--sb-border)] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/courses/$courseId"
            params={{ courseId }}
            className="flex size-8 items-center justify-center rounded-lg border border-[var(--sb-border)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-[var(--sb-ink-dim)] uppercase tracking-wider">
              {course.title} · {currentModule?.title}
            </span>
            <h1 className="text-lg font-black tracking-tight" style={{ color: "var(--sb-ink)" }}>
              {currentLesson.title}
            </h1>
          </div>
        </div>

        {/* Mark completed & Next Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLessonBookmark.mutate({
              courseId: course.id,
              moduleId,
              lessonId,
              title: currentLesson.title,
              courseTitle: course.title
            })}
            className="flex items-center justify-center size-8 rounded-lg border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-accent)] transition-colors cursor-pointer"
          >
            <Bookmark size={15} className={bookmarks?.lessons.some(l => l.lessonId === lessonId) ? "fill-[var(--sb-accent)] text-[var(--sb-accent)]" : ""} />
          </button>

          <button
            onClick={() => toggleLessonMutation.mutate({ courseId: course.id, lessonId })}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              isCurrentCompleted
                ? "bg-teal-500/10 text-teal-600 border-teal-500/30"
                : "bg-[var(--sb-bg)] text-[var(--sb-ink)] border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)]"
            }`}
          >
            {isCurrentCompleted ? (
              <>
                <CheckCircle2 size={14} className="text-teal-600 fill-teal-600/10" />
                Completed
              </>
            ) : (
              <>
                <Circle size={14} className="text-[var(--sb-ink-dim)]" />
                Mark Completed
              </>
            )}
          </button>

          <button
            onClick={handleMarkCompleteNext}
            className="px-4 py-1.5 text-xs font-bold rounded-lg text-white transition-opacity flex items-center gap-1.5 cursor-pointer"
            style={{
              background: "var(--sb-accent)",
              color: "var(--sb-accent-foreground)"
            }}
          >
            {nextLesson ? "Complete & Next" : "Finish Course"}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Two-Column Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Player & Tab Details */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-y-auto">
          {/* Video or Article Player Box */}
          <div 
            className="rounded-2xl border overflow-hidden aspect-video relative flex flex-col justify-center items-center bg-black/95 dark:bg-black"
            style={{ borderColor: "var(--line)" }}
          >
            {currentLesson.type === "video" && currentLesson.videoUrl ? (
              <video 
                src={currentLesson.videoUrl} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay
              />
            ) : (
              /* Text or Article Lesson */
              <div className="w-full h-full bg-[var(--surface-strong)] p-6 md:p-8 overflow-y-auto prose dark:prose-invert">
                <h2 className="display-title font-bold text-xl mb-4">{currentLesson.title}</h2>
                <p className="text-sm leading-relaxed text-[var(--sb-ink)]">{currentLesson.content}</p>
                <div className="mt-8 p-4 bg-[var(--sb-pill)] rounded-xl border border-[var(--sb-border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles size={14} className="text-[var(--sb-accent)]" /> Pro-Tip for Programmers
                  </h4>
                  <p className="text-xs text-[var(--sb-ink-muted)]">
                    Implement the principles described above locally, and compile it on your system to inspect the compiler outputs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details & Interactive Workspace tabs */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex border-b border-[var(--sb-border)]">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2.5 text-xs font-bold relative transition-colors cursor-pointer mr-6 ${
                  activeTab === "overview"
                    ? "text-[var(--sb-accent)]"
                    : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                }`}
              >
                Overview
                {activeTab === "overview" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sb-accent)]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("scratchpad")}
                className={`pb-2.5 text-xs font-bold relative transition-colors cursor-pointer mr-6 ${
                  activeTab === "scratchpad"
                    ? "text-[var(--sb-accent)]"
                    : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                }`}
              >
                Notes & Sandbox
                {activeTab === "scratchpad" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sb-accent)]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("discussion")}
                className={`pb-2.5 text-xs font-bold relative transition-colors cursor-pointer mr-6 ${
                  activeTab === "discussion"
                    ? "text-[var(--sb-accent)]"
                    : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                }`}
              >
                Discussion
                {activeTab === "discussion" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sb-accent)]" />
                )}
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 text-xs">
              {activeTab === "overview" && (
                <div className="space-y-3 leading-relaxed text-[var(--sb-ink-muted)]">
                  <p className="font-semibold text-[var(--sb-ink)]">About this Lesson:</p>
                  <p>{currentLesson.content || "In this lesson, we will understand how data flows and how compiling, profiling, and executing code affects your system performance."}</p>
                  <div className="flex items-center gap-4 text-[10px] mt-4 pt-3 border-t border-[var(--sb-border)]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {currentLesson.duration} mins</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> Format: {currentLesson.type}</span>
                  </div>
                </div>
              )}

              {activeTab === "scratchpad" && (
                <div className="h-full flex flex-col gap-2">
                  <p className="font-semibold text-[var(--sb-ink)]">Your Learning Scratchpad (autosaved):</p>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Write your study notes or code ideas here..."
                    className="flex-1 w-full min-h-[140px] bg-[var(--surface)] p-3 text-xs border border-[var(--sb-border)] rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--sb-accent)]/50 text-[var(--sb-ink)] placeholder-[var(--sb-ink-dim)] font-mono"
                  />
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center font-bold">KM</div>
                    <div className="bg-[var(--sb-pill)] p-3 rounded-xl border border-[var(--sb-border)] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--sb-ink)]">Karan Malhotra</span>
                        <span className="text-[9px] text-[var(--sb-ink-dim)]">2 hours ago</span>
                      </div>
                      <p className="text-[var(--sb-ink-muted)]">How does the buffer scaling in Linux prevent memory leak scenarios? Really cool explanation in the video!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pl-8">
                    <div className="size-8 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold">SK</div>
                    <div className="bg-[var(--sb-pill)] p-3 rounded-xl border border-[var(--sb-border)] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--sb-ink)]">Sanket Kumar (Instructor)</span>
                        <span className="text-[9px] text-[var(--sb-ink-dim)]">1 hour ago</span>
                      </div>
                      <p className="text-[var(--sb-ink-muted)]">Great question. It caps the memory allocated per connection at the kernel level, avoiding dynamic runaway sizing if clients flood frames.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar curriculum checklist */}
        <div 
          className="lg:col-span-4 rounded-2xl border p-4 flex flex-col gap-4 overflow-y-auto"
          style={{ 
            background: "var(--surface)", 
            borderColor: "var(--line)" 
          }}
        >
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--sb-ink-dim)] pb-2 border-b border-[var(--sb-border)] flex items-center gap-1.5">
            <BookOpen size={14} /> Course Curriculum
          </h3>

          <div className="flex flex-col gap-4">
            {course.modules.map((module) => (
              <div key={module.id} className="space-y-2">
                <h4 className="text-[10px] font-bold tracking-wide uppercase text-[var(--sb-ink-dim)]">
                  {module.title}
                </h4>

                <div className="flex flex-col gap-1.5">
                  {module.lessons.map((lesson) => {
                    const isLessonCompleted = course.completedLessonIds.includes(lesson.id);
                    const isCurrent = lesson.id === lessonId;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate({
                          to: "/courses/$courseId/modules/$moduleId/lessons/$lessonId",
                          params: { courseId, moduleId: module.id, lessonId: lesson.id }
                        })}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[var(--sb-pill)] border-[var(--sb-accent)]/30 font-bold"
                            : "bg-transparent border-transparent hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[80%]">
                          {isLessonCompleted ? (
                            <CheckCircle2 size={13} className="text-teal-600 fill-teal-600/10 shrink-0" />
                          ) : (
                            <Circle size={13} className="text-[var(--sb-ink-dim)] shrink-0" />
                          )}
                          <span className="truncate" style={{ color: isCurrent ? "var(--sb-ink)" : "inherit" }}>
                            {lesson.title}
                          </span>
                        </div>

                        <span className="text-[9px] text-[var(--sb-ink-dim)] font-mono shrink-0">
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
