import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "#/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const IconComponent = (() => {
    if (!mounted) return Sun;
    if (theme === "light") return Sun;
    if (theme === "dark") return Moon;
    return Monitor;
  })();

  const labelText = (() => {
    if (!mounted) return "System";
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System";
  })();

  const trigger = (
    <button
      type="button"
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm font-medium outline-none",
        "transition-all duration-150",
        "hover:bg-[var(--sb-bg-hover)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
        collapsed && "justify-center px-2",
      )}
      style={{ color: "var(--sb-ink-muted)" }}
    >
      <div className="flex h-5 w-5 items-center justify-center relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme || "system"}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="flex items-center justify-center size-4"
          >
            <IconComponent size={15} className="shrink-0" />
          </motion.div>
        </AnimatePresence>
      </div>

      {!collapsed && (
        <span className="flex-1 truncate text-left text-[13px] font-medium" style={{ color: "var(--sb-ink)" }}>
          Theme
        </span>
      )}

      {!collapsed && (
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>
          {labelText}
        </span>
      )}
    </button>
  );

  const dropdownContent = (
    <DropdownMenuContent
      side={collapsed ? "right" : "top"}
      align={collapsed ? "start" : "end"}
      sideOffset={8}
      className="w-40"
      style={{
        background: "var(--sb-bg)",
        border: "1px solid var(--sb-border)",
        color: "var(--sb-ink)",
      }}
    >
      <DropdownMenuItem
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2 text-[13px] rounded-md transition-colors cursor-pointer justify-between",
          theme === "light"
            ? "bg-[var(--sb-bg-active)] text-[var(--sb-accent)] font-medium"
            : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] focus:bg-[var(--sb-bg-hover)] focus:text-[var(--sb-ink)]"
        )}
      >
        <div className="flex items-center gap-2">
          <Sun size={14} />
          <span>Light</span>
        </div>
        {theme === "light" && <div className="size-1.5 rounded-full bg-[var(--sb-accent)]" />}
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2 text-[13px] rounded-md transition-colors cursor-pointer justify-between",
          theme === "dark"
            ? "bg-[var(--sb-bg-active)] text-[var(--sb-accent)] font-medium"
            : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] focus:bg-[var(--sb-bg-hover)] focus:text-[var(--sb-ink)]"
        )}
      >
        <div className="flex items-center gap-2">
          <Moon size={14} />
          <span>Dark</span>
        </div>
        {theme === "dark" && <div className="size-1.5 rounded-full bg-[var(--sb-accent)]" />}
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setTheme("system")}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2 text-[13px] rounded-md transition-colors cursor-pointer justify-between",
          theme === "system"
            ? "bg-[var(--sb-bg-active)] text-[var(--sb-accent)] font-medium"
            : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] focus:bg-[var(--sb-bg-hover)] focus:text-[var(--sb-ink)]"
        )}
      >
        <div className="flex items-center gap-2">
          <Monitor size={14} />
          <span>System</span>
        </div>
        {theme === "system" && <div className="size-1.5 rounded-full bg-[var(--sb-accent)]" />}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div>{menu}</div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span className="text-xs font-medium">Theme: {labelText}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return menu;
}
