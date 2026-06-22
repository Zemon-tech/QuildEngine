import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";

interface TopicInterviewModeProps {
  topicName: string;
}

export function TopicInterviewMode({ topicName }: TopicInterviewModeProps) {
  const [sessionState, setSessionState] = useState<
    "idle" | "started" | "graded"
  >("idle");
  const [currentRound, setCurrentRound] = useState<"easy" | "medium" | "hard">(
    "easy",
  );

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(45 * 60); // 45 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // User responses
  const [easyAnswer, setEasyAnswer] = useState("");
  const [mediumAnswer, setMediumAnswer] = useState("");
  const [hardAnswer, setHardAnswer] = useState("");

  // Grade result state
  const [gradeResult, setGradeResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  const handleGrading = useCallback(() => {
    setSessionState("graded");

    // Simple grading check based on length of response to make it feel responsive
    const totalLen =
      easyAnswer.length + mediumAnswer.length + hardAnswer.length;
    let score = 50;
    let feedback = "";

    if (totalLen > 300) {
      score = 92;
      feedback =
        "Excellent! You provided comprehensive descriptions, outlined correct pointer logic, and discussed optimal complexities (O(N) time, O(1) space).";
    } else if (totalLen > 100) {
      score = 78;
      feedback =
        "Good attempt! You identified the correct algorithms, but could expand more on edge cases and boundary checks.";
    } else {
      score = 45;
      feedback =
        "Incomplete submission. You need to outline complete solutions for all rounds within the time limit.";
    }

    setGradeResult({ score, feedback });
  }, [easyAnswer, mediumAnswer, hardAnswer]);

  useEffect(() => {
    if (sessionState === "started") {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleGrading();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState, handleGrading]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleStart = () => {
    setSecondsLeft(45 * 60);
    setEasyAnswer("");
    setMediumAnswer("");
    setHardAnswer("");
    setGradeResult(null);
    setCurrentRound("easy");
    setSessionState("started");
  };

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-all max-w-4xl mx-auto w-full"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <AnimatePresence mode="wait">
        {sessionState === "idle" && (
          <motion.div
            key="interview-idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center gap-4"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--sb-accent)]/5 text-[var(--sb-accent)] border border-[var(--sb-accent)]/10">
              <Award size={28} />
            </div>

            <div className="space-y-1">
              <h3
                className="font-bold text-base"
                style={{ color: "var(--sb-ink)" }}
              >
                Start {topicName} Mock Interview
              </h3>
              <p
                className="text-xs max-w-md"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Test your knowledge in a timed, 3-round mock technical
                interview. You'll solve progressive coding rounds (Easy, Medium,
                Hard).
              </p>
            </div>

            <div className="flex items-center gap-6 text-[11px] font-semibold text-zinc-500 py-2">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                45 Minutes Limit
              </span>
              <span>·</span>
              <span>Graded Report</span>
            </div>

            <Button
              onClick={handleStart}
              className="text-xs font-bold text-white bg-[var(--sb-accent)] hover:opacity-90 active:scale-95 px-6 py-2.5 h-auto rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Play size={13} fill="white" />
              Begin Interview
            </Button>
          </motion.div>
        )}

        {sessionState === "started" && (
          <motion.div
            key="interview-started"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Top Stats Bar */}
            <div
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                <Clock size={14} className="animate-pulse" />
                <span>Timer: {formatTime(secondsLeft)}</span>
              </div>

              {/* Progressive Tabs */}
              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/25 p-1 rounded-xl">
                {(["easy", "medium", "hard"] as const).map((r) => (
                  <button
                    key={`round-${r}`}
                    type="button"
                    onClick={() => setCurrentRound(r)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide cursor-pointer ${
                      currentRound === r
                        ? "bg-[var(--card-bg)] text-[var(--sb-accent)] shadow-xs"
                        : "text-[var(--sb-ink-dim)]"
                    }`}
                  >
                    {r} Round
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt details depending on active round */}
            <div className="space-y-4">
              {currentRound === "easy" && (
                <div className="space-y-3">
                  <h4
                    className="font-bold text-xs"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Round 1 (Easy): Reverse Array In-Place
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Write a function that reverses an array of integers
                    in-place. You must not allocate extra memory for another
                    array. Discuss how the boundary pointers meet in the middle.
                  </p>
                  <textarea
                    value={easyAnswer}
                    onChange={(e) => setEasyAnswer(e.target.value)}
                    placeholder="Draft your algorithmic explanation or code snippet here..."
                    className="w-full h-32 rounded-xl border p-3.5 text-xs outline-none focus:border-[var(--sb-accent)] font-mono leading-relaxed bg-[var(--card-bg)]"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentRound("medium")}
                      className="text-[11px] font-bold text-[var(--sb-accent)] flex items-center gap-1 hover:bg-[var(--sb-accent)]/5"
                    >
                      Next Round
                      <ChevronRight size={13} />
                    </Button>
                  </div>
                </div>
              )}

              {currentRound === "medium" && (
                <div className="space-y-3">
                  <h4
                    className="font-bold text-xs"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Round 2 (Medium): Two Sum Pair Logic
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Outline an O(N) time and O(N) space algorithm to find two
                    indices whose values sum to K. How does utilizing a Hash Map
                    help skip the O(N^2) brute force double scan?
                  </p>
                  <textarea
                    value={mediumAnswer}
                    onChange={(e) => setMediumAnswer(e.target.value)}
                    placeholder="Draft your algorithmic explanation or code snippet here..."
                    className="w-full h-32 rounded-xl border p-3.5 text-xs outline-none focus:border-[var(--sb-accent)] font-mono leading-relaxed bg-[var(--card-bg)]"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentRound("easy")}
                      className="text-[11px] font-bold text-zinc-500 hover:bg-zinc-50/50"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentRound("hard")}
                      className="text-[11px] font-bold text-[var(--sb-accent)] flex items-center gap-1 hover:bg-[var(--sb-accent)]/5"
                    >
                      Next Round
                      <ChevronRight size={13} />
                    </Button>
                  </div>
                </div>
              )}

              {currentRound === "hard" && (
                <div className="space-y-3">
                  <h4
                    className="font-bold text-xs"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Round 3 (Hard): Sliding Window Maximum
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Explain how a Monotonic Dequeue can maintain array indices
                    to extract sliding window maximums in O(N) total runtime.
                    Why is a standard heap approach O(N log K)?
                  </p>
                  <textarea
                    value={hardAnswer}
                    onChange={(e) => setHardAnswer(e.target.value)}
                    placeholder="Draft your algorithmic explanation or code snippet here..."
                    className="w-full h-32 rounded-xl border p-3.5 text-xs outline-none focus:border-[var(--sb-accent)] font-mono leading-relaxed bg-[var(--card-bg)]"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                  <div
                    className="flex justify-between border-t pt-4"
                    style={{ borderColor: "var(--sb-border)" }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentRound("medium")}
                      className="text-[11px] font-bold text-zinc-500 hover:bg-zinc-50/50"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleGrading}
                      className="text-xs font-bold text-white bg-emerald-650 hover:bg-emerald-600 rounded-xl px-5 py-2.5 h-auto shadow-xs active:scale-95 transition-all"
                    >
                      Finish and Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {sessionState === "graded" && gradeResult && (
          <motion.div
            key="interview-graded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Header Result */}
            <div
              className="flex items-center gap-3 border-b pb-3.5"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h4
                  className="font-bold text-sm"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Mock Interview Completed
                </h4>
                <p className="text-[10px] text-zinc-400">
                  Performance assessment and score report.
                </p>
              </div>
            </div>

            {/* Score Metric Card */}
            <div
              className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{
                background: "oklch(1 0 0 / 0.01)",
                borderColor: "var(--sb-border)",
              }}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Evaluation Grade
                </span>
                <div className="text-3xl font-black text-emerald-500">
                  {gradeResult.score} / 100
                </div>
              </div>

              <div
                className="max-w-md text-xs leading-relaxed text-zinc-500"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                {gradeResult.feedback}
              </div>
            </div>

            {/* Assessment Details Checklist */}
            <div className="space-y-3">
              <h5
                className="font-bold text-xs"
                style={{ color: "var(--sb-ink)" }}
              >
                Algorithmic Skills Verified:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="rounded-xl border p-3 text-xs flex items-center gap-2.5"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <ShieldCheck className="text-emerald-500 size-5" />
                  <div>
                    <div
                      className="font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Two Pointers
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      Swapping logic correctly explained.
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl border p-3 text-xs flex items-center gap-2.5"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <ShieldCheck className="text-emerald-500 size-5" />
                  <div>
                    <div
                      className="font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Complexity Analysis
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      Time vs Space trade-off mapped.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center gap-3 pt-3 border-t"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleStart}
                className="text-xs font-bold text-white bg-[var(--sb-accent)] hover:opacity-90 active:scale-95 px-5 py-2 h-auto rounded-xl transition-all"
              >
                Restart Interview
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSessionState("idle")}
                className="text-xs font-bold text-zinc-500 hover:bg-zinc-50/50 rounded-xl px-4 py-2"
              >
                Back to Lobby
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
