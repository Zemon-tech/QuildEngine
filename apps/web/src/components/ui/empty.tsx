import type * as React from "react";
import { cn } from "#/lib/utils.ts";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-card/50",
        className,
      )}
      {...props}
    />
  );
}

function EmptyIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3",
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-title"
      className={cn("text-sm font-semibold text-foreground mb-1", className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-xs text-muted-foreground max-w-xs", className)}
      {...props}
    />
  );
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-actions"
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 mt-3",
        className,
      )}
      {...props}
    />
  );
}

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions };
