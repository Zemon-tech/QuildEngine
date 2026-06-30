import { AlertTriangle, Brain, Lightbulb, TrendingUp } from "lucide-react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface InsightItem {
  title: string;
  badge: string;
  icon: React.ReactNode;
  text: string;
  borderColor: string;
  glowClass: string;
}

export function InsightCard() {
  const insights: InsightItem[] = [
    {
      title: "Consensus Findings",
      badge: "Key Finding",
      icon: <Brain className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      text: "Multi-layered cross-attention improves multi-modal model alignment on tabular datasets by 18.4% compared to standard architectures.",
      borderColor: "border-indigo-500/30",
      glowClass: "rgba(99, 102, 241, 0.1)",
    },
    {
      title: "Model Drift Anomalies",
      badge: "Contradiction",
      icon: (
        <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
      ),
      text: "Recent evaluations indicate validation accuracy drops by 8% when scaling context sizes beyond 128k tokens, contradicting scaling laws.",
      borderColor: "border-rose-500/30",
      glowClass: "rgba(244, 63, 94, 0.1)",
    },
    {
      title: "Retrieval Augmentation",
      badge: "Opportunity",
      icon: (
        <Lightbulb className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
      ),
      text: "Implementing local sparse embeddings reduces vector lookup times to less than 12ms, paving the way for low-latency query loops.",
      borderColor: "border-emerald-500/30",
      glowClass: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Compute Budget Optimization",
      badge: "Trend Analysis",
      icon: <TrendingUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      text: "Hardware pipelines increasingly transition toward mixed-precision calculations, saving up to 34% energy footprints at matching convergence rates.",
      borderColor: "border-cyan-500/30",
      glowClass: "rgba(6, 182, 212, 0.1)",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Background radial accent to give depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.03)_0%,transparent_70%)] pointer-events-none -z-10" />

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          AI Insights Preview
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Real-time automated reports highlighting structural connections,
          anomalies, and study gaps across your archives.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {insights.map((ins, idx) => (
          <SpotlightEffect key={idx} glowColor={ins.glowClass} glowSize={350}>
            {/* Animated card borders container */}
            <div className="relative group rounded-xl p-[1px] overflow-hidden bg-[var(--sb-border)]/60 dark:bg-zinc-800/40">
              {/* Animating gradient border layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-cyan-500/20 opacity-40 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-300 pointer-events-none" />

              <GlassCard className="p-6 md:p-8 rounded-[11px] border-none bg-[var(--card-bg)] h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  {/* Badge & Icon row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      {ins.badge}
                    </span>
                    <div className="p-2 bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-lg">
                      {ins.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[var(--sb-ink)] group-hover:text-[var(--sb-ink)] transition-colors">
                    {ins.title}
                  </h3>

                  {/* Body Text */}
                  <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed">
                    {ins.text}
                  </p>
                </div>

                {/* Sub info */}
                <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 mt-6 flex items-center justify-between text-[10px] text-[var(--sb-ink-dim)]">
                  <span>
                    Confidence Score:{" "}
                    <strong className="text-[var(--sb-ink-muted)] font-bold">
                      98.2%
                    </strong>
                  </span>
                  <span>Extracted from 4 workspace sources</span>
                </div>
              </GlassCard>
            </div>
          </SpotlightEffect>
        ))}
      </div>
    </section>
  );
}
