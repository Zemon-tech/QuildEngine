import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  Clock,
  Edit2,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  type LmsQuiz,
  type QuestionType,
  type QuizQuestion,
  useDeleteLmsQuiz,
  useLmsQuizzes,
  useLmsTopics,
  useSaveLmsQuiz,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/quizzes/")({
  component: LmsQuizzesPage,
});

const BLANK_QUIZ: LmsQuiz = {
  id: "",
  topicId: "",
  title: "",
  questions: [],
  timeLimit: 15,
  passingMarks: 70,
  randomize: false,
  attemptLimit: 3,
  status: "draft",
  attemptsCount: 0,
  averageScore: 0,
  createdAt: new Date().toISOString(),
};

const _BLANK_QUESTION: QuizQuestion = {
  id: "",
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
  points: 10,
};

function LmsQuizzesPage() {
  const { data: quizzes = [], isLoading } = useLmsQuizzes();
  const { data: topics = [] } = useLmsTopics();
  const saveQuiz = useSaveLmsQuiz();
  const deleteQuiz = useDeleteLmsQuiz();

  const [activeTab, setActiveTab] = useState<"list" | "builder">("list");
  const [search, setSearch] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<LmsQuiz>(BLANK_QUIZ);

  // Form states (Quiz Meta)
  const [formTitle, setFormTitle] = useState("");
  const [formTopicId, setFormTopicId] = useState("");
  const [formTimeLimit, setFormTimeLimit] = useState(15);
  const [formPassingMarks, setFormPassingMarks] = useState(70);
  const [formAttemptLimit, setFormAttemptLimit] = useState(3);
  const [formRandomize, setFormRandomize] = useState(false);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");

  // Question Builder States
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(
    null,
  );
  const [qType, setQType] = useState<QuestionType>("mcq");
  const [qQuestion, setQQuestion] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qAnswer, setQAnswer] = useState("");
  const [qExplanation, setQExplanation] = useState("");
  const [qPoints, setQPoints] = useState(10);

  const selectedQuiz = useMemo(() => {
    return quizzes.find((q) => q.id === selectedQuizId);
  }, [quizzes, selectedQuizId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const s = search.toLowerCase();
      return !search || q.title.toLowerCase().includes(s);
    });
  }, [quizzes, search]);

  const openCreate = () => {
    setEditQuiz(BLANK_QUIZ);
    setFormTitle("");
    setFormTopicId(topics[0]?.id || "");
    setFormTimeLimit(15);
    setFormPassingMarks(70);
    setFormAttemptLimit(3);
    setFormRandomize(false);
    setFormStatus("draft");
    setDrawerOpen(true);
  };

  const openEditMeta = (quiz: LmsQuiz) => {
    setEditQuiz(quiz);
    setFormTitle(quiz.title);
    setFormTopicId(quiz.topicId);
    setFormTimeLimit(quiz.timeLimit);
    setFormPassingMarks(quiz.passingMarks);
    setFormAttemptLimit(quiz.attemptLimit);
    setFormRandomize(quiz.randomize);
    setFormStatus(quiz.status);
    setDrawerOpen(true);
  };

  const handleSaveMeta = () => {
    if (!formTitle.trim() || !formTopicId) return;

    const saved: LmsQuiz = {
      ...editQuiz,
      id: editQuiz.id || `q_${Date.now()}`,
      title: formTitle,
      topicId: formTopicId,
      timeLimit: formTimeLimit,
      passingMarks: formPassingMarks,
      attemptLimit: formAttemptLimit,
      randomize: formRandomize,
      status: formStatus,
      // preserve existing questions/stats if editing
      questions: editQuiz.questions || [],
      attemptsCount: editQuiz.attemptsCount || 0,
      averageScore: editQuiz.averageScore || 0,
    };

    saveQuiz.mutate(saved, {
      onSuccess: (res) => {
        setDrawerOpen(false);
        if (!editQuiz.id) {
          // If created a new quiz, automatically select it and open builder
          setSelectedQuizId(res.id);
          setActiveTab("builder");
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      deleteQuiz.mutate(id);
      if (selectedQuizId === id) {
        setSelectedQuizId("");
      }
    }
  };

  const openQuestionForm = (idx: number | null) => {
    setEditingQuestionIdx(idx);
    if (idx !== null && selectedQuiz) {
      const q = selectedQuiz.questions[idx];
      setQType(q.type);
      setQQuestion(q.question);
      setQOptions(q.options || ["", "", "", ""]);
      setQAnswer(q.answer);
      setQExplanation(q.explanation);
      setQPoints(q.points);
    } else {
      setQType("mcq");
      setQQuestion("");
      setQOptions(["", "", "", ""]);
      setQAnswer("");
      setQExplanation("");
      setQPoints(10);
    }
  };

  const handleSaveQuestion = () => {
    if (!selectedQuiz || !qQuestion.trim() || !qAnswer.trim()) return;

    const newQuestion: QuizQuestion = {
      id:
        editingQuestionIdx !== null &&
        selectedQuiz.questions[editingQuestionIdx]
          ? selectedQuiz.questions[editingQuestionIdx].id
          : `qq_${Date.now()}`,
      type: qType,
      question: qQuestion,
      options:
        qType === "mcq" || qType === "multi" ? qOptions.filter(Boolean) : [],
      answer: qAnswer,
      explanation: qExplanation,
      points: qPoints,
    };

    const updatedQuestions = [...selectedQuiz.questions];
    if (editingQuestionIdx !== null) {
      updatedQuestions[editingQuestionIdx] = newQuestion;
    } else {
      updatedQuestions.push(newQuestion);
    }

    const updatedQuiz: LmsQuiz = {
      ...selectedQuiz,
      questions: updatedQuestions,
    };

    saveQuiz.mutate(updatedQuiz, {
      onSuccess: () => {
        setEditingQuestionIdx(null);
      },
    });
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!selectedQuiz) return;
    if (confirm("Remove this question?")) {
      const updatedQuestions = selectedQuiz.questions.filter(
        (_, i) => i !== idx,
      );
      const updatedQuiz: LmsQuiz = {
        ...selectedQuiz,
        questions: updatedQuestions,
      };
      saveQuiz.mutate(updatedQuiz);
    }
  };

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="Quizzes Management"
        description="Design and manage interactive quizzes, configure passing scores, time limits, and build rich question banks."
        icon={Brain}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Quizzes" },
        ]}
      />

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <button
          onClick={() => setActiveTab("list")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-colors cursor-pointer",
            activeTab === "list"
              ? "border-indigo-500 text-indigo-500 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Quiz Directory
        </button>
        <button
          onClick={() => {
            setActiveTab("builder");
            if (!selectedQuizId && quizzes.length > 0) {
              setSelectedQuizId(quizzes[0].id);
            }
          }}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-colors cursor-pointer",
            activeTab === "builder"
              ? "border-indigo-500 text-indigo-500 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Question Builder
        </button>
      </div>

      {activeTab === "list" ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-ring"
                style={{
                  background: "transparent",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>
            <Button
              onClick={openCreate}
              className="w-full sm:w-auto text-xs gap-1.5 active:scale-[0.98]"
            >
              <Plus size={14} />
              Add Quiz
            </Button>
          </div>

          {isLoading ? (
            <div
              className="p-8 border rounded-xl animate-pulse space-y-4"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-16 bg-muted rounded" />
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState
              title="No quizzes found"
              description="Create a quiz and attach it to a learning topic to assess students."
              actionLabel="Add Quiz"
              onAction={openCreate}
            />
          ) : (
            <div
              className="border rounded-xl overflow-x-auto"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className="border-b text-[10px] uppercase font-bold tracking-wider"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink-dim)",
                      background: "var(--sb-overlay, rgba(0,0,0,0.02))",
                    }}
                  >
                    <th className="p-4">Quiz Details</th>
                    <th className="p-4">Linked Topic</th>
                    <th className="p-4">Questions</th>
                    <th className="p-4">Time Limit</th>
                    <th className="p-4">Passing Score</th>
                    <th className="p-4">Metrics</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ divideColor: "var(--sb-border)" }}
                >
                  {filteredQuizzes.map((q) => {
                    const linkedTopic = topics.find((t) => t.id === q.topicId);

                    return (
                      <tr
                        key={q.id}
                        className="hover:bg-muted/50 transition-colors"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        <td className="p-4 font-semibold">{q.title}</td>
                        <td className="p-4 text-muted-foreground text-[11px]">
                          {linkedTopic ? linkedTopic.title : "Unlinked Topic"}
                        </td>
                        <td className="p-4">
                          {q.questions?.length ?? 0} items
                        </td>
                        <td className="p-4 flex items-center gap-1.5 mt-2">
                          <Clock size={12} className="text-muted-foreground" />
                          <span>{q.timeLimit} mins</span>
                        </td>
                        <td className="p-4">{q.passingMarks}%</td>
                        <td className="p-4 text-muted-foreground">
                          {q.attemptsCount ? (
                            <span>
                              {q.attemptsCount} attempts (avg {q.averageScore}%)
                            </span>
                          ) : (
                            <span>No attempts</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                              q.status === "published"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-zinc-500/10 text-zinc-400",
                            )}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded"
                              >
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-xs"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedQuizId(q.id);
                                  setActiveTab("builder");
                                }}
                                className="cursor-pointer gap-1.5 text-xs"
                              >
                                <Sparkles size={12} />
                                Build Questions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditMeta(q)}
                                className="cursor-pointer gap-1.5 text-xs"
                              >
                                <Edit2 size={12} />
                                Edit Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(q.id)}
                                className="cursor-pointer gap-1.5 text-xs text-red-600 hover:text-red-600 focus:text-red-600 focus:bg-red-500/10"
                              >
                                <Trash2 size={12} />
                                Delete Quiz
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // Question Builder Tab
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side Selector */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
              Select Quiz
            </span>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {quizzes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuizId(q.id);
                    setEditingQuestionIdx(null);
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left text-xs transition-all active:scale-[0.98] cursor-pointer",
                    selectedQuizId === q.id
                      ? "border-indigo-500 bg-indigo-500/[0.03] text-indigo-500 font-semibold"
                      : "hover:border-foreground/20 text-foreground",
                  )}
                  style={{
                    borderColor:
                      selectedQuizId === q.id ? undefined : "var(--sb-border)",
                    color:
                      selectedQuizId === q.id ? undefined : "var(--sb-ink)",
                  }}
                >
                  <div className="truncate">{q.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                    <span>{q.questions?.length ?? 0} questions</span>
                    <span className="capitalize">{q.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Builder Panel */}
          <div className="md:col-span-2 space-y-6">
            {!selectedQuiz ? (
              <div
                className="p-12 border border-dashed rounded-xl text-center text-muted-foreground text-xs"
                style={{ borderColor: "var(--sb-border)" }}
              >
                Please select or create a quiz first to start building
                questions.
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className="flex justify-between items-center pb-4 border-b"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div>
                    <h3
                      className="font-semibold text-sm text-foreground"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {selectedQuiz.title} Questions
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Configure questions, choices, answers, and points.
                    </p>
                  </div>
                  {editingQuestionIdx === null && (
                    <Button
                      onClick={() => openQuestionForm(null)}
                      size="sm"
                      className="text-xs gap-1"
                    >
                      <Plus size={12} />
                      Add Question
                    </Button>
                  )}
                </div>

                {/* Form to Edit or Add a single Question */}
                {editingQuestionIdx !== null ||
                selectedQuiz.questions.length === 0 ? (
                  <div
                    className="border rounded-xl p-5 space-y-4"
                    style={{
                      borderColor: "var(--sb-border)",
                      background: "var(--sb-overlay, rgba(0,0,0,0.01))",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[11px] font-bold text-foreground"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {editingQuestionIdx !== null
                          ? `Edit Question #${editingQuestionIdx + 1}`
                          : "Create New Question"}
                      </span>
                      <button
                        onClick={() => setEditingQuestionIdx(null)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                        <span>Question Type</span>
                        <select
                          value={qType}
                          onChange={(e) =>
                            setQType(e.target.value as QuestionType)
                          }
                          className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                          style={{
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                        >
                          <option value="mcq">Single Choice (MCQ)</option>
                          <option value="multi">Multiple Choice</option>
                          <option value="truefalse">True/False</option>
                          <option value="fillblank">Fill in the blank</option>
                          <option value="coding">Coding assessment</option>
                        </select>
                      </label>
                      <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                        <span>Points</span>
                        <input
                          type="number"
                          value={qPoints}
                          onChange={(e) => setQPoints(Number(e.target.value))}
                          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                          style={{
                            background: "transparent",
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink)",
                          }}
                        />
                      </label>
                    </div>

                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Question Text</span>
                      <textarea
                        value={qQuestion}
                        onChange={(e) => setQQuestion(e.target.value)}
                        placeholder="Write the question prompt here…"
                        rows={2}
                        className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>

                    {/* Choices (only for mcq and multi) */}
                    {(qType === "mcq" || qType === "multi") && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                          Answer Options
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {qOptions.map((opt, oIdx) => (
                            <input
                              key={oIdx}
                              value={opt}
                              onChange={(e) => {
                                const copy = [...qOptions];
                                copy[oIdx] = e.target.value;
                                setQOptions(copy);
                              }}
                              placeholder={`Option ${oIdx + 1}`}
                              className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring font-normal"
                              style={{
                                background: "transparent",
                                borderColor: "var(--sb-border)",
                                color: "var(--sb-ink)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Correct Answer</span>
                      <input
                        value={qAnswer}
                        onChange={(e) => setQAnswer(e.target.value)}
                        placeholder={
                          qType === "truefalse"
                            ? "True or False"
                            : qType === "mcq"
                              ? "Exact string of correct option"
                              : "Answer string"
                        }
                        className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>

                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Explanation</span>
                      <textarea
                        value={qExplanation}
                        onChange={(e) => setQExplanation(e.target.value)}
                        placeholder="Explain why this answer is correct…"
                        rows={2}
                        className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveQuestion}
                        disabled={!qQuestion.trim() || !qAnswer.trim()}
                        size="sm"
                        className="text-xs"
                      >
                        <Save size={12} className="mr-1" />
                        Save Question
                      </Button>
                      <Button
                        onClick={() => setEditingQuestionIdx(null)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* List of existing Questions */}
                <div className="space-y-4">
                  {selectedQuiz.questions.length === 0 ? (
                    <div
                      className="p-8 border border-dashed rounded-xl text-center text-muted-foreground text-xs"
                      style={{ borderColor: "var(--sb-border)" }}
                    >
                      This quiz has no questions yet. Create one above to get
                      started.
                    </div>
                  ) : (
                    selectedQuiz.questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="border rounded-xl p-4 flex items-start justify-between gap-4 transition-colors"
                        style={{ borderColor: "var(--sb-border)" }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Q#{idx + 1}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-semibold uppercase">
                              {q.type}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              ({q.points} points)
                            </span>
                          </div>
                          <p
                            className="text-xs font-medium text-foreground"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {q.question}
                          </p>

                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className={cn(
                                    "text-[10px] p-2 rounded border",
                                    opt === q.answer
                                      ? "border-emerald-500/30 bg-emerald-500/[0.02] text-emerald-500 font-semibold"
                                      : "text-muted-foreground",
                                  )}
                                  style={{
                                    borderColor:
                                      opt === q.answer
                                        ? undefined
                                        : "var(--sb-border)",
                                  }}
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="text-[10px] mt-2">
                            <span className="font-semibold text-emerald-600">
                              Correct Answer:{" "}
                            </span>
                            <span style={{ color: "var(--sb-ink)" }}>
                              {q.answer}
                            </span>
                          </div>

                          {q.explanation && (
                            <div className="text-[10px] text-muted-foreground mt-1">
                              <span className="font-semibold">
                                Explanation:{" "}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => openQuestionForm(idx)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Meta Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <div
            className="relative w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
            style={{ background: "var(--sb-background, #fff)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div>
                <h3
                  className="font-bold text-[13px]"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {editQuiz.id ? "Edit Quiz Parameters" : "Create Quiz"}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Define general settings for the quiz.
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Quiz Title *</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. JavaScript Closures Quiz"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Attach to Topic *</span>
                <select
                  value={formTopicId}
                  onChange={(e) => setFormTopicId(e.target.value)}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Time Limit (minutes)</span>
                  <input
                    type="number"
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Passing Score (%)</span>
                  <input
                    type="number"
                    value={formPassingMarks}
                    onChange={(e) =>
                      setFormPassingMarks(Number(e.target.value))
                    }
                    min={1}
                    max={100}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Max Attempt Limit</span>
                  <input
                    type="number"
                    value={formAttemptLimit}
                    onChange={(e) =>
                      setFormAttemptLimit(Number(e.target.value))
                    }
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Status</span>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as "published" | "draft")
                    }
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
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

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={formRandomize}
                  onChange={(e) => setFormRandomize(e.target.checked)}
                  className="rounded"
                />
                <div>
                  <span
                    className="text-[10px] font-semibold block"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Randomize Question Order
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    Shuffle questions differently for every attempt
                  </span>
                </div>
              </label>
            </div>

            {/* Footer */}
            <div
              className="px-5 py-4 border-t flex items-center gap-3 shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleSaveMeta}
                disabled={
                  !formTitle.trim() || !formTopicId || saveQuiz.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveQuiz.isPending
                  ? "Saving…"
                  : editQuiz.id
                    ? "Update Settings"
                    : "Create Quiz"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDrawerOpen(false)}
                className="active:scale-[0.98]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
