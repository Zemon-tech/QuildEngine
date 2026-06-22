import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Calendar,
  Check,
  HelpCircle,
  ListPlus,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

interface TopicAIAssistantProps {
  topicName: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const quizDatabase: Record<string, QuizQuestion[]> = {
  arrays: [
    {
      question:
        "Which of the following operations on a standard static Array has a time complexity of O(N) in the worst case?",
      options: [
        "Accessing an element at a known index",
        "Inserting an element at the beginning of the array",
        "Updating an element at a known index",
        "Retrieving the length of the array",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Inserting at the beginning (index 0) requires shifting all N existing elements to the right by one position, resulting in O(N) complexity.",
    },
    {
      question:
        "What is the memory overhead of a continuous dynamic array when resizing happens?",
      options: [
        "O(1) extra space",
        "O(N) extra space during doubling copy",
        "O(N^2) extra space",
        "No extra space overhead",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Resizing typically doubles the array capacity, allocating a new memory segment of size 2N, copying elements, and freeing the old space, which requires O(N) temporary extra space.",
    },
  ],
};

export function TopicAIAssistant({ topicName }: TopicAIAssistantProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [responseHtml, setResponseHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quiz states
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(
    null,
  );
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const simulateStream = (text: string, actionName: string) => {
    setIsLoading(true);
    setActiveAction(actionName);
    setResponseHtml("");
    setCurrentQuiz(null);

    let idx = 0;
    const interval = setInterval(() => {
      setResponseHtml((prev) => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 4);
  };

  const handleExplainTopic = () => {
    const text = `### Understanding ${topicName} (Core Principles)

An **Array** is a contiguous block of memory containing elements of the same type. Because it is contiguous:
- **Fast Lookup**: Accessing \`nums[i]\` takes **O(1)** time since the memory address is calculated instantly: \`address = base + index * size\`.
- **Sluggish Insertions/Deletions**: Inserting or deleting at arbitrary indices takes **O(N)** time because elements must shift.

#### Key Patterns to Master:
1. **Two Pointers**: Collapsing boundaries or traversing from both ends.
2. **Prefix Sum**: Accumulating running totals to solve range query challenges.
3. **Sliding Window**: Maintaining a subsegment boundaries to track local properties.`;

    simulateStream(text, "explain");
  };

  const handleGenerateStudyPlan = () => {
    const text = `### 7-Day Study Plan for ${topicName}

| Day | Focus Area | Goal Problems | Est. Time |
|---|---|---|---|
| **Day 1** | Contiguous Basics | Two Sum, Contains Duplicate | 60 mins |
| **Day 2** | Dynamic Prefix Sum | Running Sum, Subarray Sum Equals K | 90 mins |
| **Day 3** | Boundary Two Pointers | Container with Most Water, 3Sum | 90 mins |
| **Day 4** | Sliding Window basics | Maximum Average Subarray | 60 mins |
| **Day 5** | Hard Sliding Windows | Sliding Window Maximum | 120 mins |
| **Day 6** | Grid Matrix grids | Spiral Matrix, Rotate Image | 90 mins |
| **Day 7** | Arena Assessment | Complete Array Mock Interview | 60 mins |`;

    simulateStream(text, "plan");
  };

  const handleGeneratePracticeSet = () => {
    const text = `### Custom Practice Set: Array Foundations

Here are three recommended problems chosen for your active level to target weak areas:

1. **Two Sum** (Easy) - *Tests Hash Map indexing*
2. **Subarray Sum Equals K** (Medium) - *Tests Prefix Sum accumulators*
3. **Rotate Image** (Medium) - *Tests 2D Grid Transpose & Reverse simulation*

**Goal**: Complete all three in a single session to build muscle memory!`;

    simulateStream(text, "practice");
  };

  const handleExplainMistakes = () => {
    const text = `### Typical Traps in Array Solutions

1. **Out of Bound Errors**: Accessing \`arr[arr.length]\` or \`arr[-1]\` when moving pointers. Always check bounds: \`left < right\` or \`index < nums.length\`.
2. **Integer Overflow**: When summing elements, ensure the sum fits within the numerical constraints. Use 64-bit integer values or mod operations if specified.
3. **Unnecessary Space usage**: Using nested loops (\`O(N^2)\`) where a Hash Map can resolve queries in a single pass (\`O(N)\` time, \`O(N)\` space).`;

    simulateStream(text, "mistakes");
  };

  const handleCreateQuiz = () => {
    setActiveAction("quiz");
    setResponseHtml("");
    setSelectedQuizOption(null);
    setIsAnswerChecked(false);

    const db = quizDatabase[topicName.toLowerCase()] || quizDatabase.arrays;
    const randomIndex = Math.floor(Math.random() * db.length);
    setCurrentQuiz(db[randomIndex]);
  };

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-all max-w-4xl mx-auto w-full"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <h3
              className="font-bold text-sm"
              style={{ color: "var(--sb-ink)" }}
            >
              Need Help With {topicName}?
            </h3>
            <p className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
              Interact with the Quild AI Assistant to explain topics, generate
              practice paths, or take quizzes.
            </p>
          </div>
        </div>

        {/* AI Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <Button
            variant="outline"
            onClick={handleExplainTopic}
            className={`text-[10px] font-bold h-auto py-2 rounded-xl border flex items-center justify-center gap-1 hover:bg-indigo-500/5 ${
              activeAction === "explain"
                ? "border-indigo-500 bg-indigo-500/5"
                : ""
            }`}
            style={{ color: "var(--sb-ink)" }}
          >
            <Sparkles size={11} className="text-indigo-500" />
            Explain Topic
          </Button>

          <Button
            variant="outline"
            onClick={handleGenerateStudyPlan}
            className={`text-[10px] font-bold h-auto py-2 rounded-xl border flex items-center justify-center gap-1 hover:bg-indigo-500/5 ${
              activeAction === "plan" ? "border-indigo-500 bg-indigo-500/5" : ""
            }`}
            style={{ color: "var(--sb-ink)" }}
          >
            <Calendar size={11} className="text-indigo-500" />
            Study Plan
          </Button>

          <Button
            variant="outline"
            onClick={handleGeneratePracticeSet}
            className={`text-[10px] font-bold h-auto py-2 rounded-xl border flex items-center justify-center gap-1 hover:bg-indigo-500/5 ${
              activeAction === "practice"
                ? "border-indigo-500 bg-indigo-500/5"
                : ""
            }`}
            style={{ color: "var(--sb-ink)" }}
          >
            <ListPlus size={11} className="text-indigo-500" />
            Practice Set
          </Button>

          <Button
            variant="outline"
            onClick={handleExplainMistakes}
            className={`text-[10px] font-bold h-auto py-2 rounded-xl border flex items-center justify-center gap-1 hover:bg-indigo-500/5 ${
              activeAction === "mistakes"
                ? "border-indigo-500 bg-indigo-500/5"
                : ""
            }`}
            style={{ color: "var(--sb-ink)" }}
          >
            <ShieldAlert size={11} className="text-indigo-500" />
            Explain Traps
          </Button>

          <Button
            variant="outline"
            onClick={handleCreateQuiz}
            className={`text-[10px] font-bold h-auto py-2 rounded-xl border flex items-center justify-center gap-1 hover:bg-indigo-500/5 ${
              activeAction === "quiz" ? "border-indigo-500 bg-indigo-500/5" : ""
            }`}
            style={{ color: "var(--sb-ink)" }}
          >
            <HelpCircle size={11} className="text-indigo-500" />
            Take Quiz
          </Button>
        </div>

        {/* Dynamic Display Area */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs py-4 text-zinc-400 font-mono"
            >
              <span className="size-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Copilot is writing approach...</span>
            </motion.div>
          )}

          {responseHtml && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs leading-relaxed whitespace-pre-wrap font-sans border rounded-xl p-4 space-y-4"
              style={{
                background: "oklch(0.5 0.1 260 / 0.02)",
                borderColor: "var(--sb-border)",
                color: "var(--sb-ink-muted)",
              }}
            >
              <div className="prose dark:prose-invert max-w-none text-xs">
                {responseHtml}
              </div>
            </motion.div>
          )}

          {currentQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-xl p-5 space-y-4"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--sb-border)",
              }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                <HelpCircle size={14} />
                <span>Concept Quiz Challenge</span>
              </div>

              <h4
                className="font-bold text-[13px] leading-snug"
                style={{ color: "var(--sb-ink)" }}
              >
                {currentQuiz.question}
              </h4>

              <div className="grid gap-2">
                {currentQuiz.options.map((opt, oIdx) => {
                  const isSelected = selectedQuizOption === oIdx;
                  let optStyle = { borderColor: "var(--sb-border)" };
                  if (isAnswerChecked) {
                    if (oIdx === currentQuiz.correctAnswerIndex) {
                      optStyle = { borderColor: "#10b981" }; // Correct (Green)
                    } else if (isSelected) {
                      optStyle = { borderColor: "#ef4444" }; // Incorrect (Red)
                    }
                  } else if (isSelected) {
                    optStyle = { borderColor: "var(--sb-accent)" }; // Selected
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => setSelectedQuizOption(oIdx)}
                      className={`w-full rounded-xl border p-3.5 text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected && !isAnswerChecked
                          ? "bg-zinc-50 dark:bg-zinc-800/20"
                          : ""
                      } ${
                        isAnswerChecked &&
                        oIdx === currentQuiz.correctAnswerIndex
                          ? "bg-emerald-500/5"
                          : ""
                      } ${
                        isAnswerChecked &&
                        isSelected &&
                        oIdx !== currentQuiz.correctAnswerIndex
                          ? "bg-rose-500/5"
                          : ""
                      }`}
                      style={optStyle}
                    >
                      <span style={{ color: "var(--sb-ink)" }}>{opt}</span>
                      {isAnswerChecked &&
                        oIdx === currentQuiz.correctAnswerIndex && (
                          <Check
                            size={14}
                            className="text-emerald-500 shrink-0 ml-2"
                          />
                        )}
                      {isAnswerChecked &&
                        isSelected &&
                        oIdx !== currentQuiz.correctAnswerIndex && (
                          <X
                            size={14}
                            className="text-rose-500 shrink-0 ml-2"
                          />
                        )}
                    </button>
                  );
                })}
              </div>

              {/* Check answer button */}
              {!isAnswerChecked && (
                <Button
                  disabled={selectedQuizOption === null}
                  onClick={() => setIsAnswerChecked(true)}
                  className="text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl px-4 py-2 mt-2 h-auto"
                >
                  Verify Answer
                </Button>
              )}

              {/* Explanation block */}
              {isAnswerChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl border p-4 text-xs mt-3 leading-relaxed"
                  style={{
                    borderColor:
                      selectedQuizOption === currentQuiz.correctAnswerIndex
                        ? "#10b981/25"
                        : "#ef4444/25",
                    background:
                      selectedQuizOption === currentQuiz.correctAnswerIndex
                        ? "rgba(16, 185, 129, 0.03)"
                        : "rgba(239, 68, 68, 0.03)",
                  }}
                >
                  <p
                    className="font-bold flex items-center gap-1 mb-1.5"
                    style={{
                      color:
                        selectedQuizOption === currentQuiz.correctAnswerIndex
                          ? "#10b981"
                          : "#ef4444",
                    }}
                  >
                    {selectedQuizOption === currentQuiz.correctAnswerIndex
                      ? "Correct Answer!"
                      : "Incorrect!"}
                  </p>
                  <p style={{ color: "var(--sb-ink-muted)" }}>
                    {currentQuiz.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
