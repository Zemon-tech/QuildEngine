import type { LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      <span
        className="flex size-14 items-center justify-center rounded-2xl"
        style={{
          background: "color-mix(in oklab, var(--sb-ink) 5%, transparent)",
          color: "var(--sb-ink-dim)",
        }}
      >
        <Icon size={24} strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--sb-ink)" }}
        >
          {title}
        </span>
        <span
          className="text-xs leading-relaxed"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {description}
        </span>
      </div>
      {action && (
        <Button
          size="sm"
          variant="outline"
          onClick={action.onClick}
          className="mt-1"
        >
          {action.icon && <action.icon size={14} />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
