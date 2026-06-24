import {
  CheckCircle2,
  Terminal,
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import { dsaProblems } from "#/lib/dsa-problems-db";

function parseVariables(inputStr: string) {
  const assignments: { name: string; value: string }[] = [];
  const parts: string[] = [];
  let current = "";
  let bracketLevel = 0;
  let braceLevel = 0;
  let parenLevel = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    if (inQuotes) {
      current += char;
      if (char === quoteChar && inputStr[i - 1] !== "\\") {
        inQuotes = false;
      }
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === "[") {
        bracketLevel++;
        current += char;
      } else if (char === "]") {
        bracketLevel--;
        current += char;
      } else if (char === "{") {
        braceLevel++;
        current += char;
      } else if (char === "}") {
        braceLevel--;
        current += char;
      } else if (char === "(") {
        parenLevel++;
        current += char;
      } else if (char === ")") {
        parenLevel--;
        current += char;
      } else if (
        char === "," &&
        bracketLevel === 0 &&
        braceLevel === 0 &&
        parenLevel === 0
      ) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }

  for (const part of parts) {
    const eqIdx = part.indexOf("=");
    if (eqIdx !== -1) {
      const name = part.substring(0, eqIdx).trim();
      const value = part.substring(eqIdx + 1).trim();
      assignments.push({ name, value });
    } else {
      assignments.push({ name: "input", value: part });
    }
  }

  return assignments;
}

export function OutputPanel() {
  const {
    outputActiveTab,
    setOutputActiveTab,
    runResult,
    submitResult,
    isRunning,
    isSubmitting,
    lastOpenedProblem,
    customTestCases,
    setCustomTestCases,
  } = useWorkspaceStore();

  const [selectedCase, setSelectedCase] = useState(0);

  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === lastOpenedProblem);

  const activeResult = submitResult || runResult;

  useEffect(() => {
    if (lastOpenedProblem && problem && !customTestCases[lastOpenedProblem]) {
      const initialCases = problem.examples.map((ex) => ({
        input: ex.input,
        expected: ex.output,
      }));
      setCustomTestCases(lastOpenedProblem, initialCases);
    }
  }, [lastOpenedProblem, problem, customTestCases, setCustomTestCases]);

  const cases =
    lastOpenedProblem && customTestCases[lastOpenedProblem]
      ? customTestCases[lastOpenedProblem]
      : problem?.examples.map((ex) => ({
          input: ex.input,
          expected: ex.output,
        })) || [];

  const handleAddCase = () => {
    if (!lastOpenedProblem) return;
    const baseCase = cases[0] || { input: "", expected: "" };
    const newCases = [
      ...cases,
      { input: baseCase.input, expected: baseCase.expected },
    ];
    setCustomTestCases(lastOpenedProblem, newCases);
    setSelectedCase(newCases.length - 1);
  };

  const handleUpdateVariable = (
    caseIdx: number,
    varIdx: number,
    newVal: string,
  ) => {
    if (!lastOpenedProblem) return;

    const inputStr = cases[caseIdx]?.input || "";
    const variables = parseVariables(inputStr);

    if (variables[varIdx]) {
      variables[varIdx].value = newVal;
    }

    const newInputStr = variables
      .map((v) => `${v.name} = ${v.value}`)
      .join(", ");

    const newCases = [...cases];
    newCases[caseIdx] = {
      ...newCases[caseIdx],
      input: newInputStr,
    };

    setCustomTestCases(lastOpenedProblem, newCases);
  };

  const currentInputStr = cases[selectedCase]?.input || "";
  const assignments = parseVariables(currentInputStr);

  const isActiveTab = (tab: string) => outputActiveTab === tab;

  return (
    <div className="flex h-full flex-col bg-[#111111] text-[#FAFAFA] overflow-hidden">
      {/* ── Tab Bar ── */}
      <div className="flex h-10 shrink-0 items-center border-b border-[#1E1E1E] bg-[#111111] px-4 select-none">
        <button
          type="button"
          onClick={() => setOutputActiveTab("testcases")}
          className={`flex h-full items-center gap-1.5 border-b-2 px-1 mr-5 text-xs font-medium transition-all duration-150 cursor-pointer ${
            isActiveTab("testcases")
              ? "border-emerald-500 text-[#FAFAFA]"
              : "border-transparent text-[#737373] hover:text-[#A3A3A3]"
          }`}
        >
          <CheckCircle2
            className={`h-3.5 w-3.5 shrink-0 ${isActiveTab("testcases") ? "text-emerald-500" : "text-[#737373]"}`}
          />
          <span>Testcase</span>
        </button>

        <span className="text-[#2A2A2A] select-none mr-5">|</span>

        <button
          type="button"
          onClick={() => setOutputActiveTab("results")}
          className={`flex h-full items-center gap-1.5 border-b-2 px-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
            isActiveTab("results")
              ? "border-emerald-500 text-[#FAFAFA]"
              : "border-transparent text-[#737373] hover:text-[#A3A3A3]"
          }`}
        >
          <span
            className={`font-mono font-bold text-[11px] leading-none ${isActiveTab("results") ? "text-[#FAFAFA]" : "text-[#737373]"}`}
          >
            {">_"}
          </span>
          <span>Test Result</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* ─ TESTCASE ─ */}
        {isActiveTab("testcases") && (
          <div className="p-4 flex flex-col gap-5">
            {cases.length > 0 ? (
              <>
                {/* Case pills */}
                <div className="flex items-center gap-2 flex-wrap select-none">
                  {cases.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCase(idx)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 cursor-pointer ${
                        selectedCase === idx
                          ? "bg-[#262626] text-[#FAFAFA]"
                          : "text-[#737373] hover:text-[#A3A3A3] hover:bg-[#1C1C1C]"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCase}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1C1C1C] transition-all cursor-pointer text-base font-bold leading-none"
                    title="Add Testcase"
                  >
                    +
                  </button>
                </div>

                {/* Variable blocks */}
                <div className="flex flex-col gap-4">
                  {assignments.map((asgn, asgnIdx) => (
                    <div key={asgnIdx}>
                      <p className="mb-2 text-xs font-mono text-[#A3A3A3] select-none">
                        {asgn.name} =
                      </p>
                      <textarea
                        value={asgn.value}
                        onChange={(e) =>
                          handleUpdateVariable(
                            selectedCase,
                            asgnIdx,
                            e.target.value,
                          )
                        }
                        rows={Math.max(1, asgn.value.split("\n").length)}
                        spellCheck={false}
                        className="w-full bg-[#1C1C1C] text-[#FAFAFA] font-mono text-sm px-4 py-3 rounded-xl border border-[#2A2A2A] focus:border-[#3A3A3A] focus:outline-none resize-none leading-relaxed transition-colors select-text"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#737373]">No test cases available.</p>
            )}
          </div>
        )}

        {/* ─ RESULTS ─ */}
        {isActiveTab("results") && (
          <div className="p-4">
            {isRunning || isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 select-none">
                <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
                <p className="text-xs font-medium text-[#737373]">
                  Executing solution…
                </p>
              </div>
            ) : activeResult ? (
              <div className="flex flex-col gap-5">
                {/* Status row */}
                <div className="flex items-center gap-3 select-none">
                  {activeResult.status === "accepted" ||
                  activeResult.status === "success" ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-emerald-400">
                        Accepted
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      <span className="text-sm font-bold text-rose-400">
                        {activeResult.status === "wrong_answer"
                          ? "Wrong Answer"
                          : activeResult.status === "compile_error"
                            ? "Compile Error"
                            : activeResult.status === "runtime_error"
                              ? "Runtime Error"
                              : String(activeResult.status)
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </>
                  )}
                  {activeResult.testCases && activeResult.testCases.length > 0 && (
                    <span className="text-xs text-[#737373]">
                      {activeResult.testCases.filter((t) => t.passed).length} /{" "}
                      {activeResult.testCases.length} testcases passed
                    </span>
                  )}
                </div>

                {/* Case tabs with pass/fail */}
                {activeResult.testCases && activeResult.testCases.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap select-none">
                    {cases.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCase(idx)}
                        className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 cursor-pointer ${
                          selectedCase === idx
                            ? "bg-[#262626] text-[#FAFAFA]"
                            : "text-[#737373] hover:text-[#A3A3A3] hover:bg-[#1C1C1C]"
                        }`}
                      >
                        Case {idx + 1}
                        {activeResult.testCases[idx] && (
                          <span>
                            {activeResult.testCases[idx].passed ? (
                              <span className="text-emerald-500">✓</span>
                            ) : (
                              <span className="text-rose-500">✗</span>
                            )}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Detail blocks */}
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#737373] select-none">
                      Input
                    </p>
                    <pre className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 font-mono text-xs text-[#FAFAFA] leading-relaxed whitespace-pre-wrap select-text">
                      {cases[selectedCase]?.input}
                    </pre>
                  </div>

                  {activeResult.testCases?.[selectedCase] && (
                    <>
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#737373] select-none">
                          Expected Output
                        </p>
                        <pre className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 font-mono text-xs text-[#FAFAFA] leading-relaxed whitespace-pre-wrap select-text">
                          {activeResult.testCases[selectedCase].expected}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#737373] select-none">
                          Your Output
                        </p>
                        <pre
                          className={`w-full rounded-xl px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border ${
                            activeResult.testCases[selectedCase].passed
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                          }`}
                        >
                          {activeResult.testCases[selectedCase].actual ??
                            "undefined"}
                        </pre>
                      </div>
                    </>
                  )}

                  {activeResult.console && (
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#737373] select-none">
                        Stdout
                      </p>
                      <pre className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 font-mono text-xs text-amber-400 leading-relaxed overflow-auto max-h-40 select-text">
                        {activeResult.console}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-14 gap-3 select-none">
                <Terminal className="h-7 w-7 text-[#2A2A2A]" />
                <p className="text-xs font-semibold text-[#FAFAFA]">
                  No Results Yet
                </p>
                <p className="text-[11px] text-[#737373] max-w-[220px] leading-relaxed">
                  Run or Submit your solution to see results here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
