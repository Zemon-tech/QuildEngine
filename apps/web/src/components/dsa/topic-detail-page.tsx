import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Binary,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Hexagon,
  Code,
  Code2,
  Coins,
  Compass,
  Cpu,
  FileText,
  GitBranch,
  Hash,
  History,
  Key,
  Layers,
  Lightbulb,
  LineChart,
  Link2,
  ListOrdered,
  Network,
  Play,
  RotateCcw,
  Search,
  SearchCode,
  Sparkles,
  Split,
  Terminal,
  Triangle,
  Type,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { useDSACategory } from "#/hooks/use-practice";
import { type DSAProblem, dsaProblems } from "#/lib/dsa-problems-db";
import { ProblemFilters } from "./problem-filters";
import { ProblemTable } from "./problem-table";
import { TopicAIAssistant } from "./topic-ai-assistant";
import { TopicInterviewMode } from "./topic-interview-mode";
import { TopicResources } from "./topic-resources";
import { TopicRevisionPanel } from "./topic-revision-panel";
import { TopicRoadmap } from "./topic-roadmap";
import { TopicStats } from "./topic-stats";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  arrays: Hash,
  strings: Type,
  "linked-list": Link2,
  stack: Layers,
  queue: ListOrdered,
  recursion: RotateCcw,
  hashing: Key,
  "binary-search": Search,
  trees: GitBranch,
  "binary-search-tree": Split,
  heap: Triangle,
  graph: Network,
  "dynamic-programming": Cpu,
  greedy: Coins,
  backtracking: Compass,
  tries: SearchCode,
  "segment-tree": LineChart,
  "bit-manipulation": Binary,
};

function HintCard({ hint, index }: { hint: string; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      className="rounded-xl border p-4 text-xs space-y-2 transition-all"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--sb-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold" style={{ color: "var(--sb-ink)" }}>
          Hint {index + 1}
        </span>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-[10px] font-bold text-[var(--sb-accent)] hover:underline cursor-pointer"
          >
            Reveal Hint
          </button>
        )}
      </div>
      {revealed ? (
        <p
          className="leading-relaxed text-xs"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {hint}
        </p>
      ) : (
        <div className="h-6 bg-zinc-100 dark:bg-zinc-800/40 rounded animate-pulse" />
      )}
    </div>
  );
}

interface TopicDetailPageProps {
  topicId: string;
}

export function TopicDetailPage({ topicId }: TopicDetailPageProps) {
  const { data: category, isLoading, error } = useDSACategory(topicId);

  // Local state for problem entries and selected active problem
  const [localProblems, setLocalProblems] = useState<DSAProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(
    null,
  );

  // Tab views within problem drawer: "description" | "hints" | "notes" | "submissions" | "ai_tutor"
  const [drawerTab, setDrawerTab] = useState<
    "description" | "hints" | "notes" | "submissions" | "ai_tutor"
  >("description");

  // Notion-like tabs for dashboard: "practice" | "roadmap" | "resources" | "interview" | "ai_copilot" | "revision"
  const [activeTab, setActiveTab] = useState<
    | "practice"
    | "roadmap"
    | "resources"
    | "interview"
    | "ai_copilot"
    | "revision"
  >("practice");

  // Notes state indexed by problem ID
  const [problemNotes, setProblemNotes] = useState<Record<string, string>>({});

  // Code editor states
  const [codeSolution, setCodeSolution] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("typescript");
  const [fontSize, setFontSize] = useState("sm"); // sm, md, lg

  // Simulated console / compiler states
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<
    { id: string; text: string }[]
  >([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean | null>(
    null,
  );

  // AI Tutor states
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync state with loaded problems when topic changes
  useEffect(() => {
    const list = dsaProblems[topicId] || [];
    setLocalProblems(list);
    setSelectedProblem(null);
    setIsSubmitSuccessful(null);
    setDrawerTab("description");
    setAiResponse("");
    setCompanyFilter("All");
    setSubtopicFilter("All");
    setActiveTab("practice");
  }, [topicId]);

  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subtopicFilter, setSubtopicFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Subtopics list for filter dropdown
  const availableSubtopics = useMemo(() => {
    const set = new Set<string>();
    for (const prob of localProblems) {
      set.add(prob.subCategory);
    }
    return Array.from(set);
  }, [localProblems]);

  // Statistics aggregated per subtopic for sidebar badges
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

  // Handle toggling bookmark state
  const handleToggleBookmark = (id: string) => {
    setLocalProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );
  };

  // Cycle problem completion status
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

  // Filter and sort the table rows
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
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "difficulty") {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      if (sortBy === "acceptance") {
        return b.acceptance - a.acceptance;
      }
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
      setIsConsoleOpen(false);
      setDrawerTab("description");
      setAiResponse("");
    }
  }, [selectedProblem, editorLanguage, getCodeTemplate]);

  // Run test cases action
  const handleRunCode = () => {
    if (!selectedProblem) return;
    setIsCompiling(true);
    setIsConsoleOpen(true);
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
    setIsCompiling(true);
    setIsConsoleOpen(true);
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

  // AI Tutor approach streamer
  const handleAskAiTutor = () => {
    if (!selectedProblem) return;
    setIsAiLoading(true);
    setAiResponse("");

    const fullResponse = `### Optimal Strategy for **${selectedProblem.name}**

To solve this problem optimally, we want to achieve **O(N)** time complexity.

#### Approach Overview:
1. **Hash Mapping**: By keeping track of elements we've already visited in a dynamic hash map, we can check for complements or values in **O(1)** time.
2. **Two Pointers**: If the array is pre-sorted, we can use two pointers starting at the boundaries and move them inward.
3. **Space Complexity**: The trade-off is utilizing **O(N)** auxiliary space to store elements in the hash set/map.

#### Detailed Steps:
- Initialize an empty Map/Dict.
- Traverse the sequence. At each index, compute the difference target.
- If it exists in our Map, we immediately return the matching pair indices.
- Otherwise, add the current value and index to the map and continue.`;

    let i = 0;
    const interval = setInterval(() => {
      setAiResponse((prev) => prev + fullResponse.charAt(i));
      i++;
      if (i >= fullResponse.length) {
        clearInterval(interval);
        setIsAiLoading(false);
      }
    }, 5);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--sb-accent)] border-t-transparent" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <Sparkles className="size-10 text-red-500" />
        <p className="text-sm font-semibold" style={{ color: "var(--sb-ink)" }}>
          Topic category not found or failed to load.
        </p>
        <Link
          to="/dsa"
          className="text-xs font-semibold text-[var(--sb-accent)] hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[category.id] || Code2;

  return (
    <div className="px-6 py-6 space-y-6 w-full">
      {/* Back button & Page Title */}
      <div className="flex flex-col gap-4">
        <Link
          to="/dsa"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to DSA Dashboard
        </Link>

        {/* Dashboard Header */}
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--sb-accent)]/5 text-[var(--sb-accent)] border border-[var(--sb-accent)]/10">
            <IconComponent size={24} />
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {category.name} Learning Dashboard
            </h1>
            <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <TopicStats problems={localProblems} currentStreak={6} />

      {/* Navigation tabs */}
      <div
        className="flex items-center gap-1 border-b pb-1 select-none overflow-x-auto"
        style={{ borderColor: "var(--sb-border)" }}
      >
        {(
          [
            { id: "practice", label: "Practice Board", icon: Code2 },
            { id: "roadmap", label: "Learning Roadmap", icon: GitBranch },
            { id: "resources", label: "Study Resources", icon: BookOpen },
            { id: "interview", label: "Interview Arena", icon: Award },
            { id: "ai_copilot", label: "AI Study Copilot", icon: Bot },
            { id: "revision", label: "Revision Sheet", icon: FileText },
          ] as const
        ).map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 -mb-[6px] transition-all relative cursor-pointer select-none ${
                activeTab === tab.id
                  ? "border-[var(--sb-accent)] text-[var(--sb-accent)]"
                  : "border-transparent text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
              }`}
            >
              <TabIcon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="w-full min-h-[450px]">
        {activeTab === "practice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Subtopic Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div
                className="rounded-3xl border p-5 space-y-4 shadow-sm"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--sb-pill)] shadow-sm">
                      <BookOpen size={14} className="text-[var(--sb-accent)]" />
                    </div>
                    <h4
                      className="font-bold text-sm tracking-tight"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Syllabus Path
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--sb-accent)]">
                    {availableSubtopics.length} Sections
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {/* "All Subtopics" button */}
                  <button
                    type="button"
                    onClick={() => setSubtopicFilter("All")}
                    className={`group w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none border ${
                      subtopicFilter === "All"
                        ? "bg-[var(--sb-pill)] text-[var(--sb-accent)] border-transparent shadow-sm"
                        : "bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:brightness-95 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers size={16} className={subtopicFilter === "All" ? "opacity-100" : "opacity-70"} />
                      <span>All Subtopics</span>
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
                      const subStats = subtopicStats[sub] || {
                        total: 0,
                        solved: 0,
                      };
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
                          className={`group w-full rounded-2xl px-4 py-3.5 text-[13px] font-semibold text-left transition-all flex items-center justify-between cursor-pointer select-none border ${
                            isActive
                              ? "bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 shadow-sm"
                              : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10"
                          }`}
                          style={{ color: isActive ? "var(--sb-ink)" : "var(--sb-ink-muted)" }}
                        >
                          <div className="flex items-center gap-3 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="text-[var(--sb-accent)] size-[18px] shrink-0" />
                            ) : (
                              <Hexagon className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 size-[18px] shrink-0" />
                            )}
                            <span className="truncate">{sub}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[11px] font-bold ${isCompleted ? 'text-[var(--sb-accent)]' : 'text-emerald-500'}`}>
                              {subStats.solved}/{subStats.total}
                            </span>
                            
                            <div className="relative size-6 flex items-center justify-center shrink-0">
                              <svg width="24" height="24" viewBox="0 0 24 24" className="absolute -rotate-90">
                                <circle cx="12" cy="12" r={radius} fill="none" strokeWidth="2.5" className="stroke-zinc-100 dark:stroke-zinc-800/50" />
                                {subStats.solved > 0 && (
                                  <circle 
                                    cx="12" 
                                    cy="12" 
                                    r={radius} 
                                    fill="none" 
                                    strokeWidth="2.5" 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={offset} 
                                    className="stroke-[var(--sb-accent)] transition-all duration-500 ease-out"
                                    strokeLinecap="round" 
                                  />
                                )}
                              </svg>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Search, Filters & Problems Table */}
            <div className="lg:col-span-9 flex flex-col gap-5">
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
                onSelectProblem={setSelectedProblem}
              />
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <TopicRoadmap
            topicId={topicId}
            problems={localProblems}
            onSelectSubtopic={(sub) => {
              setSubtopicFilter(sub);
              setActiveTab("practice");
            }}
          />
        )}

        {activeTab === "resources" && <TopicResources topicId={topicId} />}

        {activeTab === "interview" && (
          <TopicInterviewMode topicName={category.name} />
        )}

        {activeTab === "ai_copilot" && (
          <TopicAIAssistant topicName={category.name} />
        )}

        {activeTab === "revision" && <TopicRevisionPanel topicId={topicId} />}
      </div>

      {/* LeetCode Workspace Drawer */}
      <AnimatePresence>
        {selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProblem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Split Screen Workspace Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-5xl h-full flex flex-col shadow-2xl border-l"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold text-white bg-[var(--sb-accent)]">
                    <Terminal size={10} />
                    <span>Workspace</span>
                  </span>
                  <h3
                    className="font-bold text-sm tracking-tight"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {selectedProblem.name}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold border"
                    style={{
                      backgroundColor:
                        selectedProblem.difficulty === "Easy"
                          ? "oklch(0.85 0.15 145 / 0.15)"
                          : selectedProblem.difficulty === "Medium"
                            ? "oklch(0.85 0.15 75 / 0.15)"
                            : "oklch(0.85 0.15 30 / 0.15)",
                      color:
                        selectedProblem.difficulty === "Easy"
                          ? "oklch(0.65 0.18 145)"
                          : selectedProblem.difficulty === "Medium"
                            ? "oklch(0.65 0.18 75)"
                            : "oklch(0.65 0.18 30)",
                      borderColor:
                        selectedProblem.difficulty === "Easy"
                          ? "oklch(0.65 0.18 145 / 0.25)"
                          : selectedProblem.difficulty === "Medium"
                            ? "oklch(0.65 0.18 75 / 0.25)"
                            : "oklch(0.65 0.18 30 / 0.25)",
                    }}
                  >
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProblem(null)}
                  className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={16} style={{ color: "var(--sb-ink)" }} />
                </button>
              </div>

              {/* Workspace Body Grid */}
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2">
                {/* Left Panel: Interactive Heuristics & Specs */}
                <div
                  className="flex flex-col h-full border-r min-h-0"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  {/* Left Panel Tabs Header */}
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 border-b shrink-0"
                    style={{
                      borderColor: "var(--sb-border)",
                      background: "oklch(1 0 0 / 0.01)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDrawerTab("description")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
                        drawerTab === "description"
                          ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                      }`}
                    >
                      <BookOpen size={13} />
                      Description
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerTab("hints")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
                        drawerTab === "hints"
                          ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                      }`}
                    >
                      <Lightbulb size={13} />
                      Hints
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerTab("notes")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
                        drawerTab === "notes"
                          ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                      }`}
                    >
                      <FileText size={13} />
                      My Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerTab("submissions")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
                        drawerTab === "submissions"
                          ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                      }`}
                    >
                      <History size={13} />
                      Submissions
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerTab("ai_tutor")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
                        drawerTab === "ai_tutor"
                          ? "bg-indigo-500/10 text-indigo-500"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                      }`}
                    >
                      <Bot size={13} />
                      AI Tutor
                    </button>
                  </div>

                  {/* Tab Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {drawerTab === "description" && (
                      <>
                        {/* Prompt */}
                        <div className="space-y-2">
                          <h4
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            Problem Statement
                          </h4>
                          <p
                            className="text-xs leading-relaxed whitespace-pre-line"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            {selectedProblem.description}
                          </p>
                        </div>

                        {/* Company Tags & Related Topics */}
                        <div
                          className="flex flex-col gap-3.5 py-3.5 border-y"
                          style={{ borderColor: "var(--sb-border)" }}
                        >
                          {selectedProblem.companies &&
                            selectedProblem.companies.length > 0 && (
                              <div className="space-y-1.5">
                                <h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                  Companies
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
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
                                <h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                  Related Topics
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedProblem.relatedTopics.map(
                                    (topic) => (
                                      <span
                                        key={topic}
                                        className="rounded px-2 py-0.5 text-[10px] font-semibold border"
                                        style={{
                                          background: "oklch(1 0 0 / 0.04)",
                                          borderColor: "var(--sb-border)",
                                          color: "var(--sb-ink-dim)",
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
                        <div className="space-y-4">
                          <h4
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            Examples
                          </h4>
                          {selectedProblem.examples.map((ex) => (
                            <div
                              key={`ex-${ex.input}`}
                              className="rounded-xl border p-4 text-xs space-y-2"
                              style={{
                                background: "oklch(1 0 0 / 0.01)",
                                borderColor: "var(--sb-border)",
                              }}
                            >
                              <div
                                className="font-semibold"
                                style={{ color: "var(--sb-ink)" }}
                              >
                                Example:
                              </div>
                              <div className="font-mono text-[11px] leading-relaxed space-y-1">
                                <div>
                                  <span style={{ color: "var(--sb-ink-dim)" }}>
                                    Input:
                                  </span>{" "}
                                  {ex.input}
                                </div>
                                <div>
                                  <span style={{ color: "var(--sb-ink-dim)" }}>
                                    Output:
                                  </span>{" "}
                                  {ex.output}
                                </div>
                                {ex.explanation && (
                                  <div className="mt-2 text-zinc-500 italic">
                                    <span
                                      style={{
                                        color: "var(--sb-ink-dim)",
                                        fontStyle: "normal",
                                      }}
                                    >
                                      Explanation:
                                    </span>{" "}
                                    {ex.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Constraints */}
                        <div className="space-y-2">
                          <h4
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            Constraints
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-500">
                            {selectedProblem.constraints.map((c) => (
                              <li
                                key={`const-${c}`}
                                className="font-mono text-[11px]"
                              >
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {drawerTab === "hints" && (
                      <div className="space-y-4">
                        <h4
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          Hints & Clues
                        </h4>
                        {selectedProblem.hints &&
                        selectedProblem.hints.length > 0 ? (
                          <div className="space-y-3">
                            {selectedProblem.hints.map((hint, hIdx) => (
                              <HintCard key={hint} hint={hint} index={hIdx} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500">
                            No hints available for this problem.
                          </p>
                        )}
                      </div>
                    )}

                    {drawerTab === "notes" && (
                      <div className="space-y-4">
                        <h4
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          My Solution Notes
                        </h4>
                        <textarea
                          value={problemNotes[selectedProblem.id] || ""}
                          onChange={(e) => {
                            setProblemNotes((prev) => ({
                              ...prev,
                              [selectedProblem.id]: e.target.value,
                            }));
                          }}
                          placeholder="Write your notes, key takeaways, or approach outline here..."
                          className="w-full h-64 rounded-xl border p-3.5 text-xs outline-none focus:border-[var(--sb-accent)] font-mono leading-relaxed bg-[var(--card-bg)] resize-none"
                          style={{
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                        />
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2">
                          <span>
                            Notes are automatically saved for this session.
                          </span>
                          {problemNotes[selectedProblem.id] && (
                            <span className="text-emerald-500 font-semibold flex items-center gap-1">
                              <Check size={10} /> Saved
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {drawerTab === "submissions" && (
                      <div className="space-y-4">
                        <h4
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          Submission History
                        </h4>
                        <div
                          className="border rounded-xl overflow-hidden"
                          style={{ borderColor: "var(--sb-border)" }}
                        >
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr
                                className="border-b bg-zinc-50/50 dark:bg-zinc-800/10 font-bold"
                                style={{
                                  borderColor: "var(--sb-border)",
                                  color: "var(--sb-ink-dim)",
                                }}
                              >
                                <th className="p-3">Status</th>
                                <th className="p-3">Language</th>
                                <th className="p-3">Runtime</th>
                                <th className="p-3">Time</th>
                              </tr>
                            </thead>
                            <tbody
                              className="divide-y"
                              style={{
                                borderColor: "var(--sb-border)",
                                color: "var(--sb-ink-muted)",
                              }}
                            >
                              {selectedProblem.status === "completed" ? (
                                <tr className="hover:bg-zinc-100/20 dark:hover:bg-zinc-800/10">
                                  <td className="p-3 font-semibold text-emerald-500">
                                    Accepted
                                  </td>
                                  <td className="p-3">TypeScript</td>
                                  <td className="p-3 font-mono">54 ms</td>
                                  <td className="p-3">Just now</td>
                                </tr>
                              ) : null}
                              <tr className="hover:bg-zinc-100/20 dark:hover:bg-zinc-800/10">
                                <td className="p-3 font-semibold text-amber-500 font-mono">
                                  Wrong Answer
                                </td>
                                <td className="p-3">TypeScript</td>
                                <td className="p-3 font-mono">--</td>
                                <td className="p-3">1 hour ago</td>
                              </tr>
                              <tr className="hover:bg-zinc-100/20 dark:hover:bg-zinc-800/10">
                                <td className="p-3 font-semibold text-emerald-500">
                                  Accepted
                                </td>
                                <td className="p-3">Python</td>
                                <td className="p-3 font-mono">68 ms</td>
                                <td className="p-3">3 days ago</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {drawerTab === "ai_tutor" && (
                      <div className="space-y-5">
                        <div
                          className="flex items-center justify-between border-b pb-3"
                          style={{ borderColor: "var(--sb-border)" }}
                        >
                          <div>
                            <h4
                              className="font-bold text-sm"
                              style={{ color: "var(--sb-ink)" }}
                            >
                              Quild AI Copilot Tutor
                            </h4>
                            <p
                              className="text-[10px]"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              Get detailed conceptual breakdowns and templates.
                            </p>
                          </div>
                          <Sparkles className="text-indigo-500 size-5" />
                        </div>

                        {aiResponse ? (
                          <div
                            className="text-xs leading-relaxed whitespace-pre-wrap font-sans space-y-4 rounded-xl border p-4"
                            style={{
                              background: "oklch(0.5 0.1 260 / 0.02)",
                              borderColor: "var(--sb-border)",
                              color: "var(--sb-ink-muted)",
                            }}
                          >
                            {aiResponse}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                            <Bot
                              size={32}
                              className="text-indigo-500/80 animate-pulse"
                            />
                            <p
                              className="text-xs max-w-xs"
                              style={{ color: "var(--sb-ink-muted)" }}
                            >
                              Stuck? Let Quild Copilot break down the optimal
                              approach and runtime optimizations.
                            </p>
                            <Button
                              onClick={handleAskAiTutor}
                              disabled={isAiLoading}
                              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2 mt-2"
                            >
                              {isAiLoading
                                ? "Analyzing Problem..."
                                : "Ask AI Tutor for Approach"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Interactive Coding Editor Console */}
                <div className="flex flex-col h-full bg-zinc-950 text-zinc-200 min-h-0 relative">
                  {/* Editor Header Settings */}
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                      <Code size={14} className="text-[var(--sb-accent)]" />
                      <span>Workspace Code Console</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Font size */}
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="rounded border border-zinc-800 bg-zinc-850 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 outline-none"
                      >
                        <option value="xs">Font: XS</option>
                        <option value="sm">Font: SM</option>
                        <option value="md">Font: MD</option>
                      </select>

                      {/* Language Select */}
                      <select
                        value={editorLanguage}
                        onChange={(e) => setEditorLanguage(e.target.value)}
                        className="rounded border border-zinc-800 bg-zinc-850 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 outline-none"
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Editor TextArea Gutter */}
                  <div className="flex-1 relative font-mono leading-relaxed p-4 min-h-0 flex bg-zinc-950">
                    {/* Gutter Line Numbers */}
                    <div className="w-8 shrink-0 select-none text-right pr-3 pt-0.5 text-zinc-700 text-xs border-r border-zinc-900">
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                        17, 18, 19, 20, 21, 22,
                      ].map((num) => (
                        <div key={`line-${num}`} className="h-5">
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* Standard Textarea overlay */}
                    <textarea
                      value={codeSolution}
                      onChange={(e) => setCodeSolution(e.target.value)}
                      className={`flex-1 h-full pl-3 bg-transparent border-none outline-none resize-none font-mono focus:ring-0 leading-5 text-zinc-100 ${
                        fontSize === "xs"
                          ? "text-[10px]"
                          : fontSize === "md"
                            ? "text-xs"
                            : "text-[11px]"
                      }`}
                      style={{ caretColor: "white" }}
                      spellCheck="false"
                    />
                  </div>

                  {/* Collapsible Console sliding terminal */}
                  <AnimatePresence>
                    {isConsoleOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 180 }}
                        exit={{ height: 0 }}
                        className="absolute bottom-[56px] left-0 right-0 z-30 border-t border-zinc-800 bg-zinc-950 flex flex-col font-mono"
                      >
                        {/* Console Tab */}
                        <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800 shrink-0">
                          <span className="text-[10px] font-bold text-zinc-400">
                            Terminal Output
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsConsoleOpen(false)}
                            className="text-zinc-500 hover:text-white p-0.5 rounded"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        {/* Terminal Logs */}
                        <div className="flex-1 p-3 overflow-y-auto text-[10px] text-zinc-300 space-y-1.5">
                          {consoleLogs.map((log) => (
                            <div
                              key={log.id}
                              className={
                                log.text.includes("ACCEPTED") ||
                                log.text.includes("All test cases passed")
                                  ? "text-emerald-400 font-bold"
                                  : log.text.includes("Wrong Answer") ||
                                      log.text.includes("Error")
                                    ? "text-rose-400 font-bold"
                                    : "text-zinc-300"
                              }
                            >
                              {log.text}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Console Controls Footer */}
                  <div className="p-3 bg-zinc-900 border-t border-zinc-800 shrink-0 flex items-center justify-between z-40">
                    <button
                      type="button"
                      onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                      className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 px-2 py-1.5 rounded-lg select-none cursor-pointer"
                    >
                      <Terminal size={12} />
                      Console
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleRunCode}
                        disabled={isCompiling}
                        className="text-[11px] font-bold text-zinc-300 hover:text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 px-3 py-1.5 h-auto rounded-lg transition-all"
                      >
                        Run Code
                      </Button>

                      <Button
                        onClick={handleSubmitSolution}
                        disabled={isCompiling || isSubmitSuccessful === true}
                        className="flex items-center gap-1 text-[11px] font-bold text-white bg-[var(--sb-accent)] hover:opacity-90 active:scale-95 px-4.5 py-1.5 h-auto rounded-lg transition-all"
                        style={{
                          background: isSubmitSuccessful ? "#10b981" : "",
                        }}
                      >
                        {isSubmitSuccessful ? (
                          <>
                            <Check size={12} />
                            Accepted!
                          </>
                        ) : (
                          <>
                            <Play size={11} fill="white" />
                            Submit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
