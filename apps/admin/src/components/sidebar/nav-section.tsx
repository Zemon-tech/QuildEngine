import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Separator } from "#/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

interface NavSectionProps {
  /** Section identifier — used to persist open state in sessionStorage */
  id: string;
  /** Section icon (shown in collapsed mode as the toggle trigger) */
  icon: LucideIcon;
  /** Section label */
  label: string;
  /** Child nav items */
  children: React.ReactNode;
  /** Is the sidebar in icon-only collapsed mode? */
  collapsed?: boolean;
  /** Whether any child of this section is currently active — auto-opens when true */
  hasActiveChild?: boolean;
  /** Render a hairline separator above this section */
  showSeparatorAbove?: boolean;
  /** Badge count shown on section parent row (e.g. "3 new events") */
  badge?: string | number;
}

const STORAGE_KEY = "quild-sidebar-open-sections";

function getPersistedSections(): Record<string, boolean> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistSection(id: string, open: boolean) {
  try {
    const current = getPersistedSections();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, [id]: open }),
    );
  } catch {
    // ignore
  }
}

export function NavSection({
  id,
  icon: Icon,
  label,
  children,
  collapsed = false,
  hasActiveChild = false,
  showSeparatorAbove = false,
  badge,
}: NavSectionProps) {
  // Initialise open state: active child always forces open; otherwise use
  // persisted state; default to closed.
  const [open, setOpen] = useState<boolean>(() => {
    if (hasActiveChild) return true;
    const persisted = getPersistedSections();
    return persisted[id] ?? false;
  });

  // Auto-open when navigating INTO this section (false → true transition only).
  // We do NOT re-open when the user explicitly collapses an already-active section.
  const prevHasActiveChild = useRef(hasActiveChild);
  useEffect(() => {
    const wasActive = prevHasActiveChild.current;
    prevHasActiveChild.current = hasActiveChild;
    // Only force open when the section becomes newly active
    if (hasActiveChild && !wasActive) {
      setOpen(true);
      persistSection(id, true);
    }
  }, [hasActiveChild, id]);

  function toggle() {
    const next = !open;
    setOpen(next);
    persistSection(id, next);
  }

  // ── Collapsed mode: icon button with tooltip, no accordion ─────────────
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-0.5 py-0.5">
        {showSeparatorAbove && (
          <div className="w-8 py-1">
            <Separator
              style={{ background: "var(--sb-border)", opacity: 0.5 }}
            />
          </div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={label}
              className={cn(
                "group/nav-section relative flex size-9 items-center justify-center rounded-[10px] outline-none",
                "transition-colors duration-150",
                "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/60",
                hasActiveChild && "text-(--sb-accent)",
                !hasActiveChild && "text-(--sb-ink-muted)",
              )}
            >
              {/* Hover bg */}
              <span
                className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-150 group-hover/nav-section:opacity-100"
                style={{ background: "var(--sb-bg-hover)" }}
              />
              {/* Active indicator dot */}
              {hasActiveChild && (
                <span
                  className="absolute right-1.5 top-1.5 size-1.5 rounded-full"
                  style={{ background: "var(--sb-accent)" }}
                />
              )}
              <Icon size={16} className="relative z-10" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span className="text-xs font-medium">{label}</span>
            {badge !== undefined && (
              <span
                className="ml-1.5 inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-semibold"
                style={{
                  background: "var(--sb-accent)",
                  color: "var(--sb-accent-foreground)",
                }}
              >
                {badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  // ── Expanded mode: full accordion parent row ────────────────────────────
  return (
    <div className="flex flex-col">
      {showSeparatorAbove && (
        <div className="px-3 py-1">
          <Separator
            style={{ background: "var(--sb-border)", opacity: 0.45 }}
          />
        </div>
      )}

      {/* Section toggle trigger */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          "group/nav-section relative flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-sm font-medium outline-none",
          "transition-colors duration-150",
          "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/60",
        )}
        style={{
          color: hasActiveChild ? "var(--sb-ink)" : "var(--sb-ink-muted)",
        }}
      >
        {/* Active pill bg */}
        {hasActiveChild && (
          <motion.span
            layoutId={`section-pill-${id}`}
            className="pointer-events-none absolute inset-0 rounded-[10px]"
            style={{ background: "var(--sb-pill)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
          />
        )}

        {/* Hover bg */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-150",
            "group-hover/nav-section:opacity-100",
          )}
          style={{ background: "var(--sb-bg-hover)" }}
        />

        {/* Icon */}
        <span className="relative z-10 flex shrink-0 items-center justify-center">
          <Icon
            size={16}
            style={{
              color: hasActiveChild
                ? "var(--sb-accent)"
                : "var(--sb-ink-muted)",
              transition: "color 150ms ease",
            }}
            className="group-hover/nav-section:!text-(--sb-ink)"
          />
        </span>

        {/* Label */}
        <span
          className="relative z-10 flex-1 truncate text-left text-sm font-medium"
          style={{
            color: hasActiveChild ? "var(--sb-ink)" : "var(--sb-ink-muted)",
          }}
        >
          {label}
        </span>

        {/* Badge */}
        {badge !== undefined && (
          <span
            className="relative z-10 inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-semibold"
            style={{
              background: hasActiveChild
                ? "var(--sb-accent)"
                : "var(--sb-bg-active)",
              color: hasActiveChild
                ? "var(--sb-accent-foreground)"
                : "var(--sb-ink-muted)",
              border: "1px solid var(--sb-border)",
            }}
          >
            {badge}
          </span>
        )}

        {/* Chevron */}
        <motion.span
          className="relative z-10 shrink-0"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <ChevronRight
            size={14}
            style={{
              color: hasActiveChild
                ? "var(--sb-ink-muted)"
                : "var(--sb-ink-dim)",
            }}
          />
        </motion.span>
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pb-1 pl-2 pr-2 pt-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
