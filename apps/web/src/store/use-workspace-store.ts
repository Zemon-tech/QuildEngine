import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TestRunCaseResult {
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
  explanation?: string;
  error?: string;
}

export interface ExecutionResult {
  status:
    | "success"
    | "compile_error"
    | "runtime_error"
    | "accepted"
    | "wrong_answer";
  output: string;
  console: string;
  testCases: TestRunCaseResult[];
}

interface WorkspaceState {
  language: string;
  setLanguage: (lang: string) => void;

  editorWidth: number;
  setEditorWidth: (width: number) => void;

  outputHeight: number;
  setOutputHeight: (height: number) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  codeDrafts: Record<string, string>;
  setCodeDraft: (problemId: string, code: string) => void;

  timerState: {
    isRunning: boolean;
    seconds: number;
  };
  setTimerState: (state: Partial<WorkspaceState["timerState"]>) => void;

  lastOpenedProblem: string | null;
  setLastOpenedProblem: (problemId: string | null) => void;

  // Compiler Execution Pipeline State
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (val: boolean) => void;
  outputActiveTab: string;
  setOutputActiveTab: (tab: string) => void;
  runResult: ExecutionResult | null;
  setRunResult: (res: ExecutionResult | null) => void;
  submitResult: ExecutionResult | null;
  setSubmitResult: (res: ExecutionResult | null) => void;
  clearResults: () => void;

  // Custom Test Cases
  customTestCases: Record<string, { input: string; expected: string }[]>;
  setCustomTestCases: (
    problemId: string,
    cases: { input: string; expected: string }[],
  ) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      language: "typescript",
      setLanguage: (lang) => set({ language: lang }),

      editorWidth: 50,
      setEditorWidth: (width) => set({ editorWidth: width }),

      outputHeight: 25,
      setOutputHeight: (height) => set({ outputHeight: height }),

      activeTab: "description",
      setActiveTab: (tab) => set({ activeTab: tab }),

      codeDrafts: {},
      setCodeDraft: (problemId, code) =>
        set((state) => ({
          codeDrafts: {
            ...state.codeDrafts,
            [`${problemId}_${state.language}`]: code,
          },
        })),

      timerState: { isRunning: false, seconds: 0 },
      setTimerState: (state) =>
        set((prev) => ({
          timerState: { ...prev.timerState, ...state },
        })),

      lastOpenedProblem: null,
      setLastOpenedProblem: (problemId) =>
        set({ lastOpenedProblem: problemId }),

      // Compiler initial states
      isRunning: false,
      setIsRunning: (val) => set({ isRunning: val }),
      isSubmitting: false,
      setIsSubmitting: (val) => set({ isSubmitting: val }),
      outputActiveTab: "testcases",
      setOutputActiveTab: (tab) => set({ outputActiveTab: tab }),
      runResult: null,
      setRunResult: (res) => set({ runResult: res }),
      submitResult: null,
      setSubmitResult: (res) => set({ submitResult: res }),
      clearResults: () => set({ runResult: null, submitResult: null }),

      // Custom Test Cases initial states
      customTestCases: {},
      setCustomTestCases: (problemId, cases) =>
        set((state) => ({
          customTestCases: {
            ...state.customTestCases,
            [problemId]: cases,
          },
        })),
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        language: state.language,
        editorWidth: state.editorWidth,
        outputHeight: state.outputHeight,
        activeTab: state.activeTab,
        codeDrafts: state.codeDrafts,
        timerState: state.timerState,
        lastOpenedProblem: state.lastOpenedProblem,
        customTestCases: state.customTestCases,
      }),
    },
  ),
);
