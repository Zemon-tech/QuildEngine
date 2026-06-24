import type { BeforeMount, OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import {
  Check,
  Clock,
  Copy,
  Loader2,
  Maximize2,
  MoreHorizontal,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import type { DSAProblem } from "#/lib/dsa-problems-db";
import { dsaProblems } from "#/lib/dsa-problems-db";
import { useWorkspaceStore } from "#/store/use-workspace-store";

const PROBLEM_SIGNATURES: Record<string, {
  params: { name: string; type: Record<string, string> }[];
  returnType: Record<string, string>;
}> = {
  "two-sum": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } },
      { name: "target", type: { ts: "number", js: "", cpp: "int target", java: "int target", python: "target: int", go: "target int", rust: "target: i32" } }
    ],
    returnType: { ts: "number[]", js: "", cpp: "vector<int>", java: "int[]", python: "list[int]", go: "[]int", rust: "Vec<i32>" }
  },
  "contains-duplicate": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } }
    ],
    returnType: { ts: "boolean", js: "", cpp: "bool", java: "boolean", python: "bool", go: "bool", rust: "bool" }
  },
  "missing-number": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } }
    ],
    returnType: { ts: "number", js: "", cpp: "int", java: "int", python: "int", go: "int", rust: "i32" }
  },
  "majority-element": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } }
    ],
    returnType: { ts: "number", js: "", cpp: "int", java: "int", python: "int", go: "int", rust: "i32" }
  },
  "running-sum-of-1d-array": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } }
    ],
    returnType: { ts: "number[]", js: "", cpp: "vector<int>", java: "int[]", python: "list[int]", go: "[]int", rust: "Vec<i32>" }
  },
  "subarray-sum-equals-k": {
    params: [
      { name: "nums", type: { ts: "number[]", js: "", cpp: "vector<int>& nums", java: "int[] nums", python: "nums: list[int]", go: "nums []int", rust: "nums: Vec<i32>" } },
      { name: "k", type: { ts: "number", js: "", cpp: "int k", java: "int k", python: "k: int", go: "k int", rust: "k: i32" } }
    ],
    returnType: { ts: "number", js: "", cpp: "int", java: "int", python: "int", go: "int", rust: "i32" }
  },
  "valid-anagram": {
    params: [
      { name: "s", type: { ts: "string", js: "", cpp: "string s", java: "String s", python: "s: str", go: "s string", rust: "s: String" } },
      { name: "t", type: { ts: "string", js: "", cpp: "string t", java: "String t", python: "t: str", go: "t string", rust: "t: String" } }
    ],
    returnType: { ts: "boolean", js: "", cpp: "bool", java: "boolean", python: "bool", go: "bool", rust: "bool" }
  },
  "reverse-string": {
    params: [
      { name: "s", type: { ts: "string[]", js: "", cpp: "vector<char>& s", java: "char[] s", python: "s: list[str]", go: "s []byte", rust: "s: &mut Vec<char>" } }
    ],
    returnType: { ts: "void", js: "", cpp: "void", java: "void", python: "None", go: "void", rust: "" }
  },
  "longest-substring-without-repeating-characters": {
    params: [
      { name: "s", type: { ts: "string", js: "", cpp: "string s", java: "String s", python: "s: str", go: "s string", rust: "s: String" } }
    ],
    returnType: { ts: "number", js: "", cpp: "int", java: "int", python: "int", go: "int", rust: "i32" }
  }
};

function getDefaultCodeTemplate(problem: DSAProblem | undefined, lang: string) {
  if (!problem) return "// Write your code here...\n";
  const funcName = problem.id.replace(/-/g, "_");
  const spec = PROBLEM_SIGNATURES[problem.id];

  if (spec) {
    if (lang === "typescript" || lang === "javascript") {
      const args = spec.params.map(p => {
        const type = p.type.ts;
        return lang === "typescript" && type ? `${p.name}: ${type}` : p.name;
      }).join(", ");
      const ret = lang === "typescript" && spec.returnType.ts ? `: ${spec.returnType.ts}` : "";
      const defaultVal = spec.returnType.ts === "boolean" ? "true" : (spec.returnType.ts === "number[]" ? "[0, 1]" : (spec.returnType.ts === "number" ? "0" : "[]"));
      return `function ${funcName}(${args})${ret} {\n    // Write your code here\n    return ${defaultVal};\n}`;
    }
    if (lang === "python") {
      const args = spec.params.map(p => p.name).join(", ");
      return `def ${funcName}(${args}):\n    # Write your code here\n    pass`;
    }
    if (lang === "cpp") {
      const cppArgs = spec.params.map(p => p.type.cpp).join(", ");
      const cppRet = spec.returnType.cpp;
      return `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppRet} ${funcName}(${cppArgs}) {\n        // Write your code here\n        \n    }\n};`;
    }
    if (lang === "java") {
      const javaArgs = spec.params.map(p => p.type.java).join(", ");
      const javaRet = spec.returnType.java;
      return `import java.util.*;\n\nclass Solution {\n    public ${javaRet} ${funcName}(${javaArgs}) {\n        // Write your code here\n        \n    }\n}`;
    }
    if (lang === "go") {
      const goArgs = spec.params.map(p => p.type.go).join(", ");
      const goRet = spec.returnType.go;
      return `package main\n\nfunc ${funcName}(${goArgs}) ${goRet} {\n    // Write your code here\n    \n}`;
    }
    if (lang === "rust") {
      const rustArgs = spec.params.map(p => p.type.rust).join(", ");
      const rustRet = spec.returnType.rust ? ` -> ${spec.returnType.rust}` : "";
      return `impl Solution {\n    pub fn ${funcName}(${rustArgs})${rustRet} {\n        // Write your code here\n        \n    }\n}`;
    }
  }

  const paramName = problem.category === "arrays" ? "nums" : "input";
  const paramType = problem.category === "arrays" ? "number[]" : "string";
  const returnType = problem.id === "two-sum" ? "number[]" : "boolean";

  if (lang === "typescript" || lang === "javascript") {
    const typeAnnotation = lang === "typescript" ? `: ${returnType}` : "";
    const paramAnnotation = lang === "typescript" ? `: ${paramType}` : "";
    return `function ${funcName}(${paramName}${paramAnnotation})${typeAnnotation} {\n    // Write your code here\n    return ${problem.id === "two-sum" ? "[0, 1]" : "true"};\n}`;
  }
  if (lang === "python") {
    return `def ${funcName}(${paramName}):\n    # Write your code here\n    pass`;
  }
  if (lang === "cpp") {
    const cppReturnType = problem.id === "two-sum" ? "vector<int>" : "bool";
    const cppParamType = problem.category === "arrays" ? "vector<int>& nums" : "string s";
    return `#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppReturnType} ${funcName}(${cppParamType}) {\n        // Write your code here\n        \n    }\n};`;
  }
  if (lang === "java") {
    const javaReturnType = problem.id === "two-sum" ? "int[]" : "boolean";
    const javaParamType = problem.category === "arrays" ? "int[] nums" : "String s";
    return `import java.util.*;\n\nclass Solution {\n    public ${javaReturnType} ${funcName}(${javaParamType}) {\n        // Write your code here\n        \n    }\n}`;
  }

  return `// Write your solution here`;
}

interface EditorPanelProps {
  problemId: string;
}

const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export function EditorPanel({ problemId }: EditorPanelProps) {
  const {
    language,
    setLanguage,
    codeDrafts,
    setCodeDraft,
    isRunning,
    isSubmitting,
    timerState,
    setTimerState,
  } = useWorkspaceStore();

  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === problemId);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [lastSaved, setLastSaved] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`quild_last_saved_${problemId}_${language}`) || "";
    }
    return "";
  });

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("premium-dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A737D", fontStyle: "italic" },
        { token: "keyword", foreground: "F97583" },
        { token: "string", foreground: "9ECBFF" },
        { token: "number", foreground: "79B8FF" },
        { token: "type", foreground: "B392F0" },
      ],
      colors: {
        "editor.background": "#111111",
        "editor.foreground": "#FAFAFA",
        "editor.lineHighlightBackground": "#171717",
        "editorLineNumber.foreground": "#4F4F4F",
        "editorLineNumber.activeForeground": "#FAFAFA",
        "editor.selectionBackground": "#262626",
        "editorGutter.background": "#111111",
        "editor.border": "#262626",
      },
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Restore cursor position
    const savedPos = localStorage.getItem(`monaco_cursor_${problemId}_${language}`);
    if (savedPos) {
      try {
        editor.setPosition(JSON.parse(savedPos));
      } catch (e) {}
    }

    // Restore scroll position
    const savedScroll = localStorage.getItem(`monaco_scroll_${problemId}_${language}`);
    if (savedScroll) {
      try {
        const scrollObj = JSON.parse(savedScroll);
        editor.setScrollTop(scrollObj.scrollTop);
        editor.setScrollLeft(scrollObj.scrollLeft);
      } catch (e) {}
    }

    // Cursor position listener
    editor.onDidChangeCursorPosition(() => {
      const pos = editor.getPosition();
      if (pos) {
        localStorage.setItem(`monaco_cursor_${problemId}_${language}`, JSON.stringify(pos));
      }
    });

    // Scroll change listener
    editor.onDidScrollChange(() => {
      const scrollTop = editor.getScrollTop();
      const scrollLeft = editor.getScrollLeft();
      localStorage.setItem(`monaco_scroll_${problemId}_${language}`, JSON.stringify({ scrollTop, scrollLeft }));
    });

    // Keyboard Shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const runBtn = document.getElementById("quild-run-button");
      if (runBtn) runBtn.click();
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        const submitBtn = document.getElementById("quild-submit-button");
        if (submitBtn) submitBtn.click();
      },
    );

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      setSaveStatus("saving");
    });

    editor.addCommand(
      monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        editor.getAction("editor.action.formatDocument")?.run();
      },
    );
  };

  const handleFormat = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleReset = () => {
    setCodeDraft(problemId, "");
  };

  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.getValue());
    }
  };

  const handleUndo = () => {
    editorRef.current?.trigger("keyboard", "undo", null);
  };

  const handleRedo = () => {
    editorRef.current?.trigger("keyboard", "redo", null);
  };

  const formatElapsedTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hrs, mins, secs]
      .map((part) => String(part).padStart(2, "0"))
      .join(":");
  };

  const handleToggleTimer = () => {
    setTimerState({ isRunning: !timerState.isRunning });
  };

  const handleResetTimer = () => {
    setTimerState({ isRunning: false, seconds: 0 });
  };

  const handleCodeChange = (val: string | undefined) => {
    setCodeDraft(problemId, val || "");
    setSaveStatus("saving");
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (saveStatus === "saving") {
      const timer = setTimeout(() => {
        setSaveStatus("saved");
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSaved(timeStr);
        localStorage.setItem(`quild_last_saved_${problemId}_${language}`, timeStr);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, problemId, language]);

  const draftKey = `${problemId}_${language}`;
  const code = codeDrafts[draftKey] || getDefaultCodeTemplate(problem, language);

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col bg-[#111111] text-[#FAFAFA] select-none">
      {/* ── Toolbar ── */}
      <div className="flex h-10 shrink-0 items-center border-b border-[#1A1A1A] bg-[#111111] px-3">
        {/* Left: Language picker + save status */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[110px] h-7 bg-transparent border-none text-[#FAFAFA] text-[12px] focus:ring-0 hover:bg-[#1A1A1A] transition-colors cursor-pointer rounded-md px-2">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D0D0D] border-[#222] text-[#FAFAFA]">
              {LANGUAGES.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="focus:bg-[#1A1A1A] focus:text-[#FAFAFA] text-xs cursor-pointer"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="h-3.5 w-px bg-[#222] shrink-0" />
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-[11px]">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                <span className="text-[#737373]">Saving...</span>
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-[#4A4A4A]">
                  {lastSaved ? `Saved ${lastSaved}` : "Saved"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Timer, Run, Submit */}
        <div className="flex items-center gap-3 justify-center">
          <div className="flex h-9 items-center gap-2 rounded-[8px] border border-white/5 bg-[#1C1C1F] px-3 text-[#F8F8FA] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Clock className="h-3.5 w-3.5 text-[#D7D7DF]" />
            <span className="min-w-[64px] font-mono text-xs font-semibold tabular-nums tracking-[0.01em] text-white">
              {formatElapsedTime(timerState.seconds)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className="flex size-6 items-center justify-center rounded-md text-[#F2F2F5] transition-colors hover:bg-white/10 active:scale-[0.94]"
                  aria-label={timerState.isRunning ? "Pause timer" : "Start timer"}
                >
                  {timerState.isRunning ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={4}>
                {timerState.isRunning ? "Pause timer" : "Start timer"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="flex size-6 items-center justify-center rounded-md text-[#8E8E98] transition-colors hover:bg-white/10 hover:text-white active:scale-[0.94]"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={4}>Reset timer</TooltipContent>
            </Tooltip>
          </div>

          <Button
            type="button"
            disabled={isRunning || isSubmitting}
            onClick={() => document.getElementById("quild-run-button")?.click()}
            className="h-8 rounded-[8px] border border-white/5 bg-[#1C1C1F] px-3 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#24242A] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed"
            title="Run (Ctrl+Enter)"
            variant="ghost"
          >
            {isRunning ? (
              <Loader2 data-icon="inline-start" className="animate-spin h-3 w-3" />
            ) : (
              <Play data-icon="inline-start" className="h-3 w-3" />
            )}
            Run
          </Button>

          <Button
            type="button"
            disabled={isRunning || isSubmitting}
            onClick={() => document.getElementById("quild-submit-button")?.click()}
            className="h-8 rounded-[8px] bg-[#7969E8] px-3 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(121,105,232,0.18)] hover:bg-[#8A78F0] active:scale-[0.98] disabled:cursor-not-allowed"
            title="Submit (Ctrl+Shift+Enter)"
          >
            {isSubmitting ? (
              <Loader2 data-icon="inline-start" className="animate-spin h-3 w-3" />
            ) : (
              <Upload data-icon="inline-start" className="h-3 w-3" />
            )}
            Submit
          </Button>
        </div>

        {/* Right: icon actions */}
        <div className="flex items-center gap-0.5 flex-1 justify-end min-w-0">
          <button
            type="button"
            onClick={handleFormat}
            title="Format Code (Alt+Shift+F)"
            className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors active:scale-[0.93] cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Code"
            className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors active:scale-[0.93] cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                title="More Actions"
                className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors active:scale-[0.93] cursor-pointer"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#0D0D0D] border-[#222] text-[#FAFAFA] w-40"
            >
              <DropdownMenuItem
                onClick={handleUndo}
                className="focus:bg-[#1A1A1A] focus:text-[#FAFAFA] text-xs cursor-pointer flex items-center justify-between"
              >
                <span>Undo</span>
                <span className="text-[10px] text-[#555] font-mono">⌘Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRedo}
                className="focus:bg-[#1A1A1A] focus:text-[#FAFAFA] text-xs cursor-pointer flex items-center justify-between"
              >
                <span>Redo</span>
                <span className="text-[10px] text-[#555] font-mono">⌘Y</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#222]" />
              <DropdownMenuItem
                onClick={handleReset}
                className="focus:bg-[#1A1A1A] text-xs cursor-pointer flex items-center text-amber-500 focus:text-amber-400"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                <span>Reset Code</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="h-3.5 w-px bg-[#222] shrink-0 mx-0.5" />
          <button
            type="button"
            title="Settings"
            className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors active:scale-[0.93] cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Fullscreen"
            className="flex items-center justify-center h-7 w-7 rounded-md text-[#555] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors active:scale-[0.93] cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <Editor
          key={`${problemId}-${language}`}
          height="100%"
          language={language}
          theme="premium-dark-theme"
          value={code}
          beforeMount={handleBeforeMount}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            automaticLayout: true,
          }}
        />
      </div>

      </div>
    </TooltipProvider>
  );
}
