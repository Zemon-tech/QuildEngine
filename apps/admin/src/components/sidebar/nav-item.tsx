import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  search?: any;
  badge?: string | number;
  collapsed?: boolean;
  activeLayoutId?: string;
  isActive?: boolean;
  onClick?: () => void;
  indent?: boolean;
}

export function NavItem({
  icon: Icon,
  label,
  to,
  search,
  badge,
  collapsed = false,
  activeLayoutId = "nav-pill",
  isActive,
  onClick,
  indent = false,
}: NavItemProps) {
  const content = (
    <Link
      to={to}
      search={search}
      onClick={onClick}
      activeProps={{ "aria-current": "page" }}
      className={cn(
        "group/nav-item relative flex items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-sm font-medium outline-none",
        "transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
        indent && "ml-3",
        collapsed ? "justify-center px-2" : "",
      )}
      style={{
        color: isActive ? "var(--sb-accent)" : "var(--sb-ink-muted)",
      }}
    >
      {/* Active pill background */}
      {isActive && (
        <motion.span
          layoutId={activeLayoutId}
          className="pointer-events-none absolute inset-0 rounded-[10px]"
          style={{ background: "var(--sb-pill)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
        />
      )}

      {/* Hover background (non-active) */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-150",
          "group-hover/nav-item:opacity-100",
        )}
        style={{ background: "var(--sb-bg-hover)" }}
      />

      {/* Icon */}
      <span className="relative z-10 flex shrink-0 items-center justify-center">
        <Icon
          size={16}
          style={{
            color: isActive ? "var(--sb-accent)" : "var(--sb-ink-muted)",
            transition: "color 150ms ease",
          }}
          className="group-hover/nav-item:!text-[var(--sb-ink)]"
        />
      </span>

      {/* Label */}
      {!collapsed && (
        <motion.span
          initial={false}
          animate={{ opacity: 1 }}
          className="relative z-10 flex-1 truncate"
          style={{
            color: isActive ? "var(--sb-accent)" : "var(--sb-ink-muted)",
          }}
        >
          {label}
        </motion.span>
      )}

      {/* Badge */}
      {!collapsed && badge !== undefined && (
        <span className="relative z-10">
          <Badge
            variant="secondary"
            className="h-4 min-w-[18px] px-1 text-[10px] leading-none"
            style={{
              background: "var(--sb-bg-active)",
              color: "var(--sb-ink-muted)",
              border: "1px solid var(--sb-border)",
            }}
          >
            {badge}
          </Badge>
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span className="text-xs font-medium">{label}</span>
          {badge !== undefined && (
            <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
              {badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
