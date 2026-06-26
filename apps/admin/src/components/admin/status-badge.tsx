import { cn } from "#/lib/utils";

type StatusVariant =
  | "published"
  | "draft"
  | "active"
  | "suspended"
  | "pending"
  | "archived"
  | "live";

const STATUS_STYLES: Record<
  StatusVariant,
  { bg: string; color: string; label: string }
> = {
  published: {
    bg: "oklch(0.72 0.16 142 / 0.12)",
    color: "oklch(0.58 0.16 142)",
    label: "Published",
  },
  draft: {
    bg: "oklch(0.75 0.08 220 / 0.12)",
    color: "oklch(0.52 0.08 220)",
    label: "Draft",
  },
  active: {
    bg: "oklch(0.72 0.16 142 / 0.12)",
    color: "oklch(0.58 0.16 142)",
    label: "Active",
  },
  suspended: {
    bg: "oklch(0.58 0.24 27 / 0.12)",
    color: "oklch(0.58 0.24 27)",
    label: "Suspended",
  },
  pending: {
    bg: "oklch(0.82 0.15 55 / 0.12)",
    color: "oklch(0.62 0.15 55)",
    label: "Pending",
  },
  archived: {
    bg: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
    color: "var(--sb-ink-dim)",
    label: "Archived",
  },
  live: {
    bg: "oklch(0.627 0.265 303.9 / 0.15)",
    color: "oklch(0.627 0.265 303.9)",
    label: "Live",
  },
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
        className,
      )}
      style={{
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.color}25`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: styles.color }}
      />
      {styles.label}
    </span>
  );
}
