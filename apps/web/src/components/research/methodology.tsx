import { motion } from "framer-motion";
import {
  BookOpenCheck,
  Brain,
  ChevronRight,
  FileUp,
  LineChart,
  Network,
} from "lucide-react";
import { useState } from "react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface WorkflowStep {
  step: number;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  icon: React.ReactNode;
  color: string;
}

export function WorkflowTimeline() {
  const steps: WorkflowStep[] = [
    {
      step: 1,
      title: "Collect Sources",
      shortDesc: "Upload docs & connect feeds.",
      detailedDesc:
        "Upload PDFs, sync Youtube videos, input URLs, or connect data repositories. The AI parser processes raw material, preparing clean embeddings.",
      icon: <FileUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      color: "rgba(99, 102, 241, 1)",
    },
    {
      step: 2,
      title: "Analyze Content",
      shortDesc: "Semantic mapping.",
      detailedDesc:
        "The parsing engine runs localized LLMs to analyze text, identify vocabulary definitions, structure mathematical formulas, and highlight arguments.",
      icon: <LineChart className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      color: "rgba(6, 182, 212, 1)",
    },
    {
      step: 3,
      title: "Generate Insights",
      shortDesc: "Automatic summaries.",
      detailedDesc:
        "Our AI notes module synthesizes cross-referenced summaries, highlights citations, checks contradictions between papers, and maps key findings.",
      icon: <Brain className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
      color: "rgba(168, 85, 247, 1)",
    },
    {
      step: 4,
      title: "Connect Knowledge",
      shortDesc: "Visual graph links.",
      detailedDesc:
        "Concepts are automatically structured into an interactive knowledge map, revealing latent relations and correlation bridges across works.",
      icon: <Network className="w-5 h-5 text-pink-500 dark:text-pink-400" />,
      color: "rgba(236, 72, 153, 1)",
    },
    {
      step: 5,
      title: "Publish Findings",
      shortDesc: "Generate reports.",
      detailedDesc:
        "Compile verified insights, generated citations, and structured notes directly into formats ready for papers, articles, or team distribution.",
      icon: (
        <BookOpenCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
      ),
      color: "rgba(16, 185, 129, 1)",
    },
  ];

  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          Research Methodology
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Our structured pipeline translates raw, disconnected datasets into a
          cohesive, structured map of discoveries.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="flex flex-col gap-10">
        {/* Step Nodes Row */}
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 max-w-5xl mx-auto w-full px-4">
          {/* Background Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--sb-border)]/60 -translate-y-1/2 -z-10 hidden md:block" />

          {/* Active Progress Bar (Desktop) */}
          <motion.div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 -translate-y-1/2 -z-10 hidden md:block origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (activeStep - 1) / 4 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ width: "100%" }}
          />

          {steps.map((step) => {
            const isCompleted = step.step <= activeStep;
            const isActive = step.step === activeStep;

            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className="flex md:flex-col items-center gap-4 md:gap-3 cursor-pointer group"
              >
                {/* Node bubble */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    borderColor: isActive
                      ? step.color
                      : isCompleted
                        ? "rgba(128,128,128,0.4)"
                        : "var(--sb-border)",
                  }}
                  className={`w-12 h-12 rounded-full border-2 bg-[var(--card-bg)] flex items-center justify-center relative transition-all duration-300 ${
                    isActive
                      ? "shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 25px ${step.color}30` : "",
                  }}
                >
                  {/* Step Number Badge */}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--sb-pill)] border border-[var(--sb-border)]/60 text-[9px] font-bold text-[var(--sb-ink-muted)] flex items-center justify-center font-mono">
                    {step.step}
                  </span>

                  {step.icon}
                </motion.div>

                {/* Text summary below bubble */}
                <div className="text-left md:text-center">
                  <p
                    className={`text-xs font-bold transition-colors duration-200 ${isActive ? "text-[var(--sb-ink)]" : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-[var(--sb-ink-dim)] hidden md:block mt-0.5 max-w-[140px] truncate">
                    {step.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Explanation Panel */}
        <div className="max-w-3xl mx-auto w-full mt-4">
          <SpotlightEffect
            glowColor={steps[activeStep - 1].color.replace("1)", "0.06)")}
            glowSize={350}
          >
            <GlassCard className="p-6 md:p-8 border-[var(--sb-border)]/60 dark:border-white/[0.08]">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Visual Step Number */}
                <div className="w-16 h-16 rounded-xl bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 flex items-center justify-center text-2xl font-extrabold font-mono shrink-0 select-none text-[var(--sb-ink-muted)]">
                  0{activeStep}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider font-mono"
                      style={{ color: steps[activeStep - 1].color }}
                    >
                      Active Stage
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--sb-ink-dim)]" />
                    <h3 className="text-base font-bold text-[var(--sb-ink)]">
                      {steps[activeStep - 1].title}
                    </h3>
                  </div>

                  <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed">
                    {steps[activeStep - 1].detailedDesc}
                  </p>
                </div>
              </div>
            </GlassCard>
          </SpotlightEffect>
        </div>
      </div>
    </section>
  );
}
