import { useState, useEffect } from "react";
import { Bookmark, Flag, Lightbulb, Bot, MessageSquare, History, CheckSquare, FileText } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import { dsaProblems } from "#/lib/dsa-problems-db";

interface ProblemPanelProps {
  problemId: string;
}

export function ProblemPanel({ problemId }: ProblemPanelProps) {
  const { activeTab, setActiveTab } = useWorkspaceStore();
  const [noteText, setNoteText] = useState("");

  const problem = Object.values(dsaProblems)
    .flat()
    .find((p) => p.id === problemId);

  const problemName = problem?.name || (problemId === "1" ? "19. Find K Closest Elements" : `${problemId}. Example Problem`);

  useEffect(() => {
    setNoteText(localStorage.getItem(`note_${problemId}`) || "");
  }, [problemId]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteText(val);
    localStorage.setItem(`note_${problemId}`, val);
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

  return (
    <div className="flex h-full flex-col bg-[#0A0A0A] text-[#FAFAFA] border-r border-[#262626] overflow-hidden">
      {/* Title / Utility header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0A0A0A]">
        <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA] flex items-center select-text">
          {problemName}
        </h1>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("editorial")}
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all active:scale-[0.95]"
            title="Hint"
          >
            <Lightbulb className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all active:scale-[0.95]"
            title="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] rounded-md transition-all active:scale-[0.95]"
            title="Report"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b border-[#262626] bg-[#0A0A0A] sticky top-0 z-10">
          <TabsList className="bg-transparent h-10 p-0 gap-6 justify-start w-full overflow-x-auto scrollbar-none flex">
            {[
              { id: "description", label: "Description", icon: FileText },
              { id: "editorial", label: "Editorial", icon: Lightbulb },
              { id: "ai", label: "AI", icon: Bot },
              { id: "discussion", label: "Discussion", icon: MessageSquare },
              { id: "submissions", label: "Submissions", icon: History },
              { id: "review", label: "Review", icon: CheckSquare },
              { id: "notes", label: "Notes", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 h-full font-medium text-xs text-[#A3A3A3] data-[state=active]:text-[#FAFAFA] hover:text-[#FAFAFA] transition-all duration-150 flex items-center space-x-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#0A0A0A] scrollbar-thin">
          {problem ? (
            <TabsContent value="description" className="mt-0 outline-none space-y-6">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : problem.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-[#A3A3A3] capitalize">{problem.category}</span>
                {problem.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#A3A3A3]">{tag}</span>
                ))}
              </div>

              <div className="text-sm text-[#FAFAFA] leading-relaxed whitespace-pre-line select-text">
                {problem.description}
              </div>

              {problem.examples && problem.examples.map((ex, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#FAFAFA]">Example {idx + 1}:</h3>
                  <div className="bg-[#111111] rounded-lg p-4 font-mono text-xs border border-[#262626] space-y-1 select-text">
                    <div className="text-[#A3A3A3]">Input: <span className="text-[#FAFAFA]">{ex.input}</span></div>
                    <div className="text-[#A3A3A3]">Output: <span className="text-[#FAFAFA]">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="text-[#A3A3A3] mt-2">Explanation: <span className="text-[#E5E5E5] block mt-1 font-sans">{ex.explanation}</span></div>
                    )}
                  </div>
                </div>
              ))}

              {problem.constraints && problem.constraints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#FAFAFA]">Constraints:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-[#A3A3A3] bg-[#111111]/50 p-4 rounded-lg border border-[#262626]/60 inline-block select-text">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          ) : (
            <TabsContent value="description" className="mt-0 outline-none space-y-6">
              <div className="flex items-center space-x-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Medium</span>
                <span className="text-xs text-[#A3A3A3]">Array</span>
                <span className="text-xs text-[#A3A3A3]">Binary Search</span>
                <span className="text-xs text-[#A3A3A3]">Two Pointers</span>
              </div>

              <p className="text-sm text-[#FAFAFA] leading-relaxed">
                Given a <strong>sorted</strong> integer array <code>arr</code>, two integers <code>k</code> and <code>x</code>, return the <code>k</code> closest integers to <code>x</code> in the array. The result should also be sorted in ascending order.
              </p>

              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                An integer <code>a</code> is closer to <code>x</code> than an integer <code>b</code> if:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#A3A3A3]">
                <li><code>|a - x| &lt; |b - x|</code>, or</li>
                <li><code>|a - x| == |b - x|</code> and <code>a &lt; b</code></li>
              </ul>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Example 1:</h3>
                <div className="bg-[#111111] rounded-lg p-4 font-mono text-xs border border-[#262626] space-y-1">
                  <div className="text-[#A3A3A3]">Input: <span className="text-[#FAFAFA]">arr = [1,2,3,4,5], k = 4, x = 3</span></div>
                  <div className="text-[#A3A3A3]">Output: <span className="text-[#FAFAFA]">[1,2,3,4]</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Example 2:</h3>
                <div className="bg-[#111111] rounded-lg p-4 font-mono text-xs border border-[#262626] space-y-1">
                  <div className="text-[#A3A3A3]">Input: <span className="text-[#FAFAFA]">arr = [1,2,3,4,5], k = 4, x = -1</span></div>
                  <div className="text-[#A3A3A3]">Output: <span className="text-[#FAFAFA]">[1,2,3,4]</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Constraints:</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-[#A3A3A3] bg-[#111111]/50 p-4 rounded-lg border border-[#262626]/60 inline-block">
                  <li>1 &lt;= k &lt;= arr.length</li>
                  <li>1 &lt;= arr.length &lt;= 10^4</li>
                  <li>arr is sorted in ascending order.</li>
                  <li>-10^4 &lt;= arr[i], x &lt;= 10^4</li>
                </ul>
              </div>
            </TabsContent>
          )}

          <TabsContent value="editorial" className="mt-0 outline-none">
            {problem && problem.hints && problem.hints.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400 animate-pulse" />
                  Hints & Approach
                </h3>
                <div className="space-y-3">
                  {problem.hints.map((hint, idx) => (
                    <div key={idx} className="bg-[#111111] border border-[#262626] rounded-lg p-4 text-xs text-[#E5E5E5] space-y-1 select-text">
                      <span className="font-semibold text-[#FAFAFA]">Hint {idx + 1}</span>
                      <p className="text-[#A3A3A3] mt-1 leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[#A3A3A3] flex flex-col items-center justify-center py-20 text-center space-y-3">
                <Lightbulb className="h-10 w-10 text-[#262626]" />
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Official Editorial</h3>
                <p className="text-xs max-w-sm">Detailed solution approaches, optimized space/time complexities, and walk-throughs will be rendered here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-0 outline-none">
            <div className="text-[#A3A3A3] flex flex-col items-center justify-center py-20 text-center space-y-3">
              <Bot className="h-10 w-10 text-[#262626]" />
              <h3 className="text-sm font-semibold text-[#FAFAFA]">AI Assistant</h3>
              <p className="text-xs max-w-sm">Ask questions, get help refactoring, or generate hints about the problem instantly.</p>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-0 outline-none">
            <div className="text-[#A3A3A3] flex flex-col items-center justify-center py-20 text-center space-y-3">
              <MessageSquare className="h-10 w-10 text-[#262626]" />
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Community Discussion</h3>
              <p className="text-xs max-w-sm">See discussion posts, questions, and alternate solutions shared by other users.</p>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0 outline-none">
            <div className="text-[#A3A3A3] flex flex-col items-center justify-center py-20 text-center space-y-3">
              <History className="h-10 w-10 text-[#262626]" />
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Submission History</h3>
              <p className="text-xs max-w-sm">Your past submission results, execution speeds, and memory usages will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-0 outline-none">
            <div className="text-[#A3A3A3] flex flex-col items-center justify-center py-20 text-center space-y-3">
              <CheckSquare className="h-10 w-10 text-[#262626]" />
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Review Queue</h3>
              <p className="text-xs max-w-sm">Add this problem to your spaced repetition queue to solve it again later.</p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-0 outline-none space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                Personal Workspace Notes
              </h3>
              <p className="text-[11px] text-[#A3A3A3]">
                Your notes are automatically saved to your local storage.
              </p>
              <textarea
                value={noteText}
                onChange={handleNoteChange}
                placeholder="Write your notes, test ideas, or pseudocode here..."
                className="w-full h-64 bg-[#111111] border border-[#262626] rounded-lg p-3 text-xs text-[#FAFAFA] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none font-sans leading-relaxed"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
