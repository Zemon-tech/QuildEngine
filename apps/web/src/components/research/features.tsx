import { motion } from "framer-motion";
import {
  FileSearch,
  BookOpen,
  Cpu,
  Layers,
  GitCompare,
  TrendingUp,
  Fingerprint,
  Search,
} from "lucide-react";
import { SpotlightEffect, GlassCard } from "./spotlight";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

export function FeatureCard() {
  const features: FeatureItem[] = [
    {
      title: "Source Analysis",
      description: "Extract semantics, core claims, and methodologies from PDFs, articles, and documentation feeds.",
      icon: <FileSearch className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
      glowColor: "rgba(99,102,241,0.1)",
    },
    {
      title: "Smart Citations",
      description: "Generate instant, verified context-linked citations across thousands of documents simultaneously.",
      icon: <BookOpen className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
      glowColor: "rgba(6,182,212,0.1)",
    },
    {
      title: "AI Summaries",
      description: "Review synthesis sheets detailing study gaps, contradictions, and primary findings within seconds.",
      icon: <Cpu className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      glowColor: "rgba(168,85,247,0.1)",
    },
    {
      title: "Knowledge Extraction",
      description: "Convert dense charts, raw spreadsheets, and nested JSON schemas into structured human-readable nodes.",
      icon: <Layers className="w-8 h-8 text-pink-500 dark:text-pink-400" />,
      glowColor: "rgba(236,72,153,0.1)",
    },
    {
      title: "Document Comparison",
      description: "Align multiple clinical trials or engineering papers to automatically point out contradicting data.",
      icon: <GitCompare className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
      glowColor: "rgba(16,185,129,0.1)",
    },
    {
      title: "Research Automation",
      description: "Deploy autonomous bots to monitor arXiv repositories and aggregate new findings into your workspace.",
      icon: <TrendingUp className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
      glowColor: "rgba(245,158,11,0.1)",
    },
    {
      title: "Context Discovery",
      description: "Unveil non-obvious correlations between unrelated papers based on matching mathematical models.",
      icon: <Fingerprint className="w-8 h-8 text-rose-500 dark:text-rose-400" />,
      glowColor: "rgba(244,63,94,0.1)",
    },
    {
      title: "Semantic Search",
      description: "Query your library with conversational queries rather than rigid keyword configurations.",
      icon: <Search className="w-8 h-8 text-sky-500 dark:text-sky-400" />,
      glowColor: "rgba(14,165,233,0.1)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          Built For Advanced AI Discovery
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Powering research workflows with tools engineered for cognitive enhancement and knowledge connectivity.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <SpotlightEffect glowColor={feature.glowColor} glowSize={280}>
              <GlassCard className="p-6 h-[220px] flex flex-col justify-between border-[var(--sb-border)]/40 dark:border-white/[0.06] hover:border-[var(--sb-border)]/80 dark:hover:border-white/[0.12] transition-colors relative group">
                <div>
                  {/* Icon */}
                  <div className="p-3 bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[var(--sb-ink)] mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            </SpotlightEffect>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
