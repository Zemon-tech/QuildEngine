import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Hexagon,
  Layers,
  Terminal,
  Lightbulb,
  FileText,
  History,
  Play,
  Code,
  BookOpen,
  Settings,
  UserPlus,
  List,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Share2,
  HelpCircle,
  ChevronDown,
  FlaskConical,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type DSAProblem, dsaProblems } from "#/lib/dsa-problems-db";
import { ProblemFilters } from "#/components/dsa/problem-filters";
import { ProblemTable } from "#/components/dsa/problem-table";
import { TopicStats } from "#/components/dsa/topic-stats";

// ─── Emil easing curves (animations.dev) ─────────────────────────────────────
// iOS-like drawer curve (from Ionic Framework)
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
// Strong ease-out for UI interactions
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ─── HintCard — blur reveal animation ────────────────────────────────────────
export function HintCard({ hint, index }: { hint: string; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT, delay: index * 0.07 }}
      className="rounded-xl border p-4 text-xs space-y-2"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "#383838",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-zinc-200">Hint {index + 1}</span>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
          >
            Reveal Hint
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.p
            key="content"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="leading-relaxed text-zinc-400"
          >
            {hint}
          </motion.p>
        ) : (
          <motion.div
            key="placeholder"
            className="h-5 bg-zinc-800/60 rounded animate-pulse"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── AnimatedTabBar — sliding indicator driven by DOM measurements ────────────
type DrawerTabId = "description" | "editorial" | "solutions" | "submissions";
type BottomTabId = "testcase" | "testresult";

const LEFT_PANEL_TABS: { id: DrawerTabId; label: string; icon: React.ReactNode }[] = [
  { id: "description", label: "Description", icon: <FileText size={13} /> },
  { id: "editorial", label: "Editorial", icon: <BookOpen size={13} /> },
  { id: "solutions", label: "Solutions", icon: <FlaskConical size={13} /> },
  { id: "submissions", label: "Submissions", icon: <History size={13} /> },
];

function AnimatedTabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div
      className="relative flex items-center px-1 border-b shrink-0 bg-[#242424] select-none"
      style={{ borderColor: "#333" }}
    >
      {/* Sliding active indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-blue-500 rounded-t"
        animate={{ left: indicator.left, width: indicator.width }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.2, ease: EASE_OUT }
        }
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[tab.id] = el; }}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
            active === tab.id
              ? tab.id === "ai_tutor"
                ? "text-indigo-400"
                : "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/_app/practice/dsa/$topicId/")({
  component: PracticeBoardTab,
});

/**
 * Practice Board tab — /practice/dsa/$topicId
 * Renders the problem table, subtopic sidebar, filters, and workspace drawer.
 */
function PracticeBoardTab() {
  const navigate = useNavigate();
  const { topicId } = Route.useParams();
  const shouldReduceMotion = useReducedMotion();

  const [localProblems, setLocalProblems] = useState<DSAProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);

  // Tab views within problem drawer
  const [drawerTab, setDrawerTab] = useState<DrawerTabId>("description");
  const [bottomTab, setBottomTab] = useState<BottomTabId>("testcase");
  if (bottomTab) { /* no-op */ }
  const [codeSolution, setCodeSolution] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("typescript");

  // Simulated console / compiler states
  const [consoleLogs, setConsoleLogs] = useState<
    { id: string; text: string }[]
  >([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean | null>(
    null,
  );


  // Code template generation
  const getCodeTemplate = useCallback(
    (prob: DSAProblem, lang: string) => {
      const paramName = topicId === "arrays" ? "nums" : "input";
      const paramType = topicId === "arrays" ? "number[]" : "string";
      const returnType = prob.id === "two-sum" ? "number[]" : "boolean";

      if (lang === "typescript" || lang === "javascript") {
        return `function ${prob.id.replace(/-/g, "_")}(${paramName}: ${paramType}): ${returnType} {
    // Write your code here
    
    return ${prob.id === "two-sum" ? "[0, 1]" : "true"};
}`;
      }

      if (lang === "python") {
        return `def ${prob.id.replace(/-/g, "_")}(${paramName}):
    # Write your code here
    pass`;
      }

      return `// Write your solution here`;
    },
    [topicId],
  );

  // Sync template code when problem or language changes
  useEffect(() => {
    if (selectedProblem) {
      setCodeSolution(getCodeTemplate(selectedProblem, editorLanguage));
      setIsSubmitSuccessful(null);
      setConsoleLogs([]);
      setBottomTab("testcase");
      setDrawerTab("description");
    }
  }, [selectedProblem, editorLanguage, getCodeTemplate]);

  // Prevent body scrolling when workspace is open
  useEffect(() => {
    if (selectedProblem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProblem]);

  // Run test cases action
  const handleRunCode = () => {
    if (!selectedProblem) return;
    setBottomTab("testresult");
    setIsCompiling(true);
    setConsoleLogs([
      { id: "run-compiling", text: "Compiling..." },
      { id: "run-testing", text: "Running test cases..." },
    ]);

    setTimeout(() => {
      setIsCompiling(false);
      setConsoleLogs([
        { id: "res-status", text: "Status: Success" },
        {
          id: "res-cases",
          text: `Ran 3 test cases for problem '${selectedProblem.name}'`,
        },
        { id: "res-divider-1", text: "-------------------------------" },
        {
          id: "res-case-1",
          text: "Test Case 1 (Pass): Expected output matched actual result.",
        },
        {
          id: "res-case-2",
          text: "Test Case 2 (Pass): Optimal runtime check valid.",
        },
        {
          id: "res-case-3",
          text: "Test Case 3 (Pass): Boundary condition handled successfully.",
        },
        { id: "res-divider-2", text: "-------------------------------" },
        { id: "res-passed", text: "All test cases passed! (3/3)" },
      ]);
    }, 1200);
  };

  // Submit Solution action
  const handleSubmitSolution = () => {
    if (!selectedProblem) return;
    setBottomTab("testresult");
    setIsCompiling(true);
    setConsoleLogs([
      { id: "sub-submit", text: "Submitting to global validator..." },
      { id: "sub-run", text: "Running full suite (120 test cases)..." },
    ]);

    setTimeout(() => {
      setIsCompiling(false);
      setIsSubmitSuccessful(true);
      setConsoleLogs([
        { id: "sub-val", text: "Validator: ACCEPTED" },
        {
          id: "sub-runtime",
          text: "Runtime: 54 ms (Beats 91.5% of TypeScript solutions)",
        },
        {
          id: "sub-memory",
          text: "Memory: 44.8 MB (Beats 78.2% of TypeScript solutions)",
        },
      ]);

      // Update completion state in list
      setLocalProblems((prev) =>
        prev.map((p) =>
          p.id === selectedProblem.id ? { ...p, status: "completed" } : p,
        ),
      );

      // Close drawer after short delay
      setTimeout(() => {
        setIsSubmitSuccessful(null);
        setSelectedProblem(null);
      }, 2000);
    }, 1500);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subtopicFilter, setSubtopicFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Sync problems when topic changes
  useEffect(() => {
    const list = dsaProblems[topicId] || [];
    setLocalProblems(list);
    setSelectedProblem(null);
    setSubtopicFilter("All");
    setCompanyFilter("All");
  }, [topicId]);

  const availableSubtopics = useMemo(() => {
    const set = new Set<string>();
    for (const prob of localProblems) {
      set.add(prob.subCategory);
    }
    return Array.from(set);
  }, [localProblems]);

  const subtopicStats = useMemo(() => {
    const statsMap: Record<string, { total: number; solved: number }> = {};
    for (const prob of localProblems) {
      if (!statsMap[prob.subCategory]) {
        statsMap[prob.subCategory] = { total: 0, solved: 0 };
      }
      statsMap[prob.subCategory].total += 1;
      if (prob.status === "completed") {
        statsMap[prob.subCategory].solved += 1;
      }
    }
    return statsMap;
  }, [localProblems]);

  const handleToggleBookmark = (id: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );
  };

  const handleToggleStatus = (id: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          let nextStatus: "completed" | "in_progress" | "not_started";
          if (p.status === "not_started") nextStatus = "in_progress";
          else if (p.status === "in_progress") nextStatus = "completed";
          else nextStatus = "not_started";
          return { ...p, status: nextStatus };
        }
        return p;
      }),
    );
  };

  const processedProblems = useMemo(() => {
    let result = [...localProblems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (difficultyFilter !== "All") {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (subtopicFilter !== "All") {
      result = result.filter((p) => p.subCategory === subtopicFilter);
    }

    if (companyFilter !== "All") {
      result = result.filter((p) => p.companies?.includes(companyFilter));
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "difficulty") {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      if (sortBy === "acceptance") return b.acceptance - a.acceptance;
      if (sortBy === "status") {
        const statusWeight = { completed: 1, in_progress: 2, not_started: 3 };
        return statusWeight[a.status] - statusWeight[b.status];
      }
      return 0;
    });

    return result;
  }, [
    localProblems,
    searchQuery,
    difficultyFilter,
    statusFilter,
    subtopicFilter,
    companyFilter,
    sortBy,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Stats Summary Grid */}
      <div className="lg:col-span-12">
        <TopicStats problems={localProblems} currentStreak={6} />
      </div>

      {/* Left Column: Subtopic Sidebar — sticky while scrolling */}
      <div className="lg:col-span-3 flex flex-col gap-4 sticky top-[58px] z-30 bg-[var(--background)] pr-2 self-start">
        <div
          className="rounded-3xl border p-5 space-y-4 shadow-sm"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex flex-col gap-1 pb-1 border-b border-transparent">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--sb-pill)] shadow-sm shrink-0">
                <BookOpen size={14} className="text-[var(--sb-accent)]" />
              </div>
              <div className="flex flex-col min-w-0">
                <h4
                  className="font-bold text-sm tracking-tight truncate"
                  style={{ color: "var(--sb-ink)" }}
                  title="Syllabus Path"
                >
                  Syllabus Path
                </h4>
                <span className="text-[10px] font-bold text-[var(--sb-accent)] whitespace-nowrap">
                  {availableSubtopics.length} Sections
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {/* "All Subtopics" button */}
            <button
              type="button"
              onClick={() => setSubtopicFilter("All")}
              className={`group w-full rounded-2xl px-3 py-3 text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none border ${
                subtopicFilter === "All"
                  ? "bg-[var(--sb-pill)] text-[var(--sb-accent)] border-transparent shadow-sm"
                  : "bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:brightness-95 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Layers size={16} className={`shrink-0 ${subtopicFilter === "All" ? "opacity-100" : "opacity-70"}`} />
                <span className="truncate" title="All Subtopics">All Subtopics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/60 dark:bg-black/20 px-2.5 py-0.5 text-[11px] font-bold shadow-sm">
                  {localProblems.length}
                </span>
                <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* Subtopics list */}
            <div className="flex flex-col gap-1 mt-3">
              {availableSubtopics.map((sub) => {
                const subStats = subtopicStats[sub] || { total: 0, solved: 0 };
                const isCompleted =
                  subStats.total > 0 && subStats.solved === subStats.total;
                const isActive = subtopicFilter === sub;
                
                const radius = 9;
                const circumference = 2 * Math.PI * radius;
                const percent = subStats.total > 0 ? (subStats.solved / subStats.total) * 100 : 0;
                const offset = circumference - (percent / 100) * circumference;

                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubtopicFilter(sub)}
                    className={`group w-full rounded-2xl px-3 py-3 text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none border ${
                      isActive
                        ? "bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 shadow-sm"
                        : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10"
                    }`}
                    style={{ color: isActive ? "var(--sb-ink)" : "var(--sb-ink-muted)" }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0" title={sub}>
                      {isCompleted ? (
                        <CheckCircle2 className="text-[var(--sb-accent)] size-[16px] shrink-0" />
                      ) : (
                        <Hexagon className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 size-[16px] shrink-0" />
                      )}
                      <span className="truncate">{sub}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-bold ${isCompleted ? 'text-[var(--sb-accent)]' : 'text-emerald-500'}`}>
                        {subStats.solved}/{subStats.total}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Search, Filters & Problems Table */}
      <div className="lg:col-span-9 flex flex-col gap-5 min-w-0">
        <ProblemFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          difficulty={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          subtopic={subtopicFilter}
          onSubtopicChange={setSubtopicFilter}
          company={companyFilter}
          onCompanyChange={setCompanyFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableSubtopics={availableSubtopics}
        />

        <ProblemTable
          problems={processedProblems}
          onToggleStatus={handleToggleStatus}
          onToggleBookmark={handleToggleBookmark}
          onSelectProblem={(problem) => {
            navigate({
              to: "/practice/problem/$problemId",
              params: { problemId: problem.id.toString() },
            });
          }}
        />
      </div>

      {/* ─── LeetCode Workspace — Fullscreen animated overlay ───────────────────── */}
      <AnimatePresence>
        {selectedProblem && (
          <motion.div
            key="workspace"
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.97,
              y: shouldReduceMotion ? 0 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.97,
              y: shouldReduceMotion ? 0 : 6,
              transition: { duration: 0.18, ease: EASE_OUT },
            }}
            transition={{ duration: 0.28, ease: EASE_DRAWER }}
            style={{ transformOrigin: "center center" }}
            className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a] text-white"
          >
            {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-[#333] shrink-0 text-white select-none">
              {/* Left Section */}
              <div className="flex items-center gap-6">
              </div>

              {/* Center Section (Submit & Run) */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSubmitSolution}
                  disabled={isCompiling || isSubmitSuccessful === true}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2cbb5d] hover:bg-[#22a34d] text-white rounded-[4px] text-xs font-bold transition-all cursor-pointer active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Check size={14} strokeWidth={2.5} />
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isCompiling}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-[4px] text-xs font-bold transition-all cursor-pointer active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={13} fill="currentColor" />
                  Run
                </button>
              </div>

              {/* Right Section (Empty spacer) */}
              <div className="flex items-center gap-4">
              </div>
            </div>

            {/* ── Split Screen Body ─────────────────────────────────────────────────── */}
            <div className="flex-1 flex gap-1.5 p-1.5 min-h-0 bg-[#1a1a1a]">
              {/* Left Panel: Problem info */}
              <div className="flex-1 flex flex-col bg-[#242424] rounded-xl border border-[#333] overflow-hidden min-h-0">
                {/* Left Panel Tab Bar — animated sliding indicator */}
                <AnimatedTabBar
                  tabs={LEFT_PANEL_TABS}
                  active={drawerTab}
                  onChange={(id) => setDrawerTab(id as DrawerTabId)}
                />

                {/* Tab Body */}
                <div className="flex-1 overflow-y-auto p-5 bg-[#242424]">
                  <AnimatePresence mode="wait">
                  {drawerTab === "description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-6"
                    >
                      {/* Prompt */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h1 className="text-xl font-bold tracking-tight text-white select-text">
                            {selectedProblem.name}
                          </h1>
                          {selectedProblem.status === "completed" && (
                            <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
                              <Check size={14} className="stroke-[3px]" />
                              Solved
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs select-none">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border`}
                            style={{
                              backgroundColor:
                                selectedProblem.difficulty === "Easy"
                                  ? "rgba(46, 191, 191, 0.15)"
                                  : selectedProblem.difficulty === "Medium"
                                    ? "rgba(255, 184, 0, 0.15)"
                                    : "rgba(255, 45, 85, 0.15)",
                              color:
                                selectedProblem.difficulty === "Easy"
                                  ? "#2ebfbf"
                                  : selectedProblem.difficulty === "Medium"
                                    ? "#ffb800"
                                    : "#ff2d55",
                              borderColor:
                                selectedProblem.difficulty === "Easy"
                                  ? "rgba(46, 191, 191, 0.3)"
                                  : selectedProblem.difficulty === "Medium"
                                    ? "rgba(255, 184, 0, 0.3)"
                                    : "rgba(255, 45, 85, 0.3)",
                            }}
                          >
                            {selectedProblem.difficulty}
                          </span>
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] bg-[#333] text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                            <List size={10} /> Topics
                          </span>
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] bg-[#333] text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                            <UserPlus size={10} /> Companies
                          </span>
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] bg-[#333] text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                            <Lightbulb size={10} /> Hint
                          </span>
                        </div>

                        <div className="text-[13px] leading-relaxed text-zinc-300 select-text whitespace-pre-line pt-2">
                          {selectedProblem.description}
                        </div>
                      </div>

                      {/* Company Tags & Related Topics */}
                      <div
                        className="flex flex-col gap-3.5 py-3.5 border-y select-text"
                        style={{ borderColor: "#383838" }}
                      >
                        {selectedProblem.companies &&
                          selectedProblem.companies.length > 0 && (
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                Companies
                              </h5>
                              <div className="flex flex-wrap gap-1.5 select-none">
                                {selectedProblem.companies.map((comp) => {
                                  const colors: Record<
                                    string,
                                    {
                                      bg: string;
                                      text: string;
                                      border: string;
                                    }
                                  > = {
                                    Google: {
                                      bg: "oklch(0.9 0.05 240 / 0.1)",
                                      text: "oklch(0.65 0.15 240)",
                                      border: "oklch(0.65 0.15 240 / 0.2)",
                                    },
                                    Amazon: {
                                      bg: "oklch(0.9 0.05 70 / 0.1)",
                                      text: "oklch(0.65 0.15 70)",
                                      border: "oklch(0.65 0.15 70 / 0.2)",
                                    },
                                    Meta: {
                                      bg: "oklch(0.9 0.05 250 / 0.1)",
                                      text: "oklch(0.65 0.15 250)",
                                      border: "oklch(0.65 0.15 250 / 0.2)",
                                    },
                                    Microsoft: {
                                      bg: "oklch(0.9 0.05 180 / 0.1)",
                                      text: "oklch(0.65 0.15 180)",
                                      border: "oklch(0.65 0.15 180 / 0.2)",
                                    },
                                    Uber: {
                                      bg: "oklch(0.9 0 0 / 0.1)",
                                      text: "oklch(0.7 0 0)",
                                      border: "oklch(0.7 0 0 / 0.2)",
                                    },
                                    Atlassian: {
                                      bg: "oklch(0.9 0.05 220 / 0.1)",
                                      text: "oklch(0.65 0.15 220)",
                                      border: "oklch(0.65 0.15 220 / 0.2)",
                                    },
                                  };
                                  const style = colors[comp] || {
                                    bg: "oklch(1 0 0 / 0.04)",
                                    text: "var(--sb-ink-dim)",
                                    border: "oklch(1 0 0 / 0.08)",
                                  };
                                  return (
                                    <span
                                      key={comp}
                                      className="rounded px-2 py-0.5 text-[10px] font-semibold border animate-in fade-in duration-200"
                                      style={{
                                        backgroundColor: style.bg,
                                        color: style.text,
                                        borderColor: style.border,
                                      }}
                                    >
                                      {comp}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {selectedProblem.relatedTopics &&
                          selectedProblem.relatedTopics.length > 0 && (
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                Related Topics
                              </h5>
                              <div className="flex flex-wrap gap-1.5 select-none">
                                {selectedProblem.relatedTopics.map(
                                  (topic) => (
                                    <span
                                      key={topic}
                                      className="rounded px-2 py-0.5 text-[10px] font-semibold border"
                                      style={{
                                        background: "rgba(255, 255, 255, 0.04)",
                                        borderColor: "#383838",
                                        color: "zinc-400",
                                      }}
                                    >
                                      {topic}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Examples */}
                      <div className="space-y-4 select-text">
                        {selectedProblem.examples.map((ex, idx) => (
                          <div key={`ex-${idx}`} className="space-y-2">
                            <h5 className="text-xs font-bold text-zinc-200">
                              Example {idx + 1}:
                            </h5>
                            <div className="bg-[#2d2d2d] rounded-lg p-3 font-mono text-[11px] leading-relaxed text-zinc-300 border border-[#3c3c3c]">
                              <div>
                                <span className="font-bold text-zinc-400">Input:</span> {ex.input}
                              </div>
                              <div>
                                <span className="font-bold text-zinc-400">Output:</span> {ex.output}
                              </div>
                              {ex.explanation && (
                                <div className="mt-2 text-zinc-400 italic">
                                  <span className="font-bold text-zinc-400 not-italic">Explanation:</span> {ex.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Constraints */}
                      <div className="space-y-2 select-text pt-2">
                        <h4 className="text-xs font-bold text-zinc-200">
                          Constraints:
                        </h4>
                        <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                          {selectedProblem.constraints.map((c) => (
                            <li key={`const-${c}`} className="leading-relaxed">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {drawerTab === "editorial" && (
                    <motion.div
                      key="editorial"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-3 text-zinc-400"
                    >
                      <BookOpen size={32} className="opacity-50" />
                      <p className="text-xs">Editorial content will be displayed here.</p>
                    </motion.div>
                  )}

                  {drawerTab === "solutions" && (
                    <motion.div
                      key="solutions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-3 text-zinc-400"
                    >
                      <FlaskConical size={32} className="opacity-50" />
                      <p className="text-xs">Community solutions will be displayed here.</p>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>

                {/* Left Panel Footer Row */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[#333] bg-[#242424] text-xs text-zinc-500 shrink-0 select-none">
                  <div className="flex items-center gap-3.5">
                    <button type="button" className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <ThumbsUp size={13} />
                      <span>69.1K</span>
                    </button>
                    <button type="button" className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <ThumbsDown size={13} />
                    </button>
                    <button type="button" className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <MessageSquare size={13} />
                      <span>2K</span>
                    </button>
                    <button type="button" className="hover:text-amber-400 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <Star size={13} />
                    </button>
                    <button type="button" className="hover:text-zinc-300 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <Share2 size={13} />
                    </button>
                    <button type="button" className="hover:text-zinc-300 transition-colors cursor-pointer active:scale-[0.94] transition-transform">
                      <HelpCircle size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    2104 Online
                  </div>
                </div>
              </div>

              {/* Right Panel: Code area (top) + Testcase console (bottom) */}
              <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                {/* Editor Container */}
                <div className="flex-1 flex flex-col bg-[#242424] rounded-xl border border-[#333] overflow-hidden min-h-0">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a] border-b border-[#333] shrink-0 text-zinc-300 select-none">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Code size={13} className="text-blue-400" />
                      <span>Code</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Language Select */}
                      <div className="relative">
                        <select
                          value={editorLanguage}
                          onChange={(e) => setEditorLanguage(e.target.value)}
                          className="appearance-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] pl-2.5 pr-6 py-1 text-xs font-semibold text-zinc-300 outline-none cursor-pointer hover:border-zinc-500 transition-colors"
                        >
                          <option value="typescript">TypeScript</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                        </select>
                        <ChevronDown
                          size={10}
                          className="absolute right-2 top-[50%] -translate-y-1/2 pointer-events-none text-zinc-500"
                        />
                      </div>

                      {/* Theme toggle */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 ml-2 border-l border-[#333] pl-4">
                        <span>Theme</span>
                        <div className="w-8 h-4 rounded-full bg-blue-500 flex items-center p-0.5 shadow-inner cursor-pointer hover:opacity-90">
                          <div className="w-3 h-3 rounded-full bg-white ml-auto" />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-300 cursor-pointer active:scale-[0.94] transition-all"
                        title="Editor Settings"
                      >
                        <Settings size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Editor Body */}
                  <div className="flex-1 relative font-mono leading-5 min-h-0 flex bg-[#1e1e1e] overflow-y-auto">
                    {/* Gutter */}
                    <div className="w-10 shrink-0 select-none text-right pr-3 pt-4 text-zinc-600 text-[11px] border-r border-[#2a2a2a]">
                      {Array.from(
                        { length: Math.max(20, codeSolution.split("\n").length + 2) },
                        (_, i) => i + 1,
                      ).map((num) => (
                        <div key={`line-${num}`} className="h-5">
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={codeSolution}
                      onChange={(e) => setCodeSolution(e.target.value)}
                      className="flex-1 h-full pl-3 pt-4 bg-transparent border-none outline-none resize-none font-mono focus:ring-0 leading-5 text-[11px] text-zinc-200"
                      style={{ caretColor: "#60a5fa" }}
                      spellCheck="false"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  </div>

                  {/* Editor Footer */}
                  <div className="px-4 py-1.5 bg-[#2a2a2a] border-t border-[#333] flex items-center justify-between text-[10px] text-zinc-600 shrink-0 select-none">
                    <span>Saved</span>
                    <span>Ln 1, Col 1</span>
                  </div>
                </div>

                {/* Console Panel (Split 50/50 as per design) */}
                <div className="h-72 flex flex-row bg-[#242424] rounded-xl border border-[#333] overflow-hidden shrink-0">
                  {/* Testcase Column */}
                  <div className="flex-1 flex flex-col border-r border-[#333]">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#2a2a2a] shrink-0">
                      <Terminal size={13} className="text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-300">Testcase</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#1e1e1e]">
                      {selectedProblem.examples.map((ex, idx) => (
                        <div key={idx} className="space-y-3 select-text">
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-zinc-200">Input</div>
                            <div className="px-3 py-2 bg-[#2a2a2a] rounded-lg border border-[#3c3c3c] font-mono text-[11px] text-zinc-300">
                              {ex.input}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-zinc-200">Output</div>
                            <div className="px-3 py-2 bg-[#2a2a2a] rounded-lg border border-[#3c3c3c] font-mono text-[11px] text-zinc-300">
                              {ex.output}
                            </div>
                          </div>
                          {ex.explanation && (
                            <div className="space-y-1.5">
                              <div className="text-[11px] font-bold text-zinc-200">Explanation</div>
                              <div className="px-3 py-2 bg-[#2a2a2a] rounded-lg border border-[#3c3c3c] font-mono text-[11px] text-zinc-300">
                                {ex.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Result Column */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#2a2a2a] shrink-0">
                      <Check size={13} className="text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-300">Test Result</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto text-xs flex flex-col justify-center items-center bg-[#1e1e1e]">
                      {isCompiling ? (
                        <div className="space-y-2 text-center select-none">
                          <div className="size-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
                          <div className="text-zinc-500 text-[11px]">Running your code...</div>
                        </div>
                      ) : consoleLogs.length > 0 ? (
                        <div className="w-full font-mono text-[11px] leading-relaxed space-y-1 text-left select-text h-full flex flex-col justify-start">
                          {consoleLogs.map((log) => (
                            <div
                              key={log.id}
                              className={
                                log.text.includes("ACCEPTED") || log.text.includes("All test cases passed")
                                  ? "text-emerald-400 font-bold"
                                  : log.text.includes("Wrong Answer") || log.text.includes("Error")
                                    ? "text-rose-400 font-bold"
                                    : "text-zinc-400"
                              }
                            >
                              {log.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 text-center select-none text-[11px]">
                          You must run your code first.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
