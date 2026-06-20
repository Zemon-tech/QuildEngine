import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";
import { NavItem } from "./nav-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";

interface SubItem {
  icon: LucideIcon;
  label: string;
  to: string;
  badge?: string | number;
}

interface NavAccordionProps {
  icon: LucideIcon;
  label: string;
  items: SubItem[];
  collapsed?: boolean;
  defaultOpen?: boolean;
  activeLayoutId?: string;
}

export function NavAccordion({
  icon: Icon,
  label,
  items,
  collapsed = false,
  defaultOpen = false,
  activeLayoutId = "nav-pill",
}: NavAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-sm font-medium outline-none",
        "transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
        collapsed && "justify-center px-2",
      )}
      style={{ color: "var(--sb-ink-muted)" }}
    >
      {/* Hover bg */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-150",
          "group-hover:opacity-100",
          open && "opacity-100",
        )}
        style={{ background: "var(--sb-bg-hover)" }}
      />

      {/* Icon */}
      <span className="relative z-10 shrink-0">
        <Icon
          size={16}
          style={{
            color: open ? "var(--sb-ink)" : "var(--sb-ink-muted)",
            transition: "color 150ms ease",
          }}
          className="group-hover:!text-[var(--sb-ink)]"
        />
      </span>

      {!collapsed && (
        <>
          <span
            className="relative z-10 flex-1 truncate text-left"
            style={{
              color: open ? "var(--sb-ink)" : "var(--sb-ink-muted)",
              transition: "color 150ms ease",
            }}
          >
            {label}
          </span>
          <motion.span
            className="relative z-10"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <ChevronRight size={14} style={{ color: "var(--sb-ink-dim)" }} />
          </motion.span>
        </>
      )}
    </button>
  );

  return (
    <div className="flex flex-col">
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span className="text-xs font-medium">{label}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}

      {!collapsed && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sub"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-0.5 pb-1 pl-3 pt-0.5">
                {/* Connector line */}
                <div
                  className="absolute ml-[11px] mt-0.5 w-px"
                  style={{
                    background: "var(--sb-border)",
                    height: `${items.length * 34}px`,
                  }}
                />
                {items.map((item) => (
                  <NavItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    badge={item.badge}
                    activeLayoutId={activeLayoutId}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
