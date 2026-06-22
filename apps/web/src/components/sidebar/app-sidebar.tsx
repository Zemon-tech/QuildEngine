import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  FlaskConical,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Menu,
} from "lucide-react";
import { cn } from "#/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "#/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "#/components/ui/dropdown-menu";
import { UserNav } from "./user-nav";
import { AIAssistant } from "./ai-assistant";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar-header";
import { GlobalSearchTrigger } from "#/components/search/global-search";

export function AppSidebar() {
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const [aiOpen, setAiOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Learn", to: "/learn", icon: BookOpen },
    { label: "Practice", to: "/practice", icon: Code2 },
    { label: "Research", to: "/research", icon: FlaskConical },
  ];

  return (
    <>
      {/* Mobile hamburger (only visible on small screens) */}
      <button
        type="button"
        onClick={() => setOpenMobile(true)}
        aria-label="Open navigation"
        className={cn(
          "fixed left-4 top-4 z-40 flex size-9 items-center justify-center rounded-[10px] md:hidden",
          "transition-opacity duration-150 hover:opacity-70 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
        )}
        style={{
          background: "var(--sb-bg)",
          border: "1px solid var(--sb-border)",
          color: "var(--sb-ink-muted)",
        }}
      >
        <Menu size={16} />
      </button>

      {/* Main Sidebar */}
      <Sidebar collapsible="icon" className="border-r border-[var(--sb-border)]">
        <SidebarHeader className="p-0">
          <CustomSidebarHeader collapsed={state === "collapsed"} onToggle={toggleSidebar} />
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <div className="mb-2">
            <GlobalSearchTrigger />
          </div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.to)}
                  tooltip={item.label}
                  className="rounded-[10px] px-2.5 py-[7px]"
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 w-full text-sm font-medium transition-colors",
                      isActive(item.to) ? "text-[var(--sb-accent)] font-semibold" : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 gap-2 border-t border-[var(--sb-border)]">
          {/* AI Assistant and Theme Toggle Icon buttons on top of User profile avatar */}
          <div className={cn("flex gap-2 items-center justify-center", state === "collapsed" ? "flex-col" : "flex-row px-1")}>
            {/* AI Assistant button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setAiOpen(!aiOpen)}
                  className={cn(
                    "relative flex items-center justify-center rounded-[10px] size-9 outline-none transition-all duration-150 cursor-pointer active:scale-95",
                    "hover:bg-[var(--sb-bg-hover)]",
                    aiOpen ? "bg-[var(--sb-pill)] text-[var(--sb-accent)]" : "text-[var(--sb-ink-muted)]"
                  )}
                >
                  <Sparkles size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <span>AI Assistant</span>
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <DropdownMenu>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative flex items-center justify-center rounded-[10px] size-9 outline-none transition-all duration-150 cursor-pointer active:scale-95",
                        "hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)]"
                      )}
                    >
                      {theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <Monitor size={16} />}
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <span>Theme: {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : "System"}</span>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-36"
                style={{
                  background: "var(--sb-bg)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              >
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2 text-xs">
                  <Sun size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2 text-xs">
                  <Moon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2 text-xs">
                  <Monitor size={14} /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Nav Avatar */}
          <div className="pt-1">
            <UserNav collapsed={state === "collapsed"} />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* AI Assistant floating panel */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
