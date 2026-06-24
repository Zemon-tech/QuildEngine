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
  PanelLeftClose,
  PanelLeftOpen,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
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

export function SecondarySidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [collapsed, setCollapsed] = useState(false);

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
    const dsaTopicMatch = currentPath.match(
      /^\/practice\/dsa\/([^/]+)/,
    );
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
    <aside
      className="shrink-0 border-r flex flex-col h-screen overflow-hidden select-none transition-all duration-250 ease-in-out"
      style={{
        width: collapsed ? 60 : 272,
        background: "color-mix(in oklab, var(--sb-bg) 96.5%, black 3.5%)",
        borderColor: "var(--sb-border)",
      }}
    >
      {/* Section Header */}
      <div
        className={cn(
          "h-14 flex items-center border-b px-3 py-3",
          collapsed ? "justify-center" : "justify-between gap-2",
        )}
        style={{
          borderColor: "var(--sb-border)",
        }}
      >
        {!collapsed && (
          <span
            className="text-xs font-bold tracking-wider uppercase truncate"
            style={{
              color: "var(--sb-ink-dim)",
            }}
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

      {/* Group listings */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
        {groups.map((group) => {
          if (group.to) {
            // Render group itself as a navigation trigger (e.g. Algorithms & DSA)
            const active = isItemActive(group.to);
            const Icon = group.icon;

            return collapsed ? (
              <Tooltip key={group.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link
                      to={group.to}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative uppercase",
                        "justify-center px-1.5",
                        active
                          ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]",
                      )}
                    >
                      {Icon && (
                        <Icon
                          size={14}
                          className={cn(
                            "shrink-0",
                            active
                              ? "text-[var(--sb-accent)]"
                              : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]",
                          )}
                        />
                      )}
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <span className="text-xs font-medium">{group.label}</span>
                  {group.badge && (
                    <span className="ml-1.5 text-[9px] font-semibold px-1 py-0.2 rounded bg-zinc-800 text-zinc-200">
                      {group.badge}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={group.label}>
                <Link
                  to={group.to}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative uppercase",
                    active
                      ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)]"
                      : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]",
                  )}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className={cn(
                        "shrink-0",
                        active
                          ? "text-[var(--sb-accent)]"
                          : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]",
                      )}
                    />
                  )}
                  <span className="flex-1 truncate">{group.label}</span>
                  {group.badge && (
                    <span
                      className="text-[9px] font-semibold px-1 py-0.2 rounded-md tracking-wide"
                      style={{
                        background:
                          group.badge === "Live"
                            ? "oklch(0.627 0.265 303.9 / 0.15)"
                            : "var(--sb-pill)",
                        color:
                          group.badge === "Live"
                            ? "oklch(0.627 0.265 303.9)"
                            : "var(--sb-ink-dim)",
                        border: "1px solid var(--sb-border)",
                      }}
                    >
                      {group.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          }

          // Otherwise, render standard group with nested items
          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <span className="px-2.5 text-[10px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 block uppercase">
                  {group.label}
                </span>
              )}

              <div className="space-y-0.5">
                {group.items?.map((item) => {
                  const active = isItemActive(item.to);

                  return collapsed ? (
                    <Tooltip key={item.label} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div>
                          <Link
                            to={item.to}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative",
                              "justify-center px-1.5",
                              active
                                ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold"
                                : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]",
                            )}
                          >
                            <item.icon
                              size={14}
                              className={cn(
                                "shrink-0",
                                active
                                  ? "text-[var(--sb-accent)]"
                                  : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]",
                              )}
                            />
                          </Link>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-1.5 text-[9px] font-semibold px-1 py-0.2 rounded bg-zinc-800 text-zinc-200">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.label}>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative",
                          active
                            ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold"
                            : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]",
                        )}
                      >
                        <item.icon
                          size={14}
                          className={cn(
                            "shrink-0",
                            active
                              ? "text-[var(--sb-accent)]"
                              : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]",
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[9px] font-semibold px-1 py-0.2 rounded-md tracking-wide"
                            style={{
                              background:
                                item.badge === "Live"
                                  ? "oklch(0.627 0.265 303.9 / 0.15)"
                                  : "var(--sb-pill)",
                              color:
                                item.badge === "Live"
                                  ? "oklch(0.627 0.265 303.9)"
                                  : "var(--sb-ink-dim)",
                              border: "1px solid var(--sb-border)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
