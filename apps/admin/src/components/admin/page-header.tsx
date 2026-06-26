import type { LucideIcon } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageAction {
  label: string;
  onClick?: () => void;
  to?: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: PageAction[];
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b pb-5 mb-6",
        className,
      )}
      style={{ borderColor: "var(--sb-border)" }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  style={{ color: "var(--sb-ink-dim)" }}
                />
              )}
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="text-xs font-medium transition-colors duration-100 hover:underline"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <span
              className="flex size-9 items-center justify-center rounded-[10px] shrink-0"
              style={{
                background: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
                color: "var(--sb-ink-muted)",
              }}
            >
              <Icon size={18} />
            </span>
          )}
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {title}
            </h1>
            {description && (
              <p
                className="mt-0.5 text-sm"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {actions.map((action) => {
              if (action.to) {
                return (
                  <Button
                    key={action.label}
                    variant={action.variant ?? "default"}
                    size="sm"
                    asChild
                  >
                    <Link to={action.to}>
                      {action.icon && <action.icon size={14} />}
                      {action.label}
                    </Link>
                  </Button>
                );
              }
              return (
                <Button
                  key={action.label}
                  variant={action.variant ?? "default"}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.icon && <action.icon size={14} />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
