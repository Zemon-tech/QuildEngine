import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CloudLightning,
  Code2,
  Cpu,
  Database,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";

interface CategoryItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}

export function ResearchCategoryCard() {
  const categories: CategoryItem[] = [
    {
      name: "Artificial Intelligence",
      description:
        "Neural architectures, alignment models, multi-modal cognitive pipelines.",
      icon: <Brain className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
      gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]",
    },
    {
      name: "Data Science & Stats",
      description:
        "Statistical learning theory, vector distributions, inference pipelines.",
      icon: <Database className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
      gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]",
    },
    {
      name: "Software Engineering",
      description:
        "Distributed compiles, compilation optimization, static analysis engines.",
      icon: (
        <Code2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
      ),
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    },
    {
      name: "Robotics & Mechanics",
      description:
        "Control optimization, spatial coordinates, physics simulation modeling.",
      icon: <Cpu className="w-8 h-8 text-pink-500 dark:text-pink-400" />,
      gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]",
    },
    {
      name: "Cybersecurity Systems",
      description:
        "Cryptography models, secure enclave isolation, zero-knowledge verification.",
      icon: (
        <ShieldAlert className="w-8 h-8 text-rose-500 dark:text-rose-400" />
      ),
      gradient: "from-rose-500/10 via-red-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]",
    },
    {
      name: "Cloud Computing",
      description:
        "Edge network architectures, cluster scheduling, global caching consensus.",
      icon: (
        <CloudLightning className="w-8 h-8 text-amber-500 dark:text-amber-400" />
      ),
      gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    },
    {
      name: "Bio & Healthcare",
      description:
        "Protein structures, genomic databases, diagnostic computer vision.",
      icon: <HeartPulse className="w-8 h-8 text-red-500 dark:text-red-400" />,
      gradient: "from-red-500/10 via-pink-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]",
    },
    {
      name: "Education Tech",
      description:
        "Curriculum graphs, cognitive mapping, personalized synthesis tutors.",
      icon: <BookOpen className="w-8 h-8 text-sky-500 dark:text-sky-400" />,
      gradient: "from-sky-500/10 via-indigo-500/5 to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          Research Categories
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Explore specialized libraries mapped to engineering and science
          disciplines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className={`group relative overflow-hidden rounded-xl border border-[var(--sb-border)]/60 dark:border-white/[0.06] bg-[color-mix(in_oklab,var(--card-bg)_40%,transparent)] p-6 flex flex-col justify-between h-[240px] cursor-pointer transition-all duration-300 hover:border-[var(--sb-border)] dark:hover:border-white/15 ${cat.glow}`}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-20 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="p-3 bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                {cat.icon}
              </div>
              <h3 className="text-base font-bold text-[var(--sb-ink)] group-hover:text-[var(--sb-ink)] transition-colors">
                {cat.name}
              </h3>
            </div>

            <p className="relative z-10 text-xs text-[var(--sb-ink-muted)] leading-relaxed group-hover:text-[var(--sb-ink)] transition-colors">
              {cat.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
