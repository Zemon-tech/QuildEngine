import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount, BeforeMount } from "@monaco-editor/react";
import {
  Settings,
  Maximize2,
  Copy,
  RotateCcw,
  Sparkles,
  MoreHorizontal,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import type { editor } from "monaco-editor";
import { dsaProblems } from "#/lib/dsa-problems-db";
import type { DSAProblem } from "#/lib/dsa-problems-db";

function getDefaultCodeTemplate(problem: DSAProblem | undefined, lang: string) {
  if (!problem) return "// Write your code here...\n";
  const funcName = problem.id.replace(/-/g, "_");
  const paramName = problem.category === "arrays" ? "nums" : "input";
  const paramType = problem.category === "arrays" ? "number[]" : "string";
  const returnType = problem.id === "two-sum" ? "number[]" : "boolean";

  if (lang === "typescript" || lang === "javascript") {
    const typeAnnotation = lang === "typescript" ? `: ${returnType}` : "";
    const paramAnnotation = lang === "typescript" ? `: ${paramType}` : "";
    return `function ${funcName}(${paramName}${paramAnnotation})${typeAnnotation} {
    // Write your code here
    
    return ${problem.id === "two-sum" ? "[0, 1]" : "true"};
}`;
  }

  if (lang === "python") {
    return `def ${funcName}(${paramName}):
    # Write your code here
    pass`;
  }

  if (lang === "cpp") {
    const cppReturnType = problem.id === "two-sum" ? "vector<int>" : "bool";
    const cppParamType = problem.category === "arrays" ? "vector<int>& nums" : "string s";
    return `class Solution {
public:
    ${cppReturnType} ${funcName}(${cppParamType}) {
        // Write your code here
        
    }
};`;
  }

  if (lang === "java") {
    const javaReturnType = problem.id === "two-sum" ? "int[]" : "boolean";
    const javaParamType = problem.category === "arrays" ? "int[] nums" : "String s";
    return `class Solution {
    public ${javaReturnType} ${funcName}(${javaParamType}) {
        // Write your code here
        
    }
}`;
  }

  if (lang === "go") {
    const goReturnType = problem.id === "two-sum" ? "[]int" : "bool";
    const goParamType = problem.category === "arrays" ? "nums []int" : "input string";
    return `func ${funcName}(${goParamType}) ${goReturnType} {
    // Write your code here
    
}`;
  }

  if (lang === "rust") {
    const rustReturnType = problem.id === "two-sum" ? "Vec<i32>" : "bool";
    const rustParamType = problem.category === "arrays" ? "nums: Vec<i32>" : "input: String";
    return `impl Solution {
    pub fn ${funcName}(${rustParamType}) -> ${rustReturnType} {
        // Write your code here
        
    }
}`;
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
  const { language, setLanguage, codeDrafts, setCodeDraft } = useWorkspaceStore();
  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === problemId);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const handleBeforeMount: BeforeMount = (monaco) => {
    // Define a premium dark theme matching the app workspace
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

    // Keyboard Shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      console.log("Run shortcut (Ctrl+Enter) triggered");
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        console.log("Submit shortcut (Ctrl+Shift+Enter) triggered");
      }
    );

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log("Save shortcut (Ctrl+S) triggered");
      setSaveStatus("saving");
      setTimeout(() => setSaveStatus("saved"), 600);
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
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

  const handleCodeChange = (val: string | undefined) => {
    setCodeDraft(problemId, val || "");
    setSaveStatus("saving");
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (saveStatus === "saving") {
      const timer = setTimeout(() => {
        setSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const code = codeDrafts[problemId] || getDefaultCodeTemplate(problem, language);

  return (
    <div className="flex h-full flex-col bg-[#111111] text-[#FAFAFA] overflow-hidden select-none">
      {/* Editor Toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-[#262626] bg-[#111111] px-4">
        {/* Left Side: Language & Save Status */}
        <div className="flex items-center space-x-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] h-8 bg-[#0A0A0A]/50 border-none hover:bg-[#171717] hover:text-[#FAFAFA] text-[#FAFAFA] text-xs focus:ring-0 transition-all duration-150 cursor-pointer rounded-md">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-[#262626] text-[#FAFAFA]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="focus:bg-[#171717] focus:text-[#FAFAFA] text-xs cursor-pointer">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Auto-save Indicator */}
          <div className="flex items-center space-x-1.5 text-[11px] text-[#A3A3A3] select-none">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                <span className="font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="font-medium text-[#737373]">Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Essential Actions & Dropdown */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all duration-150 active:scale-[0.95]"
            onClick={handleFormat}
            title="Format Code"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all duration-150 active:scale-[0.95]"
            onClick={handleCopy}
            title="Copy Code"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* Dropdown Menu for Secondary Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all duration-150 active:scale-[0.95]"
                title="More Actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0A0A0A] border-[#262626] text-[#FAFAFA] w-40">
              <DropdownMenuItem onClick={handleUndo} className="focus:bg-[#171717] focus:text-[#FAFAFA] text-xs cursor-pointer flex items-center justify-between">
                <span>Undo</span>
                <span className="text-[10px] text-[#737373] font-mono">⌘Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRedo} className="focus:bg-[#171717] focus:text-[#FAFAFA] text-xs cursor-pointer flex items-center justify-between">
                <span>Redo</span>
                <span className="text-[10px] text-[#737373] font-mono">⌘Y</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#262626]" />
              <DropdownMenuItem onClick={handleReset} className="focus:bg-[#171717] focus:text-[#FAFAFA] text-xs cursor-pointer flex items-center text-amber-500 focus:text-amber-400">
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                <span>Reset Code</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all duration-150 active:scale-[0.95]"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all duration-150 active:scale-[0.95]"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
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
  );
}
