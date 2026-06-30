import { motion } from "framer-motion";
import {
  BrainCircuit,
  FileText,
  LineChart,
  Share2,
  Sparkles,
} from "lucide-react";
import { GlowButton } from "./glow-button";
import { GlassCard, SpotlightEffect } from "./spotlight";

export function FloatingResearchCards() {
  return (
    <div className="relative w-full h-[400px] lg:h-[550px] flex items-center justify-center overflow-hidden">
      {/* Central Knowledge Node */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: 360,
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
        className="absolute z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500/20 via-cyan-500/20 to-indigo-500/20 border border-[var(--sb-border)]/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.1)]"
      >
        <BrainCircuit className="w-12 h-12 text-cyan-500 dark:text-cyan-400 animate-pulse" />
      </motion.div>

      {/* Floating Card 1: Transformer Paper */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-4 lg:left-10 z-20 w-56 cursor-pointer"
      >
        <SpotlightEffect glowColor="rgba(99,102,241,0.15)">
          <GlassCard className="p-4 border-indigo-500/30 dark:border-indigo-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--sb-ink)] truncate">
                  Attention Is All You Need
                </h4>
                <p className="text-[10px] text-[var(--sb-ink-muted)] mt-1">
                  Vaswani et al. • PDF
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                    Transformer
                  </span>
                  <span className="text-[9px] bg-[var(--sb-pill)] text-[var(--sb-ink-muted)] px-1.5 py-0.5 rounded">
                    8 Sources
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </SpotlightEffect>
      </motion.div>

      {/* Floating Card 2: AI Insights */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-4 lg:right-10 z-20 w-60 cursor-pointer"
      >
        <SpotlightEffect glowColor="rgba(236,72,153,0.15)">
          <GlassCard className="p-4 border-pink-500/30 dark:border-pink-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500 dark:text-pink-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[var(--sb-ink)]">
                  AI Synthesized Findings
                </h4>
                <p className="text-[10px] text-[var(--sb-ink-muted)] mt-1 line-clamp-2">
                  Cross-reference confirms a 42% latency improvement using
                  sparse embeddings.
                </p>
                <div className="mt-3 h-1.5 w-full bg-[var(--sb-pill)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-pink-500"
                    animate={{ width: ["30%", "85%", "30%"] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </SpotlightEffect>
      </motion.div>

      {/* Floating Card 3: Saved Notes */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-6 lg:left-20 z-20 w-52 cursor-pointer"
      >
        <SpotlightEffect glowColor="rgba(6,182,212,0.15)">
          <GlassCard className="p-4 border-cyan-500/30 dark:border-cyan-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500 dark:text-cyan-400">
                <LineChart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--sb-ink)]">
                  Quantum Computing
                </h4>
                <p className="text-[10px] text-[var(--sb-ink-muted)] mt-1">
                  Workspace Notes
                </p>
                <p className="text-[9px] text-[var(--sb-ink-dim)] mt-2 italic">
                  Updated 2m ago
                </p>
              </div>
            </div>
          </GlassCard>
        </SpotlightEffect>
      </motion.div>

      {/* Floating Card 4: Connection Link */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 lg:right-24 z-20 w-48 cursor-pointer"
      >
        <SpotlightEffect glowColor="rgba(168,85,247,0.15)">
          <GlassCard className="p-3 border-purple-500/30 dark:border-purple-500/20">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-medium text-[var(--sb-ink)] truncate">
                Connected Graph
              </span>
            </div>
            <div className="mt-2 text-[10px] text-[var(--sb-ink-muted)] flex justify-between">
              <span>12 Nodes</span>
              <span className="text-purple-500 dark:text-purple-400 font-medium">
                Synced
              </span>
            </div>
          </GlassCard>
        </SpotlightEffect>
      </motion.div>

      {/* Futuristic Orbit Rings & SVG Connectors */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orbital circles */}
        <circle
          cx="50%"
          cy="50%"
          r="140"
          fill="none"
          stroke="var(--sb-border)"
          strokeWidth="1"
          className="opacity-20 dark:opacity-5"
        />
        <circle
          cx="50%"
          cy="50%"
          r="220"
          fill="none"
          stroke="var(--sb-border)"
          strokeWidth="1"
          strokeDasharray="5 5"
          className="opacity-15 dark:opacity-5"
        />

        {/* Animated connection lines */}
        <motion.path
          d="M 120 100 Q 300 200 450 250"
          fill="none"
          stroke="url(#line-glow)"
          strokeWidth="1.5"
          className="opacity-50 dark:opacity-40"
        />
        <motion.path
          d="M 600 120 Q 400 300 250 480"
          fill="none"
          stroke="url(#line-glow-purple)"
          strokeWidth="1.5"
          className="opacity-50 dark:opacity-40"
        />

        <defs>
          <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="line-glow-purple"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface HeroResearchSectionProps {
  onStartResearch: () => void;
  onExploreResearch: () => void;
}

export function HeroResearchSection({
  onStartResearch,
  onExploreResearch,
}: HeroResearchSectionProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-24 flex flex-col lg:flex-row items-center gap-12 select-none">
      <div className="flex-1 text-left flex flex-col items-start z-10">
        {/* Sparkle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--sb-border)] text-xs text-[var(--sb-ink-muted)] backdrop-blur-md mb-6 hover:border-[var(--sb-border)]/80"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
          <span>Advanced AI Research Platform</span>
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--sb-ink)] mb-6 leading-tight max-w-xl display-title"
        >
          Research Smarter. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Discover Faster.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[var(--sb-ink-muted)] mb-8 max-w-lg leading-relaxed font-sans"
        >
          Transform documents, articles, notes, videos, and datasets into
          connected knowledge using AI-powered research workflows.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <GlowButton variant="primary" onClick={onStartResearch}>
            Start Researching
          </GlowButton>
          <GlowButton variant="secondary" onClick={onExploreResearch}>
            Explore Research
          </GlowButton>
        </motion.div>
      </div>

      {/* Right Side: Futuristic Workspace Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 w-full relative"
      >
        <FloatingResearchCards />
      </motion.div>
    </section>
  );
}
