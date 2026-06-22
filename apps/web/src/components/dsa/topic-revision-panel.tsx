import { AnimatePresence, motion } from "framer-motion";
import { Award, FileText, Lightbulb, Zap } from "lucide-react";
import { useState } from "react";

interface RevisionItem {
  concepts: { title: string; content: string }[];
  patterns: { name: string; trigger: string; template: string }[];
  mustSolve: { name: string; reason: string }[];
  tips: string[];
}

interface TopicRevisionPanelProps {
  topicId: string;
}

const revisionDataMap: Record<string, RevisionItem> = {
  arrays: {
    concepts: [
      {
        title: "Contiguous Memory Allocations",
        content:
          "Arrays store elements sequentially. Access is address = base + index * size, yielding O(1) runtime. Resizing is O(N) because dynamic arrays allocate double size, copy elements, and clean old memory.",
      },
      {
        title: "Pointer Arithmetic & Boundaries",
        content:
          "Two pointers iterate from limits (left/right) or at different speeds (fast/slow). Always check index bounds before accessing element (e.g. index < arr.length).",
      },
    ],
    patterns: [
      {
        name: "Two Pointers (Collapsing)",
        trigger: "Array is sorted, need to find pairs matching a target sum.",
        template:
          "let left = 0, right = arr.length - 1;\nwhile (left < right) {\n  const sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  if (sum < target) left++; else right--;\n}",
      },
      {
        name: "Sliding Window (Fixed/Dynamic)",
        trigger:
          "Need to find sub-segments or sub-arrays matching constraint K.",
        template:
          "let left = 0, sum = 0, minLength = Infinity;\nfor (let right = 0; right < arr.length; right++) {\n  sum += arr[right];\n  while (sum >= target) {\n    minLength = Math.min(minLength, right - left + 1);\n    sum -= arr[left++];\n  }\n}",
      },
    ],
    mustSolve: [
      { name: "Two Sum", reason: "Teaches optimal index hash mapping." },
      {
        name: "Container With Most Water",
        reason: "Standard two-pointers greedy bounds convergence.",
      },
      {
        name: "Sliding Window Maximum",
        reason: "Teaches monotonic queue deque design.",
      },
    ],
    tips: [
      "Always ask if the array is sorted. If it is, Two Pointers or Binary Search is almost always the solution.",
      "Check bounds! Out of bound access is the #1 reason candidates fail array code tests.",
      "Discuss space complexity. Can we solve this in-place O(1) space instead of creating copies?",
    ],
  },
};

export function TopicRevisionPanel({ topicId }: TopicRevisionPanelProps) {
  const data = revisionDataMap[topicId] || {
    concepts: [
      {
        title: "Basic Structure",
        content: "Contiguous storage block in memory.",
      },
    ],
    patterns: [
      {
        name: "Standard Scan",
        trigger: "Single loop",
        template: "for (let i = 0; i < arr.length; i++) { ... }",
      },
    ],
    mustSolve: [{ name: "Linear Search", reason: "Foundational lookup." }],
    tips: ["Ask clarifying questions.", "Walk through examples manually."],
  };

  const [activeTab, setActiveTab] = useState<
    "concepts" | "patterns" | "mustSolve" | "tips"
  >("concepts");

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-all max-w-4xl mx-auto w-full"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <div
            className="flex items-center gap-2 text-xs font-bold"
            style={{ color: "var(--sb-ink)" }}
          >
            <FileText size={14} className="text-[var(--sb-accent)]" />
            <span>Generate Revision Sheet</span>
          </div>
          <span className="text-[9px] font-bold text-zinc-400">
            Notion format active
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab("concepts")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
              activeTab === "concepts"
                ? "bg-[var(--card-bg)] shadow-xs text-[var(--sb-accent)]"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            Core Concepts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("patterns")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
              activeTab === "patterns"
                ? "bg-[var(--card-bg)] shadow-xs text-[var(--sb-accent)]"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            Frequents Patterns
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mustSolve")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
              activeTab === "mustSolve"
                ? "bg-[var(--card-bg)] shadow-xs text-[var(--sb-accent)]"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            Must-Solve
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tips")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none ${
              activeTab === "tips"
                ? "bg-[var(--card-bg)] shadow-xs text-[var(--sb-accent)]"
                : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
            }`}
          >
            Interview Tips
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[140px] pt-1">
          <AnimatePresence mode="wait">
            {activeTab === "concepts" && (
              <motion.div
                key="rev-concepts"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-4"
              >
                {data.concepts.map((c) => (
                  <div key={c.title} className="space-y-1">
                    <h4
                      className="font-bold text-[13px] flex items-center gap-1.5"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      <Lightbulb
                        size={13}
                        className="text-yellow-500 shrink-0"
                      />
                      {c.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed pl-5"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {c.content}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "patterns" && (
              <motion.div
                key="rev-patterns"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-5"
              >
                {data.patterns.map((p) => (
                  <div key={p.name} className="space-y-2">
                    <div>
                      <h4
                        className="font-bold text-[13px]"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {p.name}
                      </h4>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        Trigger condition: {p.trigger}
                      </p>
                    </div>
                    <pre className="rounded-xl border p-4.5 font-mono text-[10px] leading-relaxed overflow-x-auto text-zinc-350 bg-zinc-950 dark:bg-zinc-950/80">
                      <code>{p.template}</code>
                    </pre>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "mustSolve" && (
              <motion.div
                key="rev-must"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {data.mustSolve.map((m) => (
                  <div
                    key={m.name}
                    className="rounded-xl border p-4.5 flex flex-col justify-between"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--sb-border)",
                    }}
                  >
                    <h5
                      className="font-bold text-[13px] flex items-center gap-1.5"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      <Award size={14} className="text-[var(--sb-accent)]" />
                      {m.name}
                    </h5>
                    <p
                      className="text-[10px] mt-2 leading-relaxed"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {m.reason}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "tips" && (
              <motion.div
                key="rev-tips"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-3"
              >
                <ul className="space-y-2.5">
                  {data.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-xs text-zinc-500"
                    >
                      <Zap
                        size={14}
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <span style={{ color: "var(--sb-ink-muted)" }}>
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
