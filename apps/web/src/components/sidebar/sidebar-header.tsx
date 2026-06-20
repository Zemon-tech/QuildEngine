import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "#/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center border-b px-3 py-3",
        collapsed ? "justify-center" : "justify-between gap-2",
      )}
      style={{ borderColor: "var(--sb-border)" }}
    >
      {/* Logo + Wordmark */}
      <div
        className={cn(
          "flex items-center gap-2.5 overflow-hidden",
          collapsed && "justify-center",
        )}
      >
        {/* Logo mark */}
        <span
          className="flex shrink-0 items-center justify-center rounded-[8px] text-sm font-bold"
          style={{
            width: 28,
            height: 28,
            background: "var(--sb-accent)",
            color: "oklch(0.12 0.01 220)",
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Q
        </span>

        {/* Wordmark */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col leading-none">
              <span
                className="text-sm font-semibold tracking-[-0.02em]"
                style={{
                  color: "var(--sb-ink)",
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                Quild
              </span>
              <span
                className="mt-0.5 text-[10px] font-medium"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                AI Learning
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[8px] outline-none",
          "transition-all duration-150",
          "hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
          collapsed && "mt-0",
        )}
        style={{
          width: 28,
          height: 28,
          color: "var(--sb-ink-dim)",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen size={15} />
        ) : (
          <PanelLeftClose size={15} />
        )}
      </button>
    </div>
  );
}
