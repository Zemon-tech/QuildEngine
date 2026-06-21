import { useState } from "react";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "#/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex items-center border-b px-3 py-3 h-14 transition-colors duration-150",
        collapsed ? "justify-center" : "justify-between gap-2",
      )}
      style={{ borderColor: "var(--sb-border)" }}
    >
      {collapsed ? (
        <div className="flex items-center justify-center size-7 relative select-none">
          {hovered ? (
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "flex items-center justify-center rounded-[8px] outline-none transition-all duration-150 size-7 cursor-pointer text-[var(--sb-ink-dim)] hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60 active:scale-95",
              )}
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen size={15} />
            </button>
          ) : (
            <span
              className="flex shrink-0 items-center justify-center rounded-[8px]"
              style={{
                width: 28,
                height: 28,
                background: "oklch(0.92 0 0)",
              }}
            >
              <img
                src="/quild-logo.png"
                alt="Quild Logo"
                width={20}
                height={20}
                style={{ objectFit: "contain", display: "block" }}
                draggable={false}
              />
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Logo + Wordmark */}
          <div className="flex items-center gap-2.5 overflow-hidden select-none">
            {/* Logo mark */}
            <span
              className="flex shrink-0 items-center justify-center rounded-[8px]"
              style={{
                width: 28,
                height: 28,
                background: "oklch(0.92 0 0)",
              }}
            >
              <img
                src="/quild-logo.png"
                alt="Quild"
                width={20}
                height={20}
                style={{ objectFit: "contain", display: "block" }}
                draggable={false}
              />
            </span>

            {/* Wordmark */}
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
          </div>

          {/* Toggle button */}
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[8px] outline-none transition-all duration-150 size-7 cursor-pointer text-[var(--sb-ink-dim)] hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60 active:scale-95",
            )}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={15} />
          </button>
        </>
      )}
    </div>
  );
}
