import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#/components/ui/resizable";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import { EditorPanel } from "./editor-panel";
import { OutputPanel } from "./output-panel";
import { ProblemPanel } from "./problem-panel";
import { WorkspaceHeader } from "./workspace-header";

interface WorkspaceLayoutProps {
  problemId: string;
}

export function WorkspaceLayout({ problemId }: WorkspaceLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const { editorWidth, setEditorWidth, outputHeight, setOutputHeight } =
    useWorkspaceStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex h-screen w-screen flex-col bg-[#0A0A0A] overflow-hidden select-none">
      {/* Workspace Header */}
      <WorkspaceHeader problemId={problemId} />

      {/* Resizable Workspace Content */}
      <div className="flex-1 w-full overflow-hidden relative">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full w-full rounded-none"
          onLayoutChange={(layout) => {
            if (layout["editor-pane"] !== undefined) {
              setEditorWidth(layout["editor-pane"]);
            }
          }}
        >
          {/* Left Panel: Problem Description */}
          <ResizablePanel
            id="problem-pane"
            defaultSize={100 - editorWidth}
            minSize={30}
            className="h-full bg-[#0A0A0A]"
          >
            <ProblemPanel problemId={problemId} />
          </ResizablePanel>

          {/* Draggable Divider */}
          <ResizableHandle
            withHandle
            className="w-1.5 bg-[#262626] hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors"
          />

          {/* Right Panel: Editor and Output */}
          <ResizablePanel
            id="editor-pane"
            defaultSize={editorWidth}
            minSize={30}
            className="h-full flex flex-col bg-[#111111]"
          >
            <ResizablePanelGroup
              orientation="vertical"
              className="h-full"
              onLayoutChange={(layout) => {
                if (layout["output-pane"] !== undefined) {
                  setOutputHeight(layout["output-pane"]);
                }
              }}
            >
              {/* Top: Editor */}
              <ResizablePanel
                id="monaco-pane"
                defaultSize={100 - outputHeight}
                minSize={20}
                className="h-full flex flex-col bg-[#111111]"
              >
                <EditorPanel problemId={problemId} />
              </ResizablePanel>

              {/* Draggable Divider */}
              <ResizableHandle
                withHandle
                className="h-1.5 bg-[#262626] hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors"
              />

              {/* Bottom: Output */}
              <ResizablePanel
                id="output-pane"
                defaultSize={outputHeight}
                minSize={10}
                className="flex flex-col bg-[#0A0A0A]"
              >
                <OutputPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
