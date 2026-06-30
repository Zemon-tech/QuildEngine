import {
  AlertCircle,
  CheckCircle2,
  FileCode,
  PlaySquare,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export function OutputPanel() {
  const [activeTab, setActiveTab] = useState("testcases");

  return (
    <div className="flex h-full flex-col bg-[#0A0A0A] text-[#FAFAFA] border-t border-[#262626] overflow-hidden">
      {/* Header Tabs */}
      <div className="flex h-11 items-center justify-between border-b border-[#262626] px-4 bg-[#0A0A0A]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="bg-transparent h-full p-0 space-x-6 justify-start">
            {[
              { id: "testcases", label: "Test Cases", icon: FileCode },
              { id: "output", label: "Output", icon: PlaySquare },
              { id: "console", label: "Console", icon: Terminal },
              { id: "results", label: "Results", icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 h-full text-xs font-medium text-[#A3A3A3] data-[state=active]:text-[#FAFAFA] hover:text-[#FAFAFA] transition-all duration-150 flex items-center space-x-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#0A0A0A]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent
            value="testcases"
            className="m-0 h-full space-y-4 outline-none"
          >
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-semibold rounded-md bg-[#171717] text-[#FAFAFA] border border-[#262626] active:scale-[0.95] transition-all">
                Case 1
              </button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#111111] border border-transparent active:scale-[0.95] transition-all">
                Case 2
              </button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#111111] border border-transparent active:scale-[0.95] transition-all">
                Case 3
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#A3A3A3] font-bold mb-1.5">
                  Input:
                </div>
                <div className="bg-[#111111] px-4 py-3 rounded-lg font-mono text-xs border border-[#262626] text-[#FAFAFA] leading-relaxed">
                  arr = [1,2,3,4,5]
                  <br />k = 4
                  <br />x = 3
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#A3A3A3] font-bold mb-1.5">
                  Expected:
                </div>
                <div className="bg-[#111111] px-4 py-3 rounded-lg font-mono text-xs border border-[#262626] text-[#FAFAFA] leading-relaxed">
                  [1,2,3,4]
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="output"
            className="m-0 h-full outline-none flex flex-col justify-center items-center text-center py-10 space-y-3"
          >
            <PlaySquare className="h-8 w-8 text-[#262626]" />
            <h4 className="text-xs font-semibold text-[#FAFAFA]">
              No compilation output
            </h4>
            <p className="text-[11px] text-[#A3A3A3] max-w-xs">
              Run your solution to generate compiler execution results and
              debugging logs.
            </p>
          </TabsContent>

          <TabsContent value="console" className="m-0 h-full outline-none">
            <div className="font-mono text-xs text-amber-500 bg-[#111111] border border-[#262626] rounded-lg p-4 h-full min-h-[100px] leading-relaxed">
              &gt; Ready to execute...
            </div>
          </TabsContent>

          <TabsContent
            value="results"
            className="m-0 h-full outline-none flex flex-col justify-center items-center text-center py-10 space-y-3"
          >
            <AlertCircle className="h-8 w-8 text-[#262626]" />
            <h4 className="text-xs font-semibold text-[#FAFAFA]">
              No Results Yet
            </h4>
            <p className="text-[11px] text-[#A3A3A3] max-w-xs">
              Submit your solution to run against all automated test suites and
              check performance metrics.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
