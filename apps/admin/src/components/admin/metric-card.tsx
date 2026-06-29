import type { LucideIcon } from "lucide-react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "#/lib/utils";

interface MetricCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  changePercent?: number;
  direction?: "up" | "down" | "neutral";
  comparisonText?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  changePercent,
  direction = "neutral",
  comparisonText,
  description,
  isLoading = false,
  isError = false,
  isEmpty = false,
  onRetry,
  className,
}: MetricCardProps) {
  // 1. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div
        className={cn(
          "island-shell rounded-xl p-5 flex flex-col gap-3.5 select-none animate-pulse",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-muted rounded" />
          <div className="size-8 rounded-lg bg-muted" />
        </div>
        <div className="flex items-end justify-between">
          <div className="h-8 w-28 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div className="h-3 w-40 bg-muted rounded mt-1" />
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div
        className={cn(
          "island-shell rounded-xl p-5 flex flex-col justify-between border-destructive/30 min-h-[125px]",
          className,
        )}
      >
        <div className="flex items-center justify-between text-destructive">
          <span className="text-xs font-semibold tracking-wider">
            {title}
          </span>
          <AlertCircle size={15} />
        </div>
        <div className="text-xs text-muted-foreground my-2">
          Failed to load stats.
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="flex items-center gap-1.5 self-start text-[11px] font-semibold text-(--sb-ink) hover:opacity-80 transition-opacity active:scale-[0.97]"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 5%, transparent)",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--sb-border)",
            }}
          >
            <RefreshCw size={10} className="animate-spin-slow" />
            Retry
          </button>
        ) : (
          <div className="text-[10px] text-destructive/80 font-medium">
            API unreachable
          </div>
        )}
      </div>
    );
  }

  // 3. Empty State
  const hasValue = value !== undefined && value !== null && value !== "";
  const displayValue = isEmpty || !hasValue ? "—" : value;

  return (
    <div
      className={cn(
        "island-shell rounded-xl p-5 flex flex-col gap-3 group transition-all duration-200 active:scale-[0.98] cursor-pointer hover:shadow-md",
        className,
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-bold tracking-wider"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          {title}
        </span>
        <span
          className="flex size-8 items-center justify-center rounded-[8px] transition-colors group-hover:bg-(--sb-bg-hover)"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
            color: "var(--sb-ink-muted)",
          }}
        >
          <Icon size={14} />
        </span>
      </div>

      {/* Card Value and Change Indicator */}
      <div className="flex items-end justify-between gap-2">
        <span
          className="text-2xl font-bold tracking-tight display-title"
          style={{
            color: "var(--sb-ink)",
          }}
        >
          {displayValue}
        </span>

        {hasValue && !isEmpty && changePercent !== undefined && (
          <span
            className="mb-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 select-none"
            style={{
              background:
                direction === "up"
                  ? "oklch(0.72 0.16 142 / 0.12)"
                  : direction === "down"
                    ? "oklch(0.58 0.24 27 / 0.12)"
                    : "var(--sb-pill)",
              color:
                direction === "up"
                  ? "oklch(0.58 0.16 142)"
                  : direction === "down"
                    ? "oklch(0.58 0.24 27)"
                    : "var(--sb-ink-muted)",
            }}
          >
            {direction === "up" ? "↑" : direction === "down" ? "↓" : "•"}{" "}
            {Math.abs(changePercent)}%
          </span>
        )}
      </div>

      {/* Comparison Text / Description */}
      {(comparisonText || description) && (
        <div className="flex flex-col gap-0.5 mt-1 border-t border-(--sb-border) pt-2">
          {comparisonText && (
            <span
              className="text-[10px] font-semibold"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              {comparisonText}
            </span>
          )}
          {description && (
            <span
              className="text-[10px] font-medium leading-relaxed truncate"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
