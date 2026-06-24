import { create } from "zustand";
import { persist } from "zustand/middleware";

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
            [problemId]: code,
          },
        })),
        
      timerState: { isRunning: false, seconds: 0 },
      setTimerState: (state) =>
        set((prev) => ({
          timerState: { ...prev.timerState, ...state },
        })),

      lastOpenedProblem: null,
      setLastOpenedProblem: (problemId) => set({ lastOpenedProblem: problemId }),
    }),
    {
      name: "workspace-storage",
    }
  )
);
