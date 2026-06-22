import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Lock, ExternalLink, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { mockRoadmaps, type Roadmap } from "#/lib/learn-db";

export const Route = createFileRoute("/_app/learn/roadmaps")({
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap>(mockRoadmaps[0]);
  const [activeNode, setActiveNode] = useState<string | null>("programming-lang");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight display-title"
          style={{
            color: "var(--sb-ink)",
          }}
        >
          Learning Roadmaps
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>
          Structured milestones to guide your transition from developer core fundamentals to expert systems engineer.
        </p>
      </div>

      {/* Main Roadmap Hub Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Roadmap selector & Timeline Tree */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Select Roadmaps Selector Bar */}
          <div className="flex bg-[var(--sb-pill)] p-1 rounded-lg border border-[var(--sb-border)] self-start max-w-sm">
            {mockRoadmaps.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoadmap(r);
                  setActiveNode(r.nodes[0]?.id || null);
                }}
                className={`flex-1 px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedRoadmap.id === r.id
                    ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
                    : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                }`}
              >
                {r.title.replace(" Learning Path", "")}
              </button>
            ))}
          </div>

          {/* Interactive Timeline Tree */}
          <div 
            className="rounded-2xl p-6 border relative space-y-8"
            style={{
              background: "linear-gradient(165deg, var(--surface-strong), var(--surface))",
              borderColor: "var(--line)",
              boxShadow: "0 1px 0 var(--inset-glint) inset"
            }}
          >
            {/* Connecting Vertical line */}
            <div className="absolute left-[39px] top-8 bottom-8 w-[2px] bg-[var(--sb-border)]" />

            {selectedRoadmap.nodes.map((node) => {
              const isActive = activeNode === node.id;
              const isCompleted = node.status === "completed";
              const isInProgress = node.status === "in-progress";
              const isLocked = node.status === "locked";

              return (
                <div 
                  key={node.id}
                  onClick={() => !isLocked && setActiveNode(node.id)}
                  className={`relative flex gap-6 items-start transition-all ${
                    isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {/* Status Indicator Icon wrapper */}
                  <div className="relative z-10 flex size-8 items-center justify-center rounded-full border bg-[var(--sb-bg)] shrink-0 transition-transform hover:scale-105"
                    style={{
                      borderColor: isActive 
                        ? "var(--sb-accent)" 
                        : (isCompleted ? "rgb(13, 148, 136)" : "var(--sb-border)")
                    }}
                  >
                    {isCompleted && (
                      <CheckCircle2 size={16} className="text-teal-600 fill-teal-600/10" />
                    )}
                    {isInProgress && (
                      <div className="size-2 rounded-full bg-[var(--sb-accent)] animate-ping" />
                    )}
                    {isLocked && (
                      <Lock size={12} className="text-[var(--sb-ink-dim)]" />
                    )}
                    {!isCompleted && !isInProgress && !isLocked && (
                      <Circle size={12} className="text-[var(--sb-ink-dim)]" />
                    )}
                  </div>

                  {/* Node text card details */}
                  <div 
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      isActive 
                        ? "border-[var(--sb-accent)] bg-[var(--sb-pill)]"
                        : "border-[var(--line)] bg-transparent hover:border-[var(--sb-border)]"
                    }`}
                  >
                    <h3 className="font-bold text-sm" style={{ color: "var(--sb-ink)" }}>
                      {node.label}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--sb-ink-muted)" }}>
                      {node.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node details & resources panel */}
        <div className="lg:col-span-4 space-y-4">
          <div 
            className="rounded-2xl p-5 border flex flex-col gap-4"
            style={{ 
              background: "var(--surface)", 
              borderColor: "var(--line)" 
            }}
          >
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--sb-ink-dim)] pb-2 border-b border-[var(--sb-border)] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--sb-accent)]" /> Roadmap Details
            </h3>

            {(() => {
              const activeNodeObj = selectedRoadmap.nodes.find(n => n.id === activeNode);
              if (!activeNodeObj) {
                return (
                  <p className="text-xs text-[var(--sb-ink-dim)] text-center py-8">
                    Select any unlocked roadmap milestone to view resources.
                  </p>
                );
              }

              return (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm" style={{ color: "var(--sb-ink)" }}>{activeNodeObj.label}</h4>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      activeNodeObj.status === "completed" 
                        ? "bg-teal-500/10 text-teal-600" 
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {activeNodeObj.status}
                    </span>
                  </div>

                  <p className="leading-relaxed text-[var(--sb-ink-muted)]">
                    To master this phase, deep dive into recommended articles, guides, and projects listed below. Verify your understanding by writing compiler inputs or systems design diagrams.
                  </p>

                  {/* Resources Links checklist */}
                  {activeNodeObj.resources && activeNodeObj.resources.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-[var(--sb-border)]">
                      <p className="font-bold text-[var(--sb-ink-dim)] uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <BookOpen size={10} /> Recommended Resources
                      </p>
                      
                      <div className="flex flex-col gap-1.5">
                        {activeNodeObj.resources.map((res, j) => {
                          const isExternal = res.to.startsWith("http");

                          return isExternal ? (
                            <a
                              key={j}
                              href={res.to}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-accent)] font-semibold transition-colors"
                            >
                              <span>{res.label}</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <Link
                              key={j}
                              to={res.to}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-accent)] font-semibold transition-colors"
                            >
                              <span>{res.label}</span>
                              <ChevronRight size={12} />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[var(--sb-ink-dim)] italic border-t border-[var(--sb-border)] pt-3">
                      Recommended resources will be unlocked when you reach this step.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}
