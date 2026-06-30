import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "#/lib/utils";

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "cyan";
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  ...props
}: GlowButtonProps) {
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]";
      case "cyan":
        return "bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)]";
      case "secondary":
      default:
        return "bg-[var(--card-bg)] border border-[var(--sb-border)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] shadow-sm";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer overflow-hidden group",
        getVariantStyles(),
        className,
      )}
      {...props}
    >
      {/* Animated gradient light trail overlay for primary & cyan */}
      {variant !== "secondary" && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
