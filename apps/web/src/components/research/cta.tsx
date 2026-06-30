import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlowButton } from "./glow-button";

interface CTASectionProps {
  onStartResearch: () => void;
  onRequestDemo: () => void;
}

export function CTASection({
  onStartResearch,
  onRequestDemo,
}: CTASectionProps) {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-16 md:py-20 overflow-hidden rounded-2xl border border-[var(--sb-border)]/60 dark:border-white/[0.08] bg-[color-mix(in_oklab,var(--card-bg)_80%,transparent)] backdrop-blur-md text-center">
      {/* Background Gradient Mesh for the CTA card itself */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.06),rgba(6,182,212,0.03),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.12),rgba(6,182,212,0.06),transparent_60%)]"
          animate={{
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.8, 1, 0.9, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--sb-border)]/40 to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto space-y-6 relative z-10 select-none">
        {/* Sparkle icon badge */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex p-3 bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-full text-indigo-500 dark:text-indigo-400 mb-2 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--sb-ink)] tracking-tight leading-tight display-title">
          Build Your Next <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Research Breakthrough
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[var(--sb-ink-muted)] max-w-md mx-auto leading-relaxed font-sans">
          Unlock structured semantic maps, automatic citations, and
          multi-document synthesis inside our modern productivity platform.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <GlowButton variant="primary" onClick={onStartResearch}>
            Start Researching
            <ArrowRight className="w-4 h-4 ml-1" />
          </GlowButton>
          <GlowButton variant="secondary" onClick={onRequestDemo}>
            Request Demo
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
