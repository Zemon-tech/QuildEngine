import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Code2,
  Copy,
  Edit2,
  HelpCircle,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { DashboardChart } from "#/components/admin/dashboard-chart";
import { MetricCard } from "#/components/admin/metric-card";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import {
  type CodingContest,
  type TestAssessment,
  type TestAttempt,
  useDeleteContest,
  useDeleteTest,
  useDsaProblems,
  useSaveContest,
  useSaveTest,
  useTestsAndContests,
} from "#/hooks/use-practice-state";

const assessmentsSearchSchema = z.object({
  tab: z.enum(["tests", "contests", "analytics"]).optional().catch("tests"),
});

export const Route = createFileRoute("/_admin/practice/assessments/")({
  validateSearch: (search) => assessmentsSearchSchema.parse(search),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const { tab = "tests" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const activeTab = tab || "tests";

  const setActiveTab = (newTab: "tests" | "contests" | "analytics") => {
    navigate({ search: (prev) => ({ ...prev, tab: newTab }) });
  };

  // Queries & Mutations
  const { data, isLoading } = useTestsAndContests();
  const { data: dsaProblems = [] } = useDsaProblems();
  const saveTestMutation = useSaveTest();
  const deleteTestMutation = useDeleteTest();
  const saveContestMutation = useSaveContest();
  const deleteContestMutation = useDeleteContest();

  const tests = data?.tests || [];
  const contests = data?.contests || [];

  // Local state for modals/drawers
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestAssessment | null>(null);

  const [isContestDrawerOpen, setIsContestDrawerOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<CodingContest | null>(
    null,
  );

  // Test form fields
  const [testTitle, setTestTitle] = useState("");
  const [testType, setTestType] = useState<
    "Technical" | "Aptitude" | "Mock Interview" | "Assessment"
  >("Technical");
  const [testTimeLimit, setTestTimeLimit] = useState(60);
  const [testPassingCriteria, setTestPassingCriteria] = useState(70);
  const [testEasyCount, setTestEasyCount] = useState(2);
  const [testMediumCount, setTestMediumCount] = useState(2);
  const [testHardCount, setTestHardCount] = useState(1);
  const [testIsRandomized, setTestIsRandomized] = useState(false);
  const [testProctoring, setTestProctoring] = useState(false);
  const [testQuestionPoolSize, setTestQuestionPoolSize] = useState(10);
  const [testStatus, setTestStatus] = useState<"published" | "draft">("draft");

  // Contest form fields
  const [contestTitle, setContestTitle] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [contestEndDate, setContestEndDate] = useState("");
  const [contestStatus, setContestStatus] = useState<
    "upcoming" | "active" | "completed"
  >("upcoming");
  const [contestRules, setContestRules] = useState("");
  const [contestPenalties, setContestPenalties] = useState("");
  const [contestProblems, setContestProblems] = useState<string[]>([]);

  // Search/Filters
  const [_searchTerm, _setSearchTerm] = useState("");

  // Open Create Test Form
  const handleOpenCreateTest = () => {
    setEditingTest(null);
    setTestTitle("");
    setTestType("Technical");
    setTestTimeLimit(60);
    setTestPassingCriteria(70);
    setTestEasyCount(3);
    setTestMediumCount(3);
    setTestHardCount(1);
    setTestIsRandomized(true);
    setTestProctoring(false);
    setTestQuestionPoolSize(15);
    setTestStatus("draft");
    setIsTestDrawerOpen(true);
  };

  // Open Edit Test Form
  const handleOpenEditTest = (test: TestAssessment) => {
    setEditingTest(test);
    setTestTitle(test.title);
    setTestType(test.type);
    setTestTimeLimit(test.timeLimit);
    setTestPassingCriteria(test.passingCriteria);
    setTestEasyCount(test.difficultyDistribution?.easy || 0);
    setTestMediumCount(test.difficultyDistribution?.medium || 0);
    setTestHardCount(test.difficultyDistribution?.hard || 0);
    setTestIsRandomized(test.isRandomized);
    setTestProctoring(test.proctoringEnabled);
    setTestQuestionPoolSize(test.questionPoolSize);
    setTestStatus(test.status);
    setIsTestDrawerOpen(true);
  };

  // Save Test Form
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    const targetId = editingTest ? editingTest.id : `test-${Date.now()}`;
    const testData: TestAssessment = {
      id: targetId,
      title: testTitle.trim(),
      type: testType,
      timeLimit: Number(testTimeLimit),
      passingCriteria: Number(testPassingCriteria),
      difficultyDistribution: {
        easy: Number(testEasyCount),
        medium: Number(testMediumCount),
        hard: Number(testHardCount),
      },
      isRandomized: testIsRandomized,
      proctoringEnabled: testProctoring,
      questionPoolSize: Number(testQuestionPoolSize),
      status: testStatus,
      attemptsCount: editingTest?.attemptsCount || 0,
      averageScorePercent: editingTest?.averageScorePercent || 0,
      passRatePercent: editingTest?.passRatePercent || 0,
      completedTimeAvg: editingTest?.completedTimeAvg || 0,
      recentAttempts: editingTest?.recentAttempts || [],
    };

    saveTestMutation.mutate(testData, {
      onSuccess: () => {
        setIsTestDrawerOpen(false);
      },
    });
  };

  // Duplicate Test
  const handleDuplicateTest = (test: TestAssessment) => {
    const duplicated: TestAssessment = {
      ...test,
      id: `test-${Date.now()}`,
      title: `${test.title} (Copy)`,
      status: "draft",
      attemptsCount: 0,
      averageScorePercent: 0,
      passRatePercent: 0,
      recentAttempts: [],
    };
    saveTestMutation.mutate(duplicated);
  };

  // Delete Test
  const handleDeleteTest = (id: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      deleteTestMutation.mutate(id);
    }
  };

  // Open Create Contest Form
  const handleOpenCreateContest = () => {
    setEditingContest(null);
    setContestTitle("");
    setContestStartDate(
      new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    ); // default to tomorrow
    setContestEndDate(
      new Date(Date.now() + 86400000 + 7200000).toISOString().slice(0, 16),
    ); // 2 hours duration
    setContestStatus("upcoming");
    setContestRules("Standard contest constraints apply.");
    setContestPenalties("50-minute penalty per wrong submission.");
    setContestProblems([]);
    setIsContestDrawerOpen(true);
  };

  // Open Edit Contest Form
  const handleOpenEditContest = (contest: CodingContest) => {
    setEditingContest(contest);
    setContestTitle(contest.title);

    // Format dates to fit datetime-local inputs (YYYY-MM-DDTHH:MM)
    const startStr = contest.startDate ? contest.startDate.slice(0, 16) : "";
    const endStr = contest.endDate ? contest.endDate.slice(0, 16) : "";

    setContestStartDate(startStr);
    setContestEndDate(endStr);
    setContestStatus(contest.status);
    setContestRules(contest.rules);
    setContestPenalties(contest.penalties);
    setContestProblems(contest.problems || []);
    setIsContestDrawerOpen(true);
  };

  // Save Contest Form
  const handleSaveContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestTitle.trim()) return;

    const targetId = editingContest
      ? editingContest.id
      : `contest-${Date.now()}`;
    const contestData: CodingContest = {
      id: targetId,
      title: contestTitle.trim(),
      startDate: contestStartDate,
      endDate: contestEndDate,
      registrationCount: editingContest?.registrationCount || 0,
      rules: contestRules,
      penalties: contestPenalties,
      problems: contestProblems,
      winners: editingContest?.winners || [],
      status: contestStatus,
    };

    saveContestMutation.mutate(contestData, {
      onSuccess: () => {
        setIsContestDrawerOpen(false);
      },
    });
  };

  // Toggle Contest Problem choice
  const handleToggleContestProblem = (title: string) => {
    setContestProblems((prev) =>
      prev.includes(title) ? prev.filter((p) => p !== title) : [...prev, title],
    );
  };

  // Delete Contest
  const handleDeleteContest = (id: string) => {
    if (confirm("Are you sure you want to delete this contest?")) {
      deleteContestMutation.mutate(id);
    }
  };

  // Gather All Test Attempts for analytics
  const allAttempts: (TestAttempt & { testTitle: string })[] = [];
  let totalScoreSum = 0;
  let totalPassCount = 0;

  for (const t of tests) {
    if (t.recentAttempts) {
      for (const att of t.recentAttempts) {
        allAttempts.push({
          ...att,
          testTitle: t.title,
        });
        totalScoreSum += att.scorePercent;
        if (att.status === "passed") {
          totalPassCount++;
        }
      }
    }
  }

  const avgPassRate = allAttempts.length
    ? Math.round((totalPassCount / allAttempts.length) * 100)
    : 0;
  const avgAttemptScore = allAttempts.length
    ? Math.round(totalScoreSum / allAttempts.length)
    : 0;

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Assessments Workspace"
        description="Schedule platform coding contests, design mock assessments, configure automated proctor rules, and audit results."
        icon={ClipboardList}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Practice" },
          { label: "Assessments" },
        ]}
        actions={
          activeTab === "tests"
            ? [
                {
                  label: "Add Assessment",
                  onClick: handleOpenCreateTest,
                  icon: Plus,
                },
              ]
            : activeTab === "contests"
              ? [
                  {
                    label: "Schedule Contest",
                    onClick: handleOpenCreateContest,
                    icon: Plus,
                  },
                ]
              : undefined
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-(--sb-border) gap-2 scrollbar-none overflow-x-auto pb-px">
        {(
          [
            { id: "tests", label: "Mock Assessments", icon: ClipboardList },
            { id: "contests", label: "Coding Contests", icon: Calendar },
            { id: "analytics", label: "Attempts & Analytics", icon: BarChart3 },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all relative active:scale-[0.98]"
            style={{
              borderColor:
                activeTab === t.id ? "var(--sb-accent)" : "transparent",
              color: activeTab === t.id ? "var(--sb-ink)" : "var(--sb-ink-dim)",
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: MOCK ASSESSMENTS (TESTS)
          ========================================== */}
      {activeTab === "tests" && (
        <div className="space-y-4 stagger-item">
          {isLoading ? (
            <div className="text-center p-8 text-xs text-muted-foreground">
              Loading assessments...
            </div>
          ) : tests.length === 0 ? (
            <div className="island-shell rounded-xl p-12 text-center text-xs text-muted-foreground">
              No assessments templates configured yet. Click "Add Assessment" to
              configure one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="island-shell rounded-xl p-5 border border-(--sb-border) flex flex-col justify-between space-y-4 hover:border-neutral-400/30 transition-all text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded text-[9px]">
                        {test.type}
                      </span>
                      <StatusBadge
                        status={
                          test.status === "published" ? "success" : "warning"
                        }
                      >
                        {test.status}
                      </StatusBadge>
                    </div>

                    <h4
                      className="text-xs font-extrabold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {test.title}
                    </h4>

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 text-[10px] text-muted-foreground border-t border-(--sb-border)/50">
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-indigo-400" />
                        <span>{test.timeLimit} mins limit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={11} className="text-indigo-400" />
                        <span>Pass: {test.passingCriteria}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={11} className="text-indigo-400" />
                        <span>
                          Proctor: {test.proctoringEnabled ? "ON" : "OFF"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HelpCircle size={11} className="text-indigo-400" />
                        <span>{test.questionPoolSize} Qs pool</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary performance stubs */}
                  <div className="bg-muted/40 p-3 rounded-lg border border-(--sb-border)/50 grid grid-cols-3 text-center text-[10px]">
                    <div>
                      <span className="text-muted-foreground block font-bold text-[8px]">
                        Attempts
                      </span>
                      <span
                        className="font-extrabold mt-0.5 block"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {test.attemptsCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-bold text-[8px]">
                        Avg Score
                      </span>
                      <span className="font-extrabold mt-0.5 block text-indigo-400">
                        {test.averageScorePercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-bold text-[8px]">
                        Pass Rate
                      </span>
                      <span className="font-extrabold mt-0.5 block text-emerald-500">
                        {test.passRatePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Card actions footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-(--sb-border)/50">
                    <span className="text-[9px] text-muted-foreground">
                      Dist: {test.difficultyDistribution?.easy}E /{" "}
                      {test.difficultyDistribution?.medium}M /{" "}
                      {test.difficultyDistribution?.hard}H
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditTest(test)}
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-all active:scale-[0.98]"
                        title="Edit parameters"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateTest(test)}
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-all active:scale-[0.98]"
                        title="Duplicate assessment"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-all active:scale-[0.98]"
                        title="Delete template"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: CODING CONTESTS
          ========================================== */}
      {activeTab === "contests" && (
        <div className="space-y-4 stagger-item">
          {isLoading ? (
            <div className="text-center p-8 text-xs text-muted-foreground">
              Loading contests...
            </div>
          ) : contests.length === 0 ? (
            <div className="island-shell rounded-xl p-12 text-center text-xs text-muted-foreground">
              No live coding contests scheduled. Click "Schedule Contest" to
              create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contests.map((contest) => {
                const isUpcoming = contest.status === "upcoming";
                const isActive = contest.status === "active";
                const _isCompleted = contest.status === "completed";
                const statusColor = isActive
                  ? "success"
                  : isUpcoming
                    ? "warning"
                    : "default";

                return (
                  <div
                    key={contest.id}
                    className="island-shell rounded-xl p-5 border border-(--sb-border) flex flex-col justify-between space-y-4 hover:border-neutral-400/30 transition-all text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar size={11} className="text-indigo-400" />
                          <span>{contest.startDate.replace("T", " ")}</span>
                        </div>
                        <StatusBadge status={statusColor}>
                          {contest.status}
                        </StatusBadge>
                      </div>

                      <h4
                        className="text-xs font-extrabold"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {contest.title}
                      </h4>

                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Rules:</strong>{" "}
                        {contest.rules}
                      </p>

                      {/* Displaying selected problems */}
                      <div className="pt-2 border-t border-[var(--sb-border)]/55 space-y-1.5">
                        <span className="text-[9px] font-bold text-muted-foreground block">
                          Assigned DSA Problems ({contest.problems?.length || 0}
                          )
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {contest.problems?.map((prob) => (
                            <span
                              key={prob}
                              className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[9px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              <Code2 size={9} />
                              {prob}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-lg border border-(--sb-border)/50 flex justify-between items-center text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Users size={12} className="text-indigo-500" />
                        <span>
                          {contest.registrationCount} candidates registered
                        </span>
                      </div>

                      {contest.winners?.length > 0 && (
                        <div className="flex items-center gap-1 text-emerald-500 font-bold">
                          <Award size={12} />
                          <span className="truncate max-w-[120px]">
                            Winner: {contest.winners[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-(--sb-border)/50">
                      <span className="text-[9px] text-muted-foreground font-semibold">
                        Penalties: {contest.penalties || "None"}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditContest(contest)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-all active:scale-[0.98]"
                          title="Edit scheduling"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContest(contest.id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-all active:scale-[0.98]"
                          title="Delete Contest"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 3: RESULTS & ATTEMPTS ANALYTICS
          ========================================== */}
      {activeTab === "analytics" && (
        <div className="space-y-6 stagger-item">
          {/* Top summary metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Test Attempts"
              value={allAttempts.length}
              description="Assessed across all modules"
              icon={Users}
            />
            <MetricCard
              title="Global Average Score"
              value={`${avgAttemptScore}%`}
              description="Mean percent rating"
              icon={Award}
            />
            <MetricCard
              title="Global Pass Rate"
              value={`${avgPassRate}%`}
              description="Passing criteria filter index"
              icon={CheckCircle2}
            />
            <MetricCard
              title="Speed Completion Median"
              value="82 min"
              description="Average focus duration rate"
              icon={Clock}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Attempts table */}
            <div className="lg:col-span-2 island-shell rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-(--sb-border) pb-3">
                <div>
                  <h3
                    className="text-xs font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Audited Attempts History
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Realtime audit trails of mock assessments submissions
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--sb-border)]/50 text-[10px] text-muted-foreground">
                      <th className="pb-2 font-bold">
                        Candidate User
                      </th>
                      <th className="pb-2 font-bold">
                        Assessment Module
                      </th>
                      <th className="pb-2 font-bold text-center">
                        Score %
                      </th>
                      <th className="pb-2 font-bold text-center">
                        Duration
                      </th>
                      <th className="pb-2 font-bold text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--sb-border)/40">
                    {allAttempts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No candidate attempt records loaded.
                        </td>
                      </tr>
                    ) : (
                      allAttempts.map((attempt) => (
                        <tr key={attempt.id} className="hover:bg-muted/20">
                          <td
                            className="py-3 font-semibold"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {attempt.user}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {attempt.testTitle}
                          </td>
                          <td className="py-3 text-center font-bold text-indigo-400">
                            {attempt.scorePercent}%
                          </td>
                          <td className="py-3 text-center text-muted-foreground">
                            {attempt.timeTakenMinutes} mins
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                                attempt.status === "passed"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              {attempt.status === "passed" ? (
                                <CheckCircle2 size={9} />
                              ) : (
                                <XCircle size={9} />
                              )}
                              {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Charts and score brackets */}
            <div className="island-shell rounded-xl p-5 space-y-4">
              <div>
                <h3
                  className="text-xs font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Global Attempt Trends
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Mean average attempt outcomes over the recent period
                </p>
              </div>

              <DashboardChart
                data={[
                  { day: "Mon", attempts: 12 },
                  { day: "Tue", attempts: 18 },
                  { day: "Wed", attempts: 24 },
                  { day: "Thu", attempts: 15 },
                  { day: "Fri", attempts: 32 },
                  { day: "Sat", attempts: 40 },
                  { day: "Sun", attempts: 22 },
                ]}
                dataKey="attempts"
                labelKey="day"
                type="area"
                color="var(--sb-accent)"
              />

              {/* Score Bracket analysis */}
              <div className="border-t border-[var(--sb-border)]/50 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-muted-foreground block">
                  Score Bracket Distributions
                </span>

                <div className="space-y-2 text-[10px]">
                  {[
                    {
                      bracket: "Elite Bracket (90% - 100%)",
                      count: 8,
                      pct: 40,
                      color: "bg-emerald-500",
                    },
                    {
                      bracket: "Passing Bracket (70% - 89%)",
                      count: 7,
                      pct: 35,
                      color: "bg-indigo-500",
                    },
                    {
                      bracket: "Needs Practice (50% - 69%)",
                      count: 3,
                      pct: 15,
                      color: "bg-amber-500",
                    },
                    {
                      bracket: "Critical Review (< 50%)",
                      count: 2,
                      pct: 10,
                      color: "bg-rose-500",
                    },
                  ].map((item) => (
                    <div key={item.bracket} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span style={{ color: "var(--sb-ink)" }}>
                          {item.bracket}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} items ({item.pct}%)
                        </span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DRAWER 1: CREATE/EDIT MOCK TEST
          ========================================== */}
      {isTestDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-lg bg-background border-l border-(--sb-border) p-6 h-full overflow-y-auto flex flex-col justify-between shadow-2xl">
            <form
              onSubmit={handleSaveTest}
              className="space-y-5 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-(--sb-border) pb-3">
                  <h3
                    className="text-sm font-bold flex items-center gap-1.5"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <ClipboardList size={16} className="text-indigo-500" />
                    {editingTest
                      ? "Edit Assessment Parameters"
                      : "Create New Assessment Template"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsTestDrawerOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-all active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs text-left">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-muted-foreground block">
                      <span>Assessment Title</span>
                      <input
                        type="text"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        placeholder="E.g. JavaScript Advanced Internals..."
                        className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring mt-1 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Category Type</span>
                      <select
                        value={testType}
                        onChange={(e) =>
                          setTestType(
                            e.target.value as
                              | "Technical"
                              | "Aptitude"
                              | "Mock Interview"
                              | "Assessment",
                          )
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      >
                        <option value="Technical">Technical</option>
                        <option value="Aptitude">Aptitude</option>
                        <option value="Mock Interview">Mock Interview</option>
                        <option value="Assessment">Assessment</option>
                      </select>
                    </label>

                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Publish Status</span>
                      <select
                        value={testStatus}
                        onChange={(e) =>
                          setTestStatus(e.target.value as "published" | "draft")
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Time Limit (minutes)</span>
                      <input
                        type="number"
                        value={testTimeLimit}
                        onChange={(e) =>
                          setTestTimeLimit(Number(e.target.value))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        min={5}
                        required
                      />
                    </label>

                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Passing Criteria (%)</span>
                      <input
                        type="number"
                        value={testPassingCriteria}
                        onChange={(e) =>
                          setTestPassingCriteria(Number(e.target.value))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        min={10}
                        max={100}
                        required
                      />
                    </label>
                  </div>

                  {/* Difficulty Distributions */}
                  <div className="border border-[var(--sb-border)] p-3.5 rounded-xl bg-muted/20 space-y-3">
                    <span className="text-[9px] font-bold text-muted-foreground block">
                      Target Difficulty Balance Distribution
                    </span>

                    <div className="grid grid-cols-3 gap-3">
                      <label className="text-[8px] font-bold text-muted-foreground block space-y-1">
                        <span>Easy Count</span>
                        <input
                          type="number"
                          value={testEasyCount}
                          onChange={(e) =>
                            setTestEasyCount(Number(e.target.value))
                          }
                          className="w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                          style={{
                            background: "transparent",
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                          min={0}
                          required
                        />
                      </label>
                      <label className="text-[8px] font-bold text-muted-foreground block space-y-1">
                        <span>Medium Count</span>
                        <input
                          type="number"
                          value={testMediumCount}
                          onChange={(e) =>
                            setTestMediumCount(Number(e.target.value))
                          }
                          className="w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                          style={{
                            background: "transparent",
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                          min={0}
                          required
                        />
                      </label>
                      <label className="text-[8px] font-bold text-muted-foreground block space-y-1">
                        <span>Hard Count</span>
                        <input
                          type="number"
                          value={testHardCount}
                          onChange={(e) =>
                            setTestHardCount(Number(e.target.value))
                          }
                          className="w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                          style={{
                            background: "transparent",
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                          min={0}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Questions Pool Limit</span>
                      <input
                        type="number"
                        value={testQuestionPoolSize}
                        onChange={(e) =>
                          setTestQuestionPoolSize(Number(e.target.value))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        min={1}
                        required
                      />
                    </label>

                    {/* Switches */}
                    <div className="flex flex-col justify-around gap-2 bg-muted/30 p-2 border border-(--sb-border)/60 rounded-lg">
                      <label className="flex items-center gap-2 text-[10px] font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testIsRandomized}
                          onChange={(e) =>
                            setTestIsRandomized(e.target.checked)
                          }
                          className="accent-indigo-500 rounded border-neutral-700"
                        />
                        <span>Shuffle & Randomize Questions</span>
                      </label>
                      <label className="flex items-center gap-2 text-[10px] font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testProctoring}
                          onChange={(e) => setTestProctoring(e.target.checked)}
                          className="accent-indigo-500 rounded border-neutral-700"
                        />
                        <span>Enable Proctor Verification</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-(--sb-border) mt-auto">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-(--sb-accent) hover:opacity-90 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  Save Assessment Template
                </button>
                <button
                  type="button"
                  onClick={() => setIsTestDrawerOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all active:scale-[0.98]"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          DRAWER 2: SCHEDULE CODING CONTEST
          ========================================== */}
      {isContestDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-lg bg-background border-l border-(--sb-border) p-6 h-full overflow-y-auto flex flex-col justify-between shadow-2xl">
            <form
              onSubmit={handleSaveContest}
              className="space-y-5 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-(--sb-border) pb-3">
                  <h3
                    className="text-sm font-bold flex items-center gap-1.5"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <Calendar size={16} className="text-indigo-500" />
                    {editingContest
                      ? "Edit Coding Contest"
                      : "Schedule Coding Contest Window"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsContestDrawerOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-all active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs text-left">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-muted-foreground block">
                      <span>Contest Title</span>
                      <input
                        type="text"
                        value={contestTitle}
                        onChange={(e) => setContestTitle(e.target.value)}
                        placeholder="E.g. Week 26: DFS Matrix Exploration..."
                        className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring mt-1 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Start Window Date/Time</span>
                      <input
                        type="datetime-local"
                        value={contestStartDate}
                        onChange={(e) => setContestStartDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        required
                      />
                    </label>

                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>End Window Date/Time</span>
                      <input
                        type="datetime-local"
                        value={contestEndDate}
                        onChange={(e) => setContestEndDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Contest Phase Status</span>
                      <select
                        value={contestStatus}
                        onChange={(e) =>
                          setContestStatus(
                            e.target.value as
                              | "upcoming"
                              | "active"
                              | "completed",
                          )
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </label>

                    <label className="text-[9px] font-bold text-muted-foreground block space-y-1">
                      <span>Penalty Submissions Rule</span>
                      <input
                        type="text"
                        value={contestPenalties}
                        onChange={(e) => setContestPenalties(e.target.value)}
                        placeholder="E.g. 50 points per failure..."
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring mt-0.5 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-muted-foreground block">
                      <span>General Rules Description</span>
                      <textarea
                        value={contestRules}
                        onChange={(e) => setContestRules(e.target.value)}
                        placeholder="General criteria..."
                        rows={2}
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-ring resize-none mt-1 block font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>
                  </div>

                  {/* Problem Selections list */}
                  <div className="border border-[var(--sb-border)] p-3 rounded-xl bg-muted/20 space-y-2">
                    <span className="text-[9px] font-bold text-muted-foreground block">
                      Assign DSA Problems to Contest Challenge
                    </span>

                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {dsaProblems.map((prob) => {
                        const isChosen = contestProblems.includes(prob.title);
                        return (
                          <button
                            key={prob.id}
                            type="button"
                            onClick={() =>
                              handleToggleContestProblem(prob.title)
                            }
                            className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all active:scale-[0.98] ${
                              isChosen
                                ? "border-indigo-500 bg-indigo-500/[0.03] text-indigo-500 font-bold"
                                : "border-neutral-800 hover:border-neutral-700"
                            }`}
                          >
                            <span className="truncate pr-1 text-[10px]">
                              {prob.title}
                            </span>
                            <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted/80 text-muted-foreground border">
                              {prob.difficulty}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-(--sb-border) mt-auto">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-(--sb-accent) hover:opacity-90 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  Schedule Contest Window
                </button>
                <button
                  type="button"
                  onClick={() => setIsContestDrawerOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all active:scale-[0.98]"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
