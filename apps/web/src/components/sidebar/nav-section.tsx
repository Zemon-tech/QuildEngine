import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";
import { Separator } from "#/components/ui/separator";

interface NavSectionProps {
  label: string;
  children: React.ReactNode;
  collapsed?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
  showSeparatorAbove?: boolean;
}

export function NavSection({
  label,
  children,
  collapsed = false,
  defaultOpen = true,
  collapsible = false,
  showSeparatorAbove = false,
}: NavSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-0.5">
      {showSeparatorAbove && (
        <div className="px-2 py-1.5">
          <Separator
            style={{ background: "var(--sb-border)", opacity: 0.6 }}
          />
        </div>
      )}

      {/* Section label (hidden when collapsed) */}
      {!collapsed && (
        <button
          type="button"
          onClick={() => collapsible && setOpen((o) => !o)}
          className={cn(
            "flex items-center gap-1.5 px-3 pb-0.5 pt-3",
            collapsible &&
              "cursor-pointer rounded-md transition-colors duration-150 hover:opacity-70",
            !collapsible && "cursor-default",
          )}
          disabled={!collapsible}
        >
          <span
            className="flex-1 text-left text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--sb-ink-dim)", letterSpacing: "0.09em" }}
          >
            {label}
          </span>
          {collapsible && (
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <ChevronRight
                size={12}
                style={{ color: "var(--sb-ink-dim)" }}
              />
            </motion.span>
          )}
        </button>
      )}

      {/* Items */}
      <AnimatePresence initial={false}>
        {(!collapsible || open) && (
          <motion.div
            key="content"
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className={cn("flex flex-col gap-0.5 px-2", collapsed && "px-1.5")}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
