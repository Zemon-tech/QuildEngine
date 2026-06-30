import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  BookMarked,
  Bookmark,
  BookOpen,
  Brain,
  Briefcase,
  ClipboardList,
  Code2,
  FlaskConical,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";

interface SubItem {
  label: string;
  to: string;
  icon: any;
  badge?: string | number;
}

interface SubGroup {
  label: string;
  items?: SubItem[];
  to?: string;
  icon?: any;
  badge?: string | number;
}

let isAiDashboardSidebarOpen = false;
const sidebarListeners = new Set<(val: boolean) => void>();

export function toggleAiDashboardSidebar() {
  isAiDashboardSidebarOpen = !isAiDashboardSidebarOpen;
  for (const listener of sidebarListeners) {
    listener(isAiDashboardSidebarOpen);
  }
}

export function useAiDashboardSidebarOpen() {
  const [open, setOpen] = useState(isAiDashboardSidebarOpen);
  useEffect(() => {
    sidebarListeners.add(setOpen);
    return () => {
      sidebarListeners.delete(setOpen);
    };
  }, []);
  return open;
}

let isAppSidebarForcedOpen = false;
const appSidebarListeners = new Set<(val: boolean) => void>();

export function toggleAppSidebarForced() {
  isAppSidebarForcedOpen = !isAppSidebarForcedOpen;
  for (const listener of appSidebarListeners) {
    listener(isAppSidebarForcedOpen);
  }
}

export function useAppSidebarForcedOpen() {
  const [open, setOpen] = useState(isAppSidebarForcedOpen);
  useEffect(() => {
    appSidebarListeners.add(setOpen);
    return () => {
      appSidebarListeners.delete(setOpen);
    };
  }, []);
  return [open, toggleAppSidebarForced] as const;
}

export function SecondarySidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [appSidebarOpen, toggleAppSidebar] = useAppSidebarForcedOpen();

  const isLearningOrResearch =
    currentPath.startsWith("/learn") ||
    currentPath.startsWith("/courses") ||
    currentPath.startsWith("/research") ||
    currentPath.startsWith("/documentation");

  const isProblemWorkspace =
    currentPath.includes("/practice/problem/") ||
    currentPath.includes("/practice/problems/");

  useEffect(() => {
    if (isProblemWorkspace) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isProblemWorkspace]);

  const isAiDashboard = currentPath === "/dashboard/ai-dashboard";
  const isAiSidebarOpen = useAiDashboardSidebarOpen();

  if (isAiDashboard && !isAiSidebarOpen) {
    return null;
  }

  // Determine active section and subpages
  let sectionTitle = "";
  let groups: SubGroup[] = [];

  if (currentPath.startsWith("/dashboard")) {
    sectionTitle = "Dashboard";
    groups = [
      {
        label: "Overview",
        items: [
          { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
          { label: "AI Dashboard", to: "/dashboard/ai-dashboard", icon: Brain },
          { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
          { label: "Activity Feed", to: "/dashboard/activity", icon: Activity },
        ],
      },
    ];
  } else if (
    currentPath.startsWith("/learn") ||
    currentPath.startsWith("/courses")
  ) {
    sectionTitle = "Learning";
    groups = [
      {
        label: "Courses",
        items: [
          { label: "Courses", to: "/courses", icon: BookOpen },
          { label: "Bookmarks", to: "/courses/bookmarks", icon: Bookmark },
        ],
      },
      {
        label: "Resources",
        items: [
          { label: "Roadmaps", to: "/learn/roadmaps", icon: MapIcon },
          { label: "Notes", to: "/learn/notes", icon: StickyNote },
        ],
      },
    ];
  } else if (
    currentPath.startsWith("/practice") ||
    currentPath.startsWith("/dsa") ||
    currentPath.startsWith("/interview-qa") ||
    currentPath.startsWith("/case-studies") ||
    currentPath.startsWith("/assessments")
  ) {
    sectionTitle = "Practice Room";

    // Detect if we are inside a DSA topic (for showing tab sub-nav)
    const dsaTopicMatch = currentPath.match(/^\/practice\/dsa\/([^/]+)/);
    const currentDsaTopic = dsaTopicMatch ? dsaTopicMatch[1] : null;

    if (currentDsaTopic) {
      // Inside a DSA topic — show tab sub-items
      groups = [
        {
          label: "Algorithms & DSA",
          to: "/practice/dsa",
          icon: Code2,
        },
        {
          label: "Interview Q&A",
          to: "/practice/interview-qa",
          icon: Brain,
        },
        {
          label: "Case Studies",
          to: "/practice/case-studies",
          icon: Briefcase,
        },
        {
          label: "Assessments",
          to: "/practice/assessments",
          icon: ClipboardList,
        },
      ];
    } else {
      groups = [
        {
          label: "Algorithms & DSA",
          to: "/practice/dsa",
          icon: Code2,
        },
        {
          label: "Interview Q&A",
          to: "/practice/interview-qa",
          icon: Brain,
        },
        {
          label: "Case Studies",
          to: "/practice/case-studies",
          icon: Briefcase,
        },
        {
          label: "Assessments",
          to: "/practice/assessments",
          icon: ClipboardList,
        },
      ];
    }
  } else if (
    currentPath.startsWith("/research") ||
    currentPath.startsWith("/documentation")
  ) {
    sectionTitle = "Research Center";
    groups = [
      {
        label: "Documentation",
        items: [
          { label: "Documentation", to: "/documentation", icon: BookMarked },
          { label: "Research Center", to: "/research", icon: FlaskConical },
        ],
      },
    ];
  } else {
    // Hide secondary sidebar on pages that do not belong to the main sections (e.g. profile page)
    return null;
  }

  const isItemActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

  return (
    <Sidebar
      collapsible="none"
      className="hidden md:flex border-r border-sb-border transition-[width] duration-200 ease-in-out"
      style={{
        width: collapsed ? "3.75rem" : "17rem",
        background: "color-mix(in oklab, var(--sb-bg) 96.5%, black 3.5%)",
      }}
    >
      {/* Section Header */}
      <SidebarHeader className="p-0 border-b border-sb-border h-14">
        <div
          className={cn(
            "h-full w-full flex items-center px-3 py-3 gap-2",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {isLearningOrResearch && !collapsed && (
            <button
              type="button"
              onClick={toggleAppSidebar}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-[8px] outline-none transition-all duration-150 size-7 cursor-pointer text-[var(--sb-ink-dim)] hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60 active:scale-95",
              )}
              title={appSidebarOpen ? "Hide main menu" : "Show main menu"}
              aria-label={appSidebarOpen ? "Hide main menu" : "Show main menu"}
            >
              <Menu size={15} />
            </button>
          )}
          {!collapsed && (
            <span
              className="text-xs font-bold tracking-wider uppercase truncate flex-1 text-[var(--sb-ink-dim)]"
            >
              {sectionTitle}
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[8px] outline-none transition-all duration-150 size-7 cursor-pointer text-[var(--sb-ink-dim)] hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60 active:scale-95",
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={15} />
            ) : (
              <PanelLeftClose size={15} />
            )}
          </button>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-3 gap-4">
        {groups.map((group) => {
          if (group.to) {
            // Render single top-level item (e.g. Algorithms & DSA)
            const active = isItemActive(group.to);
            const Icon = group.icon;

            return (
              <SidebarMenu key={group.label}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={group.label}
                    className="rounded-[10px] px-2.5 py-[7px]"
                  >
                    <Link
                      to={group.to}
                      className={cn(
                        "flex items-center gap-2.5 w-full text-xs font-bold tracking-wide uppercase transition-colors",
                        active
                          ? "text-[var(--sb-accent)] font-bold"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]",
                      )}
                    >
                      {Icon && <Icon size={14} className="shrink-0" />}
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{group.label}</span>
                          {group.badge && (
                            <span
                              className="text-[9px] font-semibold px-1 py-0.2 rounded-md tracking-wide border border-sb-border"
                              style={{
                                background:
                                  group.badge === "Live"
                                    ? "oklch(0.627 0.265 303.9 / 0.15)"
                                    : "var(--sb-pill)",
                                color:
                                  group.badge === "Live"
                                    ? "oklch(0.627 0.265 303.9)"
                                    : "var(--sb-ink-dim)",
                              }}
                            >
                              {group.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            );
          }

          // Otherwise render group with nested items
          return (
            <SidebarGroup key={group.label} className="p-0 flex flex-col gap-1.5">
              {!collapsed && (
                <SidebarGroupLabel className="px-2.5 text-[10px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 uppercase h-auto mb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items?.map((item) => {
                    const active = isItemActive(item.to);
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className="rounded-[10px] px-2.5 py-[7px]"
                        >
                          <Link
                            to={item.to}
                            className={cn(
                              "flex items-center gap-2.5 w-full text-xs font-medium transition-colors",
                              active
                                ? "text-[var(--sb-accent)] font-semibold"
                                : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]",
                            )}
                          >
                            <Icon size={14} className="shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="flex-1 truncate">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className="text-[9px] font-semibold px-1 py-0.2 rounded-md tracking-wide border border-sb-border"
                                    style={{
                                      background:
                                        item.badge === "Live"
                                          ? "oklch(0.627 0.265 303.9 / 0.15)"
                                          : "var(--sb-pill)",
                                      color:
                                        item.badge === "Live"
                                          ? "oklch(0.627 0.265 303.9)"
                                          : "var(--sb-ink-dim)",
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
