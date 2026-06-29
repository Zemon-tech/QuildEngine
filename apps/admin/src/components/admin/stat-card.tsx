import type { LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  deltaDirection?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  delta,
  deltaDirection = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "island-shell rounded-xl p-5 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold tracking-wider"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          {title}
        </span>
        <span
          className="flex size-8 items-center justify-center rounded-[8px]"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
            color: "var(--sb-ink-muted)",
          }}
        >
          <Icon size={15} />
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{
            color: "var(--sb-ink)",
          }}
        >
          {value}
        </span>

        {delta && (
          <span
            className="mb-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md"
            style={{
              background:
                deltaDirection === "up"
                  ? "oklch(0.72 0.16 142 / 0.12)"
                  : deltaDirection === "down"
                    ? "oklch(0.58 0.24 27 / 0.12)"
                    : "var(--sb-pill)",
              color:
                deltaDirection === "up"
                  ? "oklch(0.58 0.16 142)"
                  : deltaDirection === "down"
                    ? "oklch(0.58 0.24 27)"
                    : "var(--sb-ink-muted)",
            }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
