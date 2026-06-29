import { motion } from "framer-motion";

export function MeshGradientBackground() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden bg-[var(--background)] pointer-events-none">
      {/* Mesh glow effects with adaptive opacity */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)]"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[30%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_65%)]"
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[20%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(168,85,247,0.14)_0%,transparent_70%)]"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Noise overlay texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 -z-40 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full stroke-[var(--sb-border)]/30 dark:stroke-zinc-900/40 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            x="50%"
          >
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Pulsing light spots along the grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120px,rgba(139,92,246,0.04),transparent_40%)] dark:bg-[radial-gradient(circle_at_50%_120px,rgba(139,92,246,0.08),transparent_40%)]" />
    </div>
  );
}
