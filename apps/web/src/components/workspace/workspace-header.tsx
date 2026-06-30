import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { dsaProblems } from "#/lib/dsa-problems-db";
import { useWorkspaceStore } from "#/store/use-workspace-store";

interface WorkspaceHeaderProps {
  problemId: string;
}

// Helper to strip TypeScript types
function stripTypes(code: string): string {
  let cleaned = code;
  // Remove types from parameters (e.g. `nums: number[]` -> `nums`)
  cleaned = cleaned.replace(
    /:\s*(number\[\]|string\[\]|string|boolean|number|void|int|int\[\]|vector<int>|bool|\[\]int|Vec<i32>)/g,
    "",
  );
  // Remove return type annotations (e.g. `): number[]` -> `)`)
  cleaned = cleaned.replace(
    /\)\s*:\s*(number\[\]|string\[\]|string|boolean|number|void|int|int\[\]|vector<int>|bool|\[\]int|Vec<i32>)/g,
    ")",
  );
  return cleaned;
}

// Helper to run code against test cases
function runTestCase(userFunc: any, inputStr: string, expectedOutput: string) {
  const varNames: string[] = [];
  const matches = inputStr.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g);
  for (const match of matches) {
    varNames.push(match[1]);
  }
  const parseBody = `let ${inputStr}; return [${varNames.join(",")}];`;
  let args: any[] = [];
  try {
    args = new Function(parseBody)();
  } catch (e: any) {
    throw new Error(`Failed to parse inputs: ${e.message}`);
  }
  const actual = userFunc(...args);
  const expected = new Function(`return ${expectedOutput}`)();
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  return {
    input: inputStr,
    expected: expectedOutput,
    actual: JSON.stringify(actual),
    passed,
  };
}

export function WorkspaceHeader({ problemId }: WorkspaceHeaderProps) {
  const {
    timerState,
    setTimerState,
    isRunning,
    setIsRunning,
    isSubmitting,
    setIsSubmitting,
    setOutputActiveTab,
    setRunResult,
    setSubmitResult,
    codeDrafts,
    language,
    customTestCases,
  } = useWorkspaceStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState({ seconds: timerState.seconds + 1 });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.seconds, setTimerState]);

  const navigate = useNavigate();

  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === problemId);

  const problemName =
    problem?.name ||
    (problemId === "1"
      ? "19. Find K Closest Elements"
      : `${problemId}. Example Problem`);

  const handleBack = () => {
    navigate({
      to: "/practice/dsa/$topicId",
      params: { topicId: problem?.category || "arrays" },
    });
  };

  const handleRun = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setOutputActiveTab("results");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const draftKey = `${problemId}_${language}`;
    const userCode = codeDrafts[draftKey] || "";
    const funcName = problemId.replace(/-/g, "_");

    if (!userCode.trim()) {
      setRunResult({
        status: "compile_error",
        output: "",
        console: "Compile Error: No code provided.",
        testCases: [],
      });
      setIsRunning(false);
      return;
    }

    // Check bracket balance
    let braces = 0,
      brackets = 0,
      parens = 0;
    for (const char of userCode) {
      if (char === "{") braces++;
      if (char === "}") braces--;
      if (char === "[") brackets++;
      if (char === "]") brackets--;
      if (char === "(") parens++;
      if (char === ")") parens--;
    }
    if (braces !== 0 || brackets !== 0 || parens !== 0) {
      setRunResult({
        status: "compile_error",
        output: "",
        console: `Compile Error: Syntax error - Unbalanced brackets/parentheses detected (Braces: ${braces}, Brackets: ${brackets}, Parentheses: ${parens}).`,
        testCases: [],
      });
      setIsRunning(false);
      return;
    }

    if (language === "javascript" || language === "typescript") {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        );
      };

      try {
        const cleanedCode = stripTypes(userCode);
        const userFunc = new Function(`${cleanedCode}; return ${funcName};`)();
        if (typeof userFunc !== "function") {
          throw new Error(
            `Function ${funcName} is not defined. Make sure you declare 'function ${funcName}(...)'.`,
          );
        }

        const activeCases =
          customTestCases[problemId] ||
          problem?.examples.map((ex) => ({
            input: ex.input,
            expected: ex.output,
          })) ||
          [];
        const testCaseResults = [];
        let allPassed = true;
        for (const tc of activeCases) {
          const res = runTestCase(userFunc, tc.input, tc.expected);
          testCaseResults.push(res);
          if (!res.passed) allPassed = false;
        }

        setRunResult({
          status: allPassed ? "success" : "wrong_answer",
          output: allPassed
            ? "All basic test cases passed!"
            : "Some test cases failed.",
          console:
            logs.length > 0
              ? logs.join("\n")
              : "Execution completed with no console logs.",
          testCases: testCaseResults,
        });
        setOutputActiveTab("results");
      } catch (err: any) {
        setRunResult({
          status: "runtime_error",
          output: "",
          console: `Runtime Error: ${err.message}\n${err.stack || ""}`,
          testCases: [],
        });
      } finally {
        console.log = originalLog;
      }
    } else {
      const activeCases: { input: string; expected: string }[] =
        customTestCases[problemId] ||
        problem?.examples.map((ex) => ({
          input: ex.input,
          expected: ex.output,
        })) ||
        [];
      const testCases = activeCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
        actual: tc.expected,
        passed: true,
      }));

      setRunResult({
        status: "success",
        output: `Mock execution successful for ${language}.`,
        console: `[Mock Compiler] Compiled successfully.\n[Mock Runner] Executing test cases...\nAll test cases passed!`,
        testCases,
      });
      setOutputActiveTab("results");
    }

    setIsRunning(false);
  };

  const handleSubmit = async () => {
    if (isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setOutputActiveTab("results");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const draftKey = `${problemId}_${language}`;
    const userCode = codeDrafts[draftKey] || "";
    const funcName = problemId.replace(/-/g, "_");

    if (!userCode.trim()) {
      setSubmitResult({
        status: "compile_error",
        output: "",
        console: "Compile Error: No code provided.",
        testCases: [],
      });
      setIsSubmitting(false);
      return;
    }

    // Check bracket balance
    let braces = 0,
      brackets = 0,
      parens = 0;
    for (const char of userCode) {
      if (char === "{") braces++;
      if (char === "}") braces--;
      if (char === "[") brackets++;
      if (char === "]") brackets--;
      if (char === "(") parens++;
      if (char === ")") parens--;
    }
    if (braces !== 0 || brackets !== 0 || parens !== 0) {
      setSubmitResult({
        status: "compile_error",
        output: "",
        console: `Compile Error: Syntax error - Unbalanced brackets/parentheses detected (Braces: ${braces}, Brackets: ${brackets}, Parentheses: ${parens}).`,
        testCases: [],
      });
      setIsSubmitting(false);
      return;
    }

    if (language === "javascript" || language === "typescript") {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        );
      };

      try {
        const cleanedCode = stripTypes(userCode);
        const userFunc = new Function(`${cleanedCode}; return ${funcName};`)();
        if (typeof userFunc !== "function") {
          throw new Error(`Function ${funcName} is not defined.`);
        }

        const activeCases =
          customTestCases[problemId] ||
          problem?.examples.map((ex) => ({
            input: ex.input,
            expected: ex.output,
          })) ||
          [];
        const testCaseResults = [];
        let allPassed = true;
        for (const tc of activeCases) {
          const res = runTestCase(userFunc, tc.input, tc.expected);
          testCaseResults.push(res);
          if (!res.passed) allPassed = false;
        }

        setSubmitResult({
          status: allPassed ? "accepted" : "wrong_answer",
          output: allPassed
            ? "Submission Accepted! All tests passed."
            : "Wrong Answer. Some test cases failed.",
          console:
            logs.length > 0
              ? logs.join("\n")
              : "Submission completed successfully.",
          testCases: testCaseResults,
        });
        setOutputActiveTab("results");
      } catch (err: any) {
        setSubmitResult({
          status: "runtime_error",
          output: "",
          console: `Runtime Error: ${err.message}\n${err.stack || ""}`,
          testCases: [],
        });
      } finally {
        console.log = originalLog;
      }
    } else {
      const activeCases: { input: string; expected: string }[] =
        customTestCases[problemId] ||
        problem?.examples.map((ex) => ({
          input: ex.input,
          expected: ex.output,
        })) ||
        [];
      const testCases = activeCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
        actual: tc.expected,
        passed: true,
      }));

      setSubmitResult({
        status: "accepted",
        output: "Submission Accepted! (Mock Compile & Run)",
        console: `[Mock Compiler] Compiled successfully.\n[Mock Runner] Submission accepted.`,
        testCases,
      });
      setOutputActiveTab("results");
    }

    setIsSubmitting(false);
  };

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#1A1A1A] bg-[#0D0D0D] px-4 select-none shrink-0">
      {/* Left: Back + Problem title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1E1E1E] transition-colors active:scale-[0.94] shrink-0 cursor-pointer"
          title="Back to Topic"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="h-4 w-px bg-[#222] shrink-0" />
        <span className="text-[13px] font-medium text-[#FAFAFA] truncate">
          {problemName}
        </span>
      </div>

      <div className="hidden">
        <button
          id="quild-run-button"
          type="button"
          onClick={handleRun}
          disabled={isRunning || isSubmitting}
        >
          Run
        </button>
        <button
          id="quild-submit-button"
          type="button"
          onClick={handleSubmit}
          disabled={isRunning || isSubmitting}
        >
          Submit
        </button>
      </div>
    </header>
  );
}
