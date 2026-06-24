import { useEffect } from "react";
import { Play, Pause, PlaySquare, Send, ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import { dsaProblems } from "#/lib/dsa-problems-db";

interface WorkspaceHeaderProps {
  problemId: string;
}

export function WorkspaceHeader({ problemId }: WorkspaceHeaderProps) {
  const { timerState, setTimerState } = useWorkspaceStore();

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

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const toggleTimer = () => {
    setTimerState({ isRunning: !timerState.isRunning });
  };

  const navigate = useNavigate();

  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === problemId);

  const problemName = problem?.name || (problemId === "1" ? "19. Find K Closest Elements" : `${problemId}. Example Problem`);

  const handleBack = () => {
    navigate({
      to: "/practice/dsa/$topicId",
      params: { topicId: problem?.category || "arrays" },
    });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#262626] bg-[#0A0A0A] px-4 select-none">
      {/* Left side: Back Button & Problem Title */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all active:scale-[0.95]"
          title="Back to Topic"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold text-[#FAFAFA]">
          {problemName}
        </span>
      </div>

      {/* Right side: Timer, Run, Submit */}
      <div className="flex items-center space-x-4">
        {/* Timer */}
        <div className="flex items-center space-x-2 rounded-md border border-[#262626] bg-[#111111] px-3 py-1 text-xs font-mono text-[#FAFAFA]">
          <span>{formatTime(timerState.seconds)}</span>
          <button
            onClick={toggleTimer}
            className="text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors focus:outline-none"
          >
            {timerState.isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-[#262626] bg-[#111111] text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] px-3 text-xs font-medium active:scale-[0.97] transition-all"
          >
            <PlaySquare className="mr-1.5 h-3.5 w-3.5" />
            Run
          </Button>
          <Button
            size="sm"
            className="h-8 bg-emerald-600 hover:bg-emerald-500 text-[#FAFAFA] border-none px-3 text-xs font-medium active:scale-[0.97] transition-all"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </div>
    </header>
  );
}
