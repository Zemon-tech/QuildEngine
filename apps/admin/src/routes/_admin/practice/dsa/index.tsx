import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import {
  Code2,
  Plus,
  Search,
  Filter,
  Trash2,
  Copy,
  Archive,
  Eye,
  EyeOff,
  Edit2,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  TrendingUp,
  Brain,
  ListFilter,
  RefreshCw,
  LayoutDashboard,
  Layers,
  Database,
  Binary,
  Terminal,
  BarChart3,
  Bot,
  AlertCircle,
  Check,
} from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { MetricCard } from "#/components/admin/metric-card";
import { DashboardChart } from "#/components/admin/dashboard-chart";
import { StatusBadge } from "#/components/admin/status-badge";
import {
  useDsaProblems,
  useSaveDsaProblem,
  useDeleteDsaProblem,
  DsaProblem,
  TestCase,
  ProblemSolution,
} from "#/hooks/use-practice-state";

const dsaSearchSchema = z.object({
  tab: z
    .enum([
      "dashboard",
      "problems",
      "categories",
      "tags",
      "difficulty",
      "languages",
      "analytics",
    ])
    .optional()
    .catch("dashboard"),
});

export const Route = createFileRoute("/_admin/practice/dsa/")({
  validateSearch: (search) => dsaSearchSchema.parse(search),
  component: DsaPage,
});

function DsaPage() {
  const { tab = "dashboard" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const activeTab = tab || "dashboard";

  const setActiveTab = (
    newTab:
      | "dashboard"
      | "problems"
      | "categories"
      | "tags"
      | "difficulty"
      | "languages"
      | "analytics"
  ) => {
    navigate({ search: (prev) => ({ ...prev, tab: newTab }) });
  };

  // Queries & Mutations
  const { data: problems = [], isLoading, isError, refetch } = useDsaProblems();
  const saveProblemMutation = useSaveDsaProblem();
  const deleteProblemMutation = useDeleteDsaProblem();

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  // CRUD Drawer Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<DsaProblem | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Expert">("Easy");
  const [formStatement, setFormStatement] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formConstraints, setFormConstraints] = useState("");
  const [formInputFormat, setFormInputFormat] = useState("");
  const [formOutputFormat, setFormOutputFormat] = useState("");
  const [formSampleInput, setFormSampleInput] = useState("");
  const [formSampleOutput, setFormSampleOutput] = useState("");
  const [formExplanation, setFormExplanation] = useState("");
  const [formTimeComplexity, setFormTimeComplexity] = useState("O(N)");
  const [formSpaceComplexity, setFormSpaceComplexity] = useState("O(1)");
  const [formStatus, setFormStatus] = useState<"published" | "draft" | "archived">("draft");
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);

  // Advanced sub-fields inside form
  const [formTestCases, setFormTestCases] = useState<TestCase[]>([]);
  const [newTcInput, setNewTcInput] = useState("");
  const [newTcOutput, setNewTcOutput] = useState("");
  const [newTcIsSample, setNewTcIsSample] = useState(false);
  const [newTcIsHidden, setNewTcIsHidden] = useState(false);

  const [formSolutions, setFormSolutions] = useState<ProblemSolution[]>([]);
  const [newSolTitle, setNewSolTitle] = useState("");
  const [newSolCode, setNewSolCode] = useState("");
  const [newSolLang, setNewSolLang] = useState("TypeScript");

  // Helper lists
  const ALL_TOPICS = ["Arrays", "Strings", "Stack", "Queue", "Linked List", "Trees", "Graphs", "DP", "Greedy", "Binary Search", "Heap"];
  const ALL_TAGS = ["Amazon", "Google", "Facebook", "Microsoft", "Uber", "Apple"];

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingProblem(null);
    setFormTitle("");
    setFormDifficulty("Easy");
    setFormStatement("");
    setFormDescription("");
    setFormConstraints("");
    setFormInputFormat("");
    setFormOutputFormat("");
    setFormSampleInput("");
    setFormSampleOutput("");
    setFormExplanation("");
    setFormTimeComplexity("O(N)");
    setFormSpaceComplexity("O(1)");
    setFormStatus("draft");
    setFormTopics([]);
    setFormTags([]);
    setFormTestCases([]);
    setFormSolutions([]);
    setIsDrawerOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (prob: DsaProblem) => {
    setEditingProblem(prob);
    setFormTitle(prob.title);
    setFormDifficulty(prob.difficulty);
    setFormStatement(prob.statement);
    setFormDescription(prob.description);
    setFormConstraints(prob.constraints);
    setFormInputFormat(prob.inputFormat);
    setFormOutputFormat(prob.outputFormat);
    setFormSampleInput(prob.sampleInput);
    setFormSampleOutput(prob.sampleOutput);
    setFormExplanation(prob.explanation);
    setFormTimeComplexity(prob.timeComplexity);
    setFormSpaceComplexity(prob.spaceComplexity);
    setFormStatus(prob.status);
    setFormTopics(prob.topics);
    setFormTags(prob.tags);
    setFormTestCases(prob.testCases || []);
    setFormSolutions(prob.solutions || []);
    setIsDrawerOpen(true);
  };

  // Duplicate Problem
  const handleDuplicate = (prob: DsaProblem) => {
    const duplicated: DsaProblem = {
      ...prob,
      id: `prob-${Date.now()}`,
      title: `${prob.title} (Copy)`,
      slug: `${prob.slug}-copy`,
      status: "draft",
      solvesCount: 0,
      discussionCount: 0,
    };
    saveProblemMutation.mutate(duplicated);
  };

  // Archive / Publish Toggles
  const handleToggleStatus = (prob: DsaProblem, newStatus: "published" | "draft" | "archived") => {
    saveProblemMutation.mutate({
      ...prob,
      status: newStatus,
    });
  };

  // Delete Problem
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      deleteProblemMutation.mutate(id);
    }
  };

  // Bulk actions
  const handleBulkStatusChange = (status: "published" | "draft" | "archived") => {
    selectedProblems.forEach((id) => {
      const prob = problems.find((p) => p.id === id);
      if (prob) {
        saveProblemMutation.mutate({ ...prob, status });
      }
    });
    setSelectedProblems([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProblems.length} problems?`)) {
      selectedProblems.forEach((id) => deleteProblemMutation.mutate(id));
      setSelectedProblems([]);
    }
  };

  // Add Test Case
  const handleAddTestCase = () => {
    if (!newTcInput || !newTcOutput) return;
    const newTc: TestCase = {
      id: `tc-${Date.now()}`,
      input: newTcInput,
      expectedOutput: newTcOutput,
      isSample: newTcIsSample,
      isHidden: newTcIsHidden,
    };
    setFormTestCases([...formTestCases, newTc]);
    setNewTcInput("");
    setNewTcOutput("");
    setNewTcIsSample(false);
    setNewTcIsHidden(false);
  };

  // Add Solution template
  const handleAddSolution = () => {
    if (!newSolTitle || !newSolCode) return;
    const newSol: ProblemSolution = {
      id: `sol-${Date.now()}`,
      title: newSolTitle,
      description: "",
      code: newSolCode,
      language: newSolLang,
      isOptimized: formSolutions.length === 0, // default first to optimized
    };
    setFormSolutions([...formSolutions, newSol]);
    setNewSolTitle("");
    setNewSolCode("");
  };

  // Save Form Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const targetId = editingProblem ? editingProblem.id : `prob-${Date.now()}`;
    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Standard default templates for TS, Python, C++
    const templates = editingProblem?.templates || {
      TypeScript: `function solve(args: any): any {\n  // template\n}`,
      Python: `def solve(args):\n  pass`,
      "C++": `class Solution {\npublic:\n  void solve() {}\n};`,
    };

    const problemData: DsaProblem = {
      id: targetId,
      title: formTitle,
      slug,
      statement: formStatement,
      description: formDescription,
      constraints: formConstraints,
      inputFormat: formInputFormat,
      outputFormat: formOutputFormat,
      sampleInput: formSampleInput,
      sampleOutput: formSampleOutput,
      explanation: formExplanation,
      notes: "Saved from admin manager console.",
      hints: editingProblem?.hints || ["Identify complexity", "Optimize space"],
      difficulty: formDifficulty,
      topics: formTopics,
      tags: formTags,
      timeComplexity: formTimeComplexity,
      spaceComplexity: formSpaceComplexity,
      testCases: formTestCases,
      solutions: formSolutions,
      templates,
      status: formStatus,
      solvesCount: editingProblem?.solvesCount || 0,
      acceptanceRate: editingProblem?.acceptanceRate || 50.0,
      discussionCount: editingProblem?.discussionCount || 0,
    };

    saveProblemMutation.mutate(problemData, {
      onSuccess: () => {
        setIsDrawerOpen(false);
      },
    });
  };

  // Filter Logic
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prob.statement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || prob.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "All" || prob.status === statusFilter;
    const matchesTopic = topicFilter === "All" || prob.topics.includes(topicFilter);
    return matchesSearch && matchesDifficulty && matchesStatus && matchesTopic;
  });

  const toggleSelectProblem = (id: string) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Analytics helper variables
  const totalCount = problems.length;
  const publishedCount = problems.filter((p) => p.status === "published").length;
  const draftCount = problems.filter((p) => p.status === "draft").length;

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;
  const expertCount = problems.filter((p) => p.difficulty === "Expert").length;

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Practice Workspace"
        description="Configure algorithms, coding challenges, categories, templates, Q&A boards, and live assessment criteria."
        icon={Code2}
        breadcrumbs={[{ label: "Admin" }, { label: "Practice" }, { label: activeTab.toUpperCase() }]}
        actions={
          activeTab === "problems"
            ? [
                {
                  label: "Add DSA Problem",
                  onClick: handleOpenCreate,
                  icon: Plus,
                },
              ]
            : undefined
        }
      />

      {/* Primary Subpage switch board (tabs) */}
      <div className="flex border-b border-[var(--sb-border)] gap-2 scrollbar-none overflow-x-auto pb-px">
        {(
          [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "problems", label: "DSA Problems", icon: Code2 },
            { id: "categories", label: "Categories", icon: Layers },
            { id: "tags", label: "Tags", icon: Database },
            { id: "difficulty", label: "Difficulty Levels", icon: Binary },
            { id: "languages", label: "Languages", icon: Terminal },
            { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all relative active:scale-[0.98]"
            style={{
              borderColor: activeTab === t.id ? "var(--sb-accent)" : "transparent",
              color: activeTab === t.id ? "var(--sb-ink)" : "var(--sb-ink-dim)",
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: PRACTICE DASHBOARD
          ========================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 stagger-item">
          {/* Quick counters grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total DSA Problems"
              value={totalCount}
              description="Algorithmic challenges mapped"
              icon={Code2}
              isLoading={isLoading}
            />
            <MetricCard
              title="Published Problems"
              value={publishedCount}
              description="Live for practice workspace"
              icon={Eye}
              isLoading={isLoading}
            />
            <MetricCard
              title="Pending Drafts"
              value={draftCount}
              description="Problems in preparation phase"
              icon={FileText}
              isLoading={isLoading}
            />
            <MetricCard
              title="Difficulty Ratio"
              value={`${easyCount}E / ${mediumCount}M`}
              description="Distribution balance rating"
              icon={Binary}
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart section */}
            <div className="lg:col-span-2 island-shell rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>
                  Daily Submissions Flow
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Submission rates across algorithmic environments
                </p>
              </div>
              <DashboardChart
                data={[
                  { date: "Jun 20", solves: 420 },
                  { date: "Jun 21", solves: 480 },
                  { date: "Jun 22", solves: 510 },
                  { date: "Jun 23", solves: 390 },
                  { date: "Jun 24", solves: 460 },
                  { date: "Jun 25", solves: 580 },
                  { date: "Jun 26", solves: 620 },
                ]}
                dataKey="solves"
                labelKey="date"
                type="bar"
                color="var(--sb-accent)"
              />
            </div>

            {/* Quick stats distribution panel */}
            <div className="island-shell rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>
                  Difficulty Weight Distribution
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Algorithmic complexity balances
                </p>
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Easy Challenges", count: easyCount, pct: totalCount ? (easyCount / totalCount) * 100 : 0, color: "bg-emerald-500" },
                  { label: "Medium Challenges", count: mediumCount, pct: totalCount ? (mediumCount / totalCount) * 100 : 0, color: "bg-amber-500" },
                  { label: "Hard Challenges", count: hardCount, pct: totalCount ? (hardCount / totalCount) * 100 : 0, color: "bg-rose-500" },
                  { label: "Expert Challenges", count: expertCount, pct: totalCount ? (expertCount / totalCount) * 100 : 0, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span style={{ color: "var(--sb-ink)" }}>{item.label}</span>
                      <span style={{ color: "var(--sb-ink-dim)" }}>
                        {item.count} ({Math.round(item.pct)}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: DSA PROBLEMS CRUD
          ========================================== */}
      {activeTab === "problems" && (
        <div className="space-y-4 stagger-item">
          {/* Filters & search line */}
          <div className="island-shell rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search DSA problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs outline-none focus:border-ring"
                style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Filter size={12} />
                Filters:
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg text-xs outline-none"
                style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
              >
                <option value="All">Difficulty (All)</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg text-xs outline-none"
                style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
              >
                <option value="All">Status (All)</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg text-xs outline-none"
                style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
              >
                <option value="All">Topics (All)</option>
                {ALL_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => refetch()}
                className="p-2 border rounded-lg hover:bg-muted/40 transition active:scale-95 text-muted-foreground"
                style={{ borderColor: "var(--sb-border)" }}
                title="Reload dataset"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Bulk actions options bar */}
          {selectedProblems.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border border-[var(--sb-border)] rounded-lg text-xs font-semibold">
              <div className="text-muted-foreground">
                {selectedProblems.length} problems selected
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange("published")}
                  className="px-2.5 py-1 border rounded bg-background text-[11px] font-bold hover:bg-muted/50 transition"
                >
                  Bulk Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange("archived")}
                  className="px-2.5 py-1 border rounded bg-background text-[11px] font-bold hover:bg-muted/50 transition"
                >
                  Bulk Archive
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-2.5 py-1 border border-destructive/20 text-destructive rounded bg-destructive/10 text-[11px] font-bold hover:bg-destructive/20 transition"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Problems Table Grid */}
          <div className="island-shell rounded-xl overflow-hidden border">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--sb-border)] bg-muted/40" style={{ color: "var(--sb-ink-dim)" }}>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                        onChange={() => {
                          if (selectedProblems.length === filteredProblems.length) {
                            setSelectedProblems([]);
                          } else {
                            setSelectedProblems(filteredProblems.map((p) => p.id));
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 font-bold">Problem</th>
                    <th className="p-4 font-bold">Difficulty</th>
                    <th className="p-4 font-bold">Topics</th>
                    <th className="p-4 font-bold">Time / Space</th>
                    <th className="p-4 font-bold">Solves / Acceptance</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sb-border)]">
                  {isLoading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n} className="animate-pulse h-12 bg-card">
                        <td colSpan={8} className="p-4 text-center text-muted-foreground">
                          Loading problem metrics...
                        </td>
                      </tr>
                    ))
                  ) : filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No problems found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-muted/10 transition-colors bg-card">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProblems.includes(prob.id)}
                            onChange={() => toggleSelectProblem(prob.id)}
                          />
                        </td>
                        <td className="p-4 font-semibold text-[13px]" style={{ color: "var(--sb-ink)" }}>
                          <div>{prob.title}</div>
                          <span className="text-[10px] text-muted-foreground font-medium truncate block max-w-xs mt-0.5">
                            {prob.statement}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              background:
                                prob.difficulty === "Easy"
                                  ? "oklch(0.72 0.16 142 / 0.1)"
                                  : prob.difficulty === "Medium"
                                    ? "oklch(0.75 0.15 76 / 0.1)"
                                    : prob.difficulty === "Hard"
                                      ? "oklch(0.58 0.24 27 / 0.1)"
                                      : "oklch(0.5 0.2 300 / 0.1)",
                              color:
                                prob.difficulty === "Easy"
                                  ? "oklch(0.58 0.16 142)"
                                  : prob.difficulty === "Medium"
                                    ? "oklch(0.65 0.15 76)"
                                    : prob.difficulty === "Hard"
                                      ? "oklch(0.58 0.24 27)"
                                      : "oklch(0.5 0.2 300)",
                            }}
                          >
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="p-4 max-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {prob.topics.slice(0, 2).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                                {t}
                              </span>
                            ))}
                            {prob.topics.length > 2 && (
                              <span className="text-[10px] font-bold text-muted-foreground">+{prob.topics.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-muted-foreground">
                          {prob.timeComplexity} / {prob.spaceComplexity}
                        </td>
                        <td className="p-4 font-semibold tabular-nums" style={{ color: "var(--sb-ink-muted)" }}>
                          {prob.solvesCount.toLocaleString()} solves ({prob.acceptanceRate}%)
                        </td>
                        <td className="p-4">
                          <StatusBadge
                            status={
                              prob.status === "published"
                                ? "active"
                                : prob.status === "archived"
                                  ? "inactive"
                                  : "pending"
                            }
                            className="text-[9px] uppercase font-bold"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prob)}
                              className="p-1.5 border rounded hover:bg-muted transition text-muted-foreground active:scale-95"
                              title="Edit problem settings"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(prob)}
                              className="p-1.5 border rounded hover:bg-muted transition text-muted-foreground active:scale-95"
                              title="Duplicate problem"
                            >
                              <Copy size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  prob,
                                  prob.status === "published" ? "draft" : "published"
                                )
                              }
                              className="p-1.5 border rounded hover:bg-muted transition text-muted-foreground active:scale-95"
                              title={prob.status === "published" ? "Unpublish problem" : "Publish problem"}
                            >
                              {prob.status === "published" ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prob.id)}
                              className="p-1.5 border border-destructive/20 text-destructive rounded hover:bg-destructive/10 transition active:scale-95"
                              title="Delete problem"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          METADATA CONFIGS TABS (STUBS/MOCKS FOR CONFIGURATION METRICS)
          ========================================== */}
      {["categories", "tags", "difficulty", "languages", "analytics"].includes(activeTab) && (
        <div className="island-shell rounded-xl p-6 stagger-item space-y-4">
          <div className="flex items-center gap-3">
            <Settings className="text-[var(--sb-accent)]" size={18} />
            <div>
              <h3 className="text-sm font-bold capitalize" style={{ color: "var(--sb-ink)" }}>
                {activeTab} Management Panel
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Configure taxonomy parameters and environment settings.
              </p>
            </div>
          </div>

          <div className="border border-dashed rounded-lg p-10 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <Layers size={36} className="text-muted-foreground opacity-60" />
            <div className="space-y-1.5 max-w-sm">
              <span className="text-xs font-bold block" style={{ color: "var(--sb-ink)" }}>
                Dynamic Metadata Customization
              </span>
              <span className="text-[11px] text-muted-foreground leading-relaxed block">
                Manage global difficulty definitions, editorial compiler languages, tags, and category taxonomies. Edits here propagate to all DSA curation cards.
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg border text-xs font-bold hover:bg-muted/40 transition active:scale-95"
                style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
              >
                Add New Config Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PROBLEM CRUD MODAL / DRAWER
          ========================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs select-none">
          <div
            className="w-full max-w-4xl h-full bg-card border-l flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250 ease-drawer"
            style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)" }}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[var(--sb-border)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>
                  {editingProblem ? `Edit Problem: ${editingProblem.title}` : "Create New DSA Problem"}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Fill in problem statements, complexity limits, templates, and editorial content.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs font-bold text-muted-foreground hover:text-[var(--sb-ink)] transition"
              >
                Close (ESC)
              </button>
            </div>

            {/* Drawer Body (Scrollable form) */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Find Median of Matrix"
                    className="w-full p-2 border rounded-lg outline-none focus:border-ring"
                    style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                  />
                </div>

                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                    Difficulty *
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full p-2 border rounded-lg outline-none"
                    style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Statement */}
              <div className="space-y-1.5">
                <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                  Problem Statement (Summary) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formStatement}
                  onChange={(e) => setFormStatement(e.target.value)}
                  placeholder="Short description shown in list views..."
                  className="w-full p-2 border rounded-lg outline-none focus:border-ring resize-y"
                  style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                  Rich Description / Examples *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed explanation, markdown friendly..."
                  className="w-full p-2 border rounded-lg outline-none focus:border-ring resize-y font-mono text-[11px]"
                  style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Constraints */}
                <div className="space-y-1.5">
                  <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                    Constraints
                  </label>
                  <textarea
                    rows={3}
                    value={formConstraints}
                    onChange={(e) => setFormConstraints(e.target.value)}
                    placeholder="e.g. - 1 <= nums.length <= 10^5"
                    className="w-full p-2 border rounded-lg outline-none focus:border-ring font-mono text-[11px]"
                    style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                  />
                </div>

                {/* Hints */}
                <div className="space-y-1.5">
                  <label className="font-bold" style={{ color: "var(--sb-ink-dim)" }}>
                    Complexity Budgets
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="text"
                      value={formTimeComplexity}
                      onChange={(e) => setFormTimeComplexity(e.target.value)}
                      placeholder="Time Complexity"
                      className="p-2 border rounded-lg outline-none"
                      style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                    />
                    <input
                      type="text"
                      value={formSpaceComplexity}
                      onChange={(e) => setFormSpaceComplexity(e.target.value)}
                      placeholder="Space Complexity"
                      className="p-2 border rounded-lg outline-none"
                      style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="p-2 border rounded-lg outline-none"
                      style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Topics / Tags Assignments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold block" style={{ color: "var(--sb-ink-dim)" }}>
                    Topics assignment
                  </label>
                  <div className="flex flex-wrap gap-1.5 border p-2 rounded-lg max-h-32 overflow-y-auto" style={{ borderColor: "var(--sb-border)" }}>
                    {ALL_TOPICS.map((topic) => {
                      const selected = formTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() =>
                            setFormTopics((prev) =>
                              selected ? prev.filter((t) => t !== topic) : [...prev, topic]
                            )
                          }
                          className="px-2 py-0.5 rounded text-[10px] font-bold border transition active:scale-95"
                          style={{
                            backgroundColor: selected ? "var(--sb-accent)" : "transparent",
                            color: selected ? "var(--sb-accent-foreground)" : "var(--sb-ink-dim)",
                            borderColor: "var(--sb-border)",
                          }}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold block" style={{ color: "var(--sb-ink-dim)" }}>
                    Tags assignment
                  </label>
                  <div className="flex flex-wrap gap-1.5 border p-2 rounded-lg max-h-32 overflow-y-auto" style={{ borderColor: "var(--sb-border)" }}>
                    {ALL_TAGS.map((tag) => {
                      const selected = formTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setFormTags((prev) =>
                              selected ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className="px-2 py-0.5 rounded text-[10px] font-bold border transition active:scale-95"
                          style={{
                            backgroundColor: selected ? "var(--sb-accent)" : "transparent",
                            color: selected ? "var(--sb-accent-foreground)" : "var(--sb-ink-dim)",
                            borderColor: "var(--sb-border)",
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sub-form: Test cases */}
              <div className="border border-[var(--sb-border)] rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-[11px] tracking-wider text-muted-foreground">
                  Test Case Management
                </h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="font-semibold text-muted-foreground text-[10px]">Test Input</label>
                    <input
                      type="text"
                      value={newTcInput}
                      onChange={(e) => setNewTcInput(e.target.value)}
                      placeholder="e.g. [1,2,3]\n4"
                      className="w-full p-1.5 border rounded"
                      style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="font-semibold text-muted-foreground text-[10px]">Expected Output</label>
                    <input
                      type="text"
                      value={newTcOutput}
                      onChange={(e) => setNewTcOutput(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full p-1.5 border rounded"
                      style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <label className="flex items-center gap-1 font-semibold text-[10px]">
                      <input
                        type="checkbox"
                        checked={newTcIsSample}
                        onChange={(e) => setNewTcIsSample(e.target.checked)}
                      />
                      Is Sample
                    </label>
                    <label className="flex items-center gap-1 font-semibold text-[10px]">
                      <input
                        type="checkbox"
                        checked={newTcIsHidden}
                        onChange={(e) => setNewTcIsHidden(e.target.checked)}
                      />
                      Is Hidden
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="px-3 py-1.5 border rounded font-bold hover:bg-muted transition"
                  >
                    Add
                  </button>
                </div>

                {formTestCases.length > 0 ? (
                  <div className="border rounded overflow-hidden divide-y" style={{ borderColor: "var(--sb-border)" }}>
                    {formTestCases.map((tc, index) => (
                      <div key={tc.id} className="p-2 flex items-center justify-between bg-muted/20">
                        <div className="font-mono text-[10px] space-y-0.5">
                          <div>Input: {tc.input}</div>
                          <div>Expected: {tc.expectedOutput}</div>
                          <div className="text-[9px] text-muted-foreground font-semibold flex gap-2">
                            {tc.isSample && <span className="text-emerald-600">Sample case</span>}
                            {tc.isHidden && <span className="text-amber-600">Hidden case</span>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormTestCases(formTestCases.filter((t) => t.id !== tc.id))}
                          className="text-destructive hover:opacity-80 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-muted-foreground italic text-[11px]">
                    No test cases defined yet.
                  </div>
                )}
              </div>

              {/* Sub-form: Solution Editorials */}
              <div className="border border-[var(--sb-border)] rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-[11px] tracking-wider text-muted-foreground">
                  Solution Codes & Editorials
                </h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="font-semibold text-muted-foreground text-[10px]">Solution Title</label>
                    <input
                      type="text"
                      value={newSolTitle}
                      onChange={(e) => setNewSolTitle(e.target.value)}
                      placeholder="e.g. Iterative stack solution"
                      className="w-full p-1.5 border rounded"
                      style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <label className="font-semibold text-muted-foreground text-[10px]">Language</label>
                    <select
                      value={newSolLang}
                      onChange={(e) => setNewSolLang(e.target.value)}
                      className="w-full p-1.5 border rounded"
                      style={{ borderColor: "var(--sb-border)", background: "var(--card-bg)", color: "var(--sb-ink)" }}
                    >
                      <option value="TypeScript">TypeScript</option>
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground text-[10px]">Solution Code</label>
                  <textarea
                    rows={4}
                    value={newSolCode}
                    onChange={(e) => setNewSolCode(e.target.value)}
                    placeholder="class Solution {\n  ...\n}"
                    className="w-full p-2 border rounded font-mono text-[11px]"
                    style={{ background: "transparent", borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSolution}
                  className="px-3.5 py-1.5 border rounded font-bold hover:bg-muted transition self-start"
                >
                  Add Solution
                </button>

                {formSolutions.length > 0 ? (
                  <div className="border rounded overflow-hidden divide-y" style={{ borderColor: "var(--sb-border)" }}>
                    {formSolutions.map((sol) => (
                      <div key={sol.id} className="p-2.5 flex items-center justify-between bg-muted/20">
                        <div>
                          <div className="font-bold">{sol.title}</div>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Language: {sol.language} {sol.isOptimized && "(Optimized)"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormSolutions(formSolutions.filter((s) => s.id !== sol.id))}
                          className="text-destructive hover:opacity-80 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-muted-foreground italic text-[11px]">
                    No solution codes posted.
                  </div>
                )}
              </div>
            </form>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-[var(--sb-border)] flex items-center justify-end gap-3 bg-muted/30">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border rounded-lg font-semibold hover:bg-muted transition active:scale-95"
                style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[var(--sb-accent)] text-[var(--sb-accent-foreground)] rounded-lg font-bold hover:opacity-90 transition active:scale-95"
              >
                Save Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
