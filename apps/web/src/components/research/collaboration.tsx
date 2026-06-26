import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Send,
  MousePointer2,
  FileEdit,
} from "lucide-react";
import { SpotlightEffect, GlassCard } from "./spotlight";

export function CollaborationPreview() {
  // Members list
  const activeMembers = [
    { name: "Elena Chen", color: "bg-indigo-500", border: "border-indigo-400", x: "12%", y: "24%", text: "Elena is formatting abstract" },
    { name: "Marcus Thorne", color: "bg-pink-500", border: "border-pink-400", x: "65%", y: "42%", text: "Marcus is reviewing citations" },
    { name: "Siddharth Sen", color: "bg-cyan-500", border: "border-cyan-400", x: "42%", y: "82%", text: "Siddharth is updating math formulas" },
  ];

  const comments = [
    {
      author: "Elena Chen",
      role: "Lead Researcher",
      time: "2m ago",
      text: "Should we update the empirical scaling formulas in section 3 with the new 2024 model benchmark data?",
      resolved: false,
    },
    {
      author: "Marcus Thorne",
      role: "AI Scientist",
      time: "Just now",
      text: "Yes, I've compiled the datasets. Adding the coordinate models under the raw tables right now.",
      resolved: false,
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 flex items-center justify-center gap-2 display-title">
          <Users className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          Real-time Collaboration
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Accelerate discoveries in shared workspaces with real-time editing, context pooling, and automated citations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left/Center: multiplayer document editor */}
        <div className="lg:col-span-2 relative bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] rounded-xl border border-[var(--sb-border)]/40 dark:border-white/[0.08] p-6 h-[480px] flex flex-col justify-between overflow-hidden">
          
          {/* Editor Header */}
          <div className="flex justify-between items-center border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-4 mb-4 select-none">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-[var(--sb-ink-muted)]">
                Draft: Quantum-ML-Convergence.md
              </span>
            </div>
            
            {/* Active User Avatars */}
            <div className="flex items-center -space-x-2">
              {activeMembers.map((m, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full ${m.color} text-zinc-950 font-bold border border-zinc-950 flex items-center justify-center text-[10px] select-none cursor-help`}
                  title={m.name}
                >
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] text-[10px] flex items-center justify-center font-mono font-bold">
                +4
              </div>
            </div>
          </div>

          {/* Document Content Workspace with mock cursors */}
          <div className="flex-1 relative font-sans text-[var(--sb-ink-muted)] text-xs sm:text-sm leading-relaxed overflow-y-auto space-y-4 pr-2">
            <p>
              We formulate a hybrid model blending superconducting tensor logic with classical feed-forward circuits. By partitioning local quantum arrays into modular attention channels, we eliminate gate delay ceilings.
            </p>
            <p className="border-l-2 border-[var(--sb-border)] pl-3 italic text-[var(--sb-ink-dim)] bg-[var(--sb-pill)]/50 py-1.5 rounded-r">
              "Convergence benchmarks demonstrate that the quantum attention model scales linearly with qubit configurations, resolving cross-entropy bounds in under 4 minutes."
            </p>
            <p>
              Further structural adjustments seek to map sparse embeddings over localized grids, allowing parallel compilation passes directly on the device registers.
            </p>

            {/* Mock Floating multiplayer Cursors */}
            {activeMembers.map((m, idx) => (
              <motion.div
                key={idx}
                className="absolute flex flex-col items-start gap-1 pointer-events-none select-none z-20"
                style={{ left: m.x, top: m.y }}
                animate={{
                  y: [0, -6, 0],
                  x: [0, 8, 0],
                }}
                transition={{
                  duration: 6 + idx,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MousePointer2 className="w-4 h-4 text-white fill-current shrink-0 transform -rotate-90 drop-shadow-md" style={{ color: m.color.replace("bg-", "") }} />
                <span className={`px-2 py-0.5 text-[9px] font-semibold rounded text-zinc-950 shadow-lg ${m.color}`}>
                  {m.name.split(" ")[0]}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Multiplayer status footer */}
          <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 text-[10px] text-[var(--sb-ink-dim)] flex justify-between">
            <span>Multiplayer Workspace Mode</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Elena, Marcus, and 5 others active
            </span>
          </div>

        </div>

        {/* Right Sidebar: Active Discussion / Review Threads */}
        <div className="h-full">
          <SpotlightEffect glowColor="rgba(236,72,153,0.1)" glowSize={350}>
            <GlassCard className="p-6 h-[480px] flex flex-col justify-between border-[var(--sb-border)]/60 dark:border-white/[0.08]">
              <div className="space-y-6 overflow-y-auto max-h-[380px] pr-1">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--sb-ink)]">Discussions</h3>
                    <p className="text-[10px] text-[var(--sb-ink-dim)] font-mono">Linked to Section 3: Empirical Formulas</p>
                  </div>
                </div>

                {/* Comment thread */}
                <div className="space-y-4">
                  {comments.map((c, idx) => (
                    <div key={idx} className="p-3 bg-[var(--sb-pill)]/50 rounded-lg border border-[var(--sb-border)]/40 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-[var(--sb-ink)]">{c.author}</span>
                        <span className="text-[var(--sb-ink-dim)]">{c.time}</span>
                      </div>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Reply to thread..."
                  disabled
                  className="flex-1 bg-[var(--sb-pill)] border border-[var(--sb-border)]/60 rounded-lg px-3 py-2 text-xs text-[var(--sb-ink)] placeholder-[var(--sb-ink-dim)] focus:outline-none cursor-not-allowed"
                />
                <button className="p-2 bg-indigo-600 text-white rounded-lg cursor-not-allowed opacity-50 shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          </SpotlightEffect>
        </div>

      </div>
    </section>
  );
}
