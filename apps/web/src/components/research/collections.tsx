import { motion } from "framer-motion";
import {
  Banknote,
  Binary,
  Bot,
  Cpu,
  FolderLock,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface CollectionItem {
  title: string;
  papersCount: number;
  datasetsCount: number;
  activeWorkspaces: number;
  icon: React.ReactNode;
  glowColor: string;
}

export function ResearchCollectionCard() {
  const collections: CollectionItem[] = [
    {
      title: "AI Research",
      papersCount: 412,
      datasetsCount: 32,
      activeWorkspaces: 8,
      icon: <Cpu className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
      glowColor: "rgba(99,102,241,0.1)",
    },
    {
      title: "Machine Learning",
      papersCount: 289,
      datasetsCount: 24,
      activeWorkspaces: 6,
      icon: <Binary className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />,
      glowColor: "rgba(6,182,212,0.1)",
    },
    {
      title: "Healthcare & Biotech",
      papersCount: 154,
      datasetsCount: 12,
      activeWorkspaces: 3,
      icon: (
        <Stethoscope className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
      ),
      glowColor: "rgba(16,185,129,0.1)",
    },
    {
      title: "Robotics & Automation",
      papersCount: 98,
      datasetsCount: 8,
      activeWorkspaces: 2,
      icon: <Bot className="w-6 h-6 text-pink-500 dark:text-pink-400" />,
      glowColor: "rgba(236,72,153,0.1)",
    },
    {
      title: "Finance & Quantitative",
      papersCount: 124,
      datasetsCount: 15,
      activeWorkspaces: 4,
      icon: <Banknote className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      glowColor: "rgba(245,158,11,0.1)",
    },
    {
      title: "Modern Education Tech",
      papersCount: 86,
      datasetsCount: 6,
      activeWorkspaces: 2,
      icon: (
        <GraduationCap className="w-6 h-6 text-sky-500 dark:text-sky-400" />
      ),
      glowColor: "rgba(14,165,233,0.1)",
    },
    {
      title: "Cybersecurity Systems",
      papersCount: 110,
      datasetsCount: 10,
      activeWorkspaces: 3,
      icon: <FolderLock className="w-6 h-6 text-rose-500 dark:text-rose-400" />,
      glowColor: "rgba(244,63,94,0.1)",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          Research Collections
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Browse indexed literature and datasets organized by core science
          domains.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((col, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <SpotlightEffect glowColor={col.glowColor} glowSize={240}>
              <GlassCard className="p-5 flex flex-col justify-between h-[180px] border-[var(--sb-border)]/40 dark:border-white/[0.06] hover:border-[var(--sb-border)]/80 dark:hover:border-white/[0.12] cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-lg">
                    {col.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[var(--sb-ink)]">
                    {col.title}
                  </h3>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4">
                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono block">
                      Papers
                    </span>
                    <span className="text-xs font-bold text-[var(--sb-ink)]">
                      {col.papersCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono block">
                      Data
                    </span>
                    <span className="text-xs font-bold text-[var(--sb-ink)]">
                      {col.datasetsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono block">
                      Active
                    </span>
                    <span className="text-xs font-bold text-[var(--sb-ink)]">
                      {col.activeWorkspaces}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </SpotlightEffect>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
