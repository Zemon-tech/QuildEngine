import { useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Calendar,
  ClipboardList,
  Code2,
  FileText,
  History,
  Image,
  LayoutDashboard,
  Mail,
  Map,
  Menu,
  Moon,
  Monitor,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Users,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";
import { NavItem } from "./nav-item";
import { NavSection } from "./nav-section";
import { AdminSidebarHeader } from "./admin-sidebar-header";
import { AdminUserNav } from "./admin-user-nav";

export function AdminAppSidebar() {
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");

  return (
    <>
      {/* Mobile hamburger */}
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

      <Sidebar collapsible="icon" className="border-r border-[var(--sb-border)]">
        <SidebarHeader className="p-0">
          <AdminSidebarHeader
            collapsed={collapsed}
            onToggle={toggleSidebar}
          />
        </SidebarHeader>

        <SidebarContent className="px-2 py-2 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          <SidebarMenu>
            {[
              { label: "Overview", to: "/overview", icon: LayoutDashboard, prefixes: ["/overview", "/analytics", "/audit"] },
              { label: "People", to: "/users", icon: Users, prefixes: ["/users", "/roles", "/invites"] },
              { label: "Learning", to: "/courses", icon: BookOpen, prefixes: ["/courses"] },
              { label: "Practice", to: "/practice/dsa", icon: Code2, prefixes: ["/practice"] },
              { label: "Content", to: "/cms/blog", icon: FileText, prefixes: ["/cms"] },
              { label: "Research", to: "/research", icon: Rocket, prefixes: ["/research", "/roadmaps"] },
              { label: "AI Center", to: "/ai", icon: BrainCircuit, prefixes: ["/ai"] },
              { label: "Settings", to: "/settings", icon: Settings, prefixes: ["/settings", "/media"] },
            ].map((item) => {
              const active = item.prefixes.some(
                (prefix) => currentPath === prefix || currentPath.startsWith(prefix + "/")
              );
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.label}
                    className="rounded-[10px] px-2.5 py-[7px]"
                  >
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      to={item.to}
                      isActive={active}
                      collapsed={collapsed}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 gap-2 border-t border-[var(--sb-border)]">
          <div
            className={cn(
              "flex gap-2 items-center justify-center",
              collapsed ? "flex-col" : "flex-row px-1",
            )}
          >
            {/* Theme Toggle */}
            <DropdownMenu>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative flex items-center justify-center rounded-[10px] size-9 outline-none transition-all duration-150 cursor-pointer active:scale-95",
                        "hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)]",
                      )}
                    >
                      {theme === "light" ? (
                        <Sun size={16} />
                      ) : theme === "dark" ? (
                        <Moon size={16} />
                      ) : (
                        <Monitor size={16} />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <span>
                    Theme:{" "}
                    {theme
                      ? theme.charAt(0).toUpperCase() + theme.slice(1)
                      : "System"}
                  </span>
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

          {/* User Nav */}
          <div className="pt-1">
            <AdminUserNav collapsed={collapsed} />
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
