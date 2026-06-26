import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  Bot,
  Check,
  CornerDownRight,
  Lock,
  MessageSquare,
  Pin,
  Search,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Unlock,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import {
  type QaAnswer,
  type QaQuestion,
  useDeleteQaQuestion,
  useQaQuestions,
  useUpdateQaQuestion,
} from "#/hooks/use-practice-state";

export const Route = createFileRoute("/_admin/practice/interview-qa/")({
  component: QaPage,
});

function QaPage() {
  // Data hooks
  const { data: questions = [], isLoading } = useQaQuestions();
  const updateQuestionMutation = useUpdateQaQuestion();
  const deleteQuestionMutation = useDeleteQaQuestion();

  // Selected question in Master-Detail view
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filtering & search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Answer creation state
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [newAnswerAuthor, setNewAnswerAuthor] = useState("Admin (Staff)");

  // AI Assistant panel state for the selected question
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    suggestedAnswer: string;
    similarityScore: number;
    similarQuestion: string;
    sentiment: string;
    summary: string;
  } | null>(null);

  const selectedQuestion = questions.find((q) => q.id === selectedId);

  // Filters
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusTab === "all" || q.status === statusTab;
    return matchesSearch && matchesStatus;
  });

  // Moderation Handlers
  const handleStatusChange = (
    question: QaQuestion,
    status: "pending" | "approved" | "rejected",
  ) => {
    updateQuestionMutation.mutate({ ...question, status });
  };

  const handleToggleLock = (question: QaQuestion) => {
    updateQuestionMutation.mutate({
      ...question,
      isLocked: !question.isLocked,
    });
  };

  const handleTogglePin = (question: QaQuestion) => {
    updateQuestionMutation.mutate({
      ...question,
      isPinned: !question.isPinned,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(id);
      if (selectedId === id) {
        setSelectedId(null);
        setAiResult(null);
      }
    }
  };

  // Answer Handlers
  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !newAnswerContent.trim()) return;

    const newAnswer: QaAnswer = {
      id: `ans-${Date.now()}`,
      content: newAnswerContent.trim(),
      author: newAnswerAuthor,
      votes: 0,
      isAccepted: false,
      createdAt: "Just now",
    };

    const updatedQuestion: QaQuestion = {
      ...selectedQuestion,
      answers: [...selectedQuestion.answers, newAnswer],
    };

    updateQuestionMutation.mutate(updatedQuestion);
    setNewAnswerContent("");
  };

  const handleToggleAcceptAnswer = (question: QaQuestion, answerId: string) => {
    const updatedAnswers = question.answers.map((ans) => ({
      ...ans,
      isAccepted: ans.id === answerId ? !ans.isAccepted : false, // Only one accepted answer allowed
    }));

    updateQuestionMutation.mutate({
      ...question,
      answers: updatedAnswers,
    });
  };

  const handleDeleteAnswer = (question: QaQuestion, answerId: string) => {
    if (confirm("Are you sure you want to remove this answer?")) {
      const updatedAnswers = question.answers.filter(
        (ans) => ans.id !== answerId,
      );
      updateQuestionMutation.mutate({
        ...question,
        answers: updatedAnswers,
      });
    }
  };

  const handleVoteAnswer = (
    question: QaQuestion,
    answerId: string,
    increment: number,
  ) => {
    const updatedAnswers = question.answers.map((ans) => {
      if (ans.id === answerId) {
        return { ...ans, votes: ans.votes + increment };
      }
      return ans;
    });

    updateQuestionMutation.mutate({
      ...question,
      answers: updatedAnswers,
    });
  };

  const handleVoteQuestion = (question: QaQuestion, increment: number) => {
    updateQuestionMutation.mutate({
      ...question,
      votes: question.votes + increment,
    });
  };

  // Simulated AI Copilot helper
  const handleAskAI = (question: QaQuestion) => {
    setAiLoading(true);
    setAiResult(null);

    // Simulate typical LLM semantic processing latency
    setTimeout(() => {
      let suggested = "";
      let similar = "";
      let score = 0;
      let sentiment = "Neutral";
      let summary = "";

      if (question.slug.includes("closures")) {
        suggested =
          "Modern engines release closure scopes unless a nested function holds an active reference, or a global/event-handler retains the outer object. Ensure listeners are unmounted or set to null.";
        similar = "Memory leaks in SPA routing with global listeners";
        score = 88;
        sentiment = "Neutral / Inquisitive";
        summary =
          "Technical query analyzing memory allocation and scope retention dynamics in V8.";
      } else if (question.slug.includes("cors")) {
        suggested =
          "Map the standard preflight headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers) in API Gateway integration responses. Also check standard Lambda response payload returns.";
        similar = "AWS Lambda proxy integration header mismatch";
        score = 92;
        sentiment = "Slightly Frustrated";
        summary =
          "Deployment query focusing on serverless infrastructure configuration and CORS troubleshooting.";
      } else {
        suggested =
          "Based on styling libraries, isolation can be achieved using namespace prefixes, shadow DOM boundary containers, or specific tailwind config options like prefixes to avoid overlap.";
        similar = "Tailwind CSS overrides in multi-tenant environments";
        score = 75;
        sentiment = "Curious";
        summary =
          "Architecture decision evaluating utility frameworks vs CSS modules for UI stability.";
      }

      setAiResult({
        suggestedAnswer: suggested,
        similarityScore: score,
        similarQuestion: similar,
        sentiment,
        summary,
      });
      setAiLoading(false);
    }, 900);
  };

  const handleApplyAiAnswer = () => {
    if (!selectedQuestion || !aiResult) return;

    const newAnswer: QaAnswer = {
      id: `ans-ai-${Date.now()}`,
      content: `[AI Assistant]: ${aiResult.suggestedAnswer}`,
      author: "Quild Copilot (AI)",
      votes: 1,
      isAccepted: false,
      createdAt: "Just now",
    };

    updateQuestionMutation.mutate({
      ...selectedQuestion,
      answers: [...selectedQuestion.answers, newAnswer],
    });

    // Clear AI box once applied
    setAiResult(null);
  };

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Q&A Moderation"
        description="Moderate platform discussion boards, review community posts, and configure AI-suggested helper responses."
        icon={MessageSquare}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Practice" },
          { label: "Q&A" },
        ]}
      />

      {/* Grid: Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px] items-stretch">
        {/* Left Side: Questions List (Column span: 5) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Filters & Search Box */}
          <div className="island-shell rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search threads or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs outline-none focus:border-ring transition-all"
                style={{
                  background: "transparent",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            {/* Status tab selectors */}
            <div className="flex border-b border-(--sb-border) pb-px gap-1">
              {(["all", "pending", "approved", "rejected"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusTab(status)}
                    className="px-3 py-1.5 text-[11px] font-bold border-b-2 capitalize transition-all active:scale-[0.98]"
                    style={{
                      borderColor:
                        statusTab === status
                          ? "var(--sb-accent)"
                          : "transparent",
                      color:
                        statusTab === status
                          ? "var(--sb-ink)"
                          : "var(--sb-ink-dim)",
                    }}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* List of Questions */}
          <div className="flex-1 overflow-y-auto max-h-[550px] space-y-3 pr-1 scrollbar-thin">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Loading questions...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="island-shell rounded-xl p-8 text-center text-xs text-muted-foreground">
                No threads found matching criteria.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = q.id === selectedId;
                const statusTheme =
                  q.status === "approved"
                    ? "success"
                    : q.status === "rejected"
                      ? "error"
                      : "warning";

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(q.id);
                      setAiResult(null); // Clear previous AI suggestion cache
                    }}
                    className={`w-full text-left island-shell rounded-xl p-4 transition-all duration-200 cursor-pointer border relative block ${
                      isSelected
                        ? "border-(--sb-accent) shadow-sm"
                        : "hover:border-neutral-400/30"
                    }`}
                    style={{
                      background: isSelected
                        ? "rgba(var(--sb-accent-rgb), 0.04)"
                        : undefined,
                    }}
                  >
                    {/* Header: Status and votes */}
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={statusTheme}>
                          {q.status}
                        </StatusBadge>
                        <span className="text-muted-foreground font-medium uppercase tracking-wider">
                          {q.category}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        <ThumbsUp size={11} /> {q.votes}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      className="text-xs font-bold mt-2 line-clamp-2"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {q.title}
                    </h4>

                    {/* Footer: Date, pins, locks */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3 pt-2 border-t border-(--sb-border)/50">
                      <div className="flex items-center gap-1">
                        <User size={10} />
                        <span className="truncate max-w-[80px] font-semibold">
                          {q.author}
                        </span>
                        <span>•</span>
                        <span>{q.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.isPinned && (
                          <Pin
                            size={10}
                            className="text-amber-500 fill-amber-500"
                          />
                        )}
                        {q.isLocked && (
                          <Lock size={10} className="text-red-500" />
                        )}
                        <span className="font-semibold">
                          {q.answers.length} answers
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Thread Details & AI Copilot Workspace (Column span: 7) */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedQuestion ? (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Thread Context and Actions */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider">
                        Category: {selectedQuestion.category}
                      </span>
                      <span>•</span>
                      <span className="text-muted-foreground">
                        {selectedQuestion.createdAt}
                      </span>
                    </div>
                    <h3
                      className="text-base font-extrabold mt-1.5"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {selectedQuestion.title}
                    </h3>
                  </div>

                  {/* Top Toolbar Actions */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(selectedQuestion)}
                      className={`p-2 rounded-lg border transition-all active:scale-[0.98] ${
                        selectedQuestion.isPinned
                          ? "bg-amber-500/10 border-amber-500 text-amber-500"
                          : "hover:bg-muted"
                      }`}
                      title={
                        selectedQuestion.isPinned
                          ? "Unpin thread"
                          : "Pin thread to top"
                      }
                    >
                      <Pin
                        size={13}
                        className={
                          selectedQuestion.isPinned ? "fill-amber-500" : ""
                        }
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleLock(selectedQuestion)}
                      className={`p-2 rounded-lg border transition-all active:scale-[0.98] ${
                        selectedQuestion.isLocked
                          ? "bg-rose-500/10 border-rose-500 text-rose-500"
                          : "hover:bg-muted"
                      }`}
                      title={
                        selectedQuestion.isLocked
                          ? "Unlock thread"
                          : "Lock thread"
                      }
                    >
                      {selectedQuestion.isLocked ? (
                        <Lock size={13} />
                      ) : (
                        <Unlock size={13} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                      className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all active:scale-[0.98]"
                      title="Delete Thread"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Question body content */}
                <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap bg-muted/40 p-3 rounded-lg border border-(--sb-border)/55">
                  {selectedQuestion.content}
                </p>

                {/* Status moderation controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-(--sb-border)">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      MODERATION STATUS:
                    </span>
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-(--sb-border)">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(selectedQuestion, "approved")
                        }
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded transition-all active:scale-[0.98] ${
                          selectedQuestion.status === "approved"
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-muted-foreground hover:bg-background"
                        }`}
                      >
                        <Check size={11} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(selectedQuestion, "rejected")
                        }
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded transition-all active:scale-[0.98] ${
                          selectedQuestion.status === "rejected"
                            ? "bg-rose-500 text-white shadow-sm"
                            : "text-muted-foreground hover:bg-background"
                        }`}
                      >
                        <X size={11} /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Vote score adjustments */}
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-(--sb-border)">
                    <button
                      type="button"
                      onClick={() => handleVoteQuestion(selectedQuestion, 1)}
                      className="p-1.5 hover:bg-background text-muted-foreground hover:text-emerald-500 rounded transition-all active:scale-[0.98]"
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <span
                      className="px-2 text-xs font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {selectedQuestion.votes} votes
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVoteQuestion(selectedQuestion, -1)}
                      className="p-1.5 hover:bg-background text-muted-foreground hover:text-rose-500 rounded transition-all active:scale-[0.98]"
                    >
                      <ThumbsDown size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI COPILOT COPILOT COMPONENT */}
              <div className="island-shell rounded-xl p-5 border border-purple-500/20 bg-gradient-to-r from-purple-500/[0.02] to-indigo-500/[0.02] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="size-5 text-indigo-500" />
                    <div>
                      <h4
                        className="text-xs font-bold"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        AI Moderation Helper
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Simulate duplicate matching and autocomplete answer
                        constructs.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAskAI(selectedQuestion)}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all disabled:opacity-50 active:scale-[0.98]"
                  >
                    <Sparkles size={11} />
                    {aiLoading ? "Analyzing Thread..." : "Run AI Diagnostics"}
                  </button>
                </div>

                {/* AI Result Content */}
                {aiResult && (
                  <div className="space-y-3.5 border-t border-(--sb-border) pt-3.5 stagger-item">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                      <div className="bg-muted/50 p-2.5 rounded-lg border border-(--sb-border)">
                        <span className="text-muted-foreground font-semibold uppercase block">
                          Semantic Summary
                        </span>
                        <span
                          className="font-semibold block mt-1"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {aiResult.summary}
                        </span>
                      </div>
                      <div className="bg-muted/50 p-2.5 rounded-lg border border-(--sb-border)">
                        <span className="text-muted-foreground font-semibold uppercase block">
                          Duplicate Scanner
                        </span>
                        <span className="block mt-1 text-amber-500 font-bold">
                          {aiResult.similarityScore}% Similarity Match:
                        </span>
                        <span className="italic block mt-0.5 text-muted-foreground">
                          "{aiResult.similarQuestion}"
                        </span>
                      </div>
                    </div>

                    <div className="bg-indigo-500/[0.04] p-3 rounded-lg border border-indigo-500/20 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-500 font-extrabold uppercase text-[10px] flex items-center gap-1">
                          <Bot size={11} /> Suggested Resolution Answer
                        </span>
                        <button
                          type="button"
                          onClick={handleApplyAiAnswer}
                          className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 active:scale-[0.98]"
                        >
                          <CornerDownRight size={10} /> Inject Answer to Thread
                        </button>
                      </div>
                      <p className="mt-2 text-muted-foreground leading-relaxed italic">
                        "{aiResult.suggestedAnswer}"
                      </p>
                    </div>
                  </div>
                )}

                {!aiResult && !aiLoading && (
                  <div className="text-center p-2 text-[11px] text-muted-foreground">
                    Click the diagnostics button to generate automated
                    moderation suggestions.
                  </div>
                )}

                {aiLoading && (
                  <div className="flex flex-col items-center justify-center p-6 space-y-2">
                    <div className="size-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-muted-foreground font-bold">
                      Consulting LLM models...
                    </span>
                  </div>
                )}
              </div>

              {/* Answers Section */}
              <div className="island-shell rounded-xl p-5 flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-(--sb-border) pb-2">
                  <h4
                    className="text-xs font-bold flex items-center gap-1.5"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <MessageSquare size={13} />
                    Thread Answers ({selectedQuestion.answers.length})
                  </h4>
                </div>

                {/* Custom Answers List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {selectedQuestion.answers.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground flex flex-col items-center justify-center gap-1">
                      <AlertCircle
                        size={14}
                        className="text-muted-foreground"
                      />
                      No answers have been published yet for this thread.
                    </div>
                  ) : (
                    selectedQuestion.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-3 rounded-lg border text-left relative transition-all ${
                          ans.isAccepted
                            ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                            : "border-(--sb-border) bg-muted/20"
                        }`}
                      >
                        {/* Answer Author and Meta */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-bold flex items-center gap-1"
                              style={{ color: "var(--sb-ink)" }}
                            >
                              <User size={10} />
                              {ans.author}
                            </span>
                            {ans.author.includes("Copilot") && (
                              <span className="bg-indigo-500/10 text-indigo-500 px-1 rounded text-[8px] font-bold">
                                COPILOT
                              </span>
                            )}
                            <span>{ans.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Mark Accepted Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleAcceptAnswer(
                                  selectedQuestion,
                                  ans.id,
                                )
                              }
                              className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold border transition-all active:scale-[0.98] ${
                                ans.isAccepted
                                  ? "bg-emerald-500 text-white border-emerald-500"
                                  : "text-muted-foreground border-transparent hover:bg-muted"
                              }`}
                            >
                              <Award size={10} />
                              {ans.isAccepted
                                ? "Accepted Solution"
                                : "Mark Accepted"}
                            </button>

                            {/* Delete Answer */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteAnswer(selectedQuestion, ans.id)
                              }
                              className="text-red-500 p-1 hover:bg-red-500/10 rounded transition-all active:scale-[0.98]"
                              title="Delete Answer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Answer Text */}
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                          {ans.content}
                        </p>

                        {/* Vote Controls on Answer */}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-(--sb-border)/50">
                          <button
                            type="button"
                            onClick={() =>
                              handleVoteAnswer(selectedQuestion, ans.id, 1)
                            }
                            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-muted text-[10px] text-muted-foreground rounded transition-all active:scale-[0.98]"
                          >
                            <ThumbsUp size={10} />
                            <span>Upvote ({ans.votes})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Answer Form */}
                <form
                  onSubmit={handleAddAnswer}
                  className="space-y-3 pt-3 border-t border-(--sb-border) mt-auto"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Write Answer as:
                    </span>
                    <input
                      type="text"
                      value={newAnswerAuthor}
                      onChange={(e) => setNewAnswerAuthor(e.target.value)}
                      placeholder="Author name..."
                      className="border rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-ring"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      placeholder="Provide answer details to assist the community user..."
                      value={newAnswerContent}
                      onChange={(e) => setNewAnswerContent(e.target.value)}
                      className="flex-1 border rounded-lg p-2 text-xs focus:outline-none focus:border-ring min-h-[60px] resize-none"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 bg-(--sb-accent) text-[var(--sb-accent-foreground,white)] rounded-lg flex items-center justify-center hover:opacity-90 transition-all active:scale-[0.98]"
                      style={{ background: "var(--sb-accent)" }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 island-shell rounded-xl flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="p-4 bg-muted rounded-full">
                <MessageSquare className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  No Thread Selected
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                  Select a community Q&A thread from the left panel to review
                  questions, answers, and simulated AI diagnostics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
