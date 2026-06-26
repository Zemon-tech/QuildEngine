import { Link, useRouterState } from "@tanstack/react-router";
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
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Settings,
  Shield,
  Users,
  MessageSquare,
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

export function AdminSecondarySidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  // Determine active section and subpages
  let sectionTitle = "";
  let groups: SubGroup[] = [];

  if (currentPath.startsWith("/overview") || currentPath.startsWith("/analytics") || currentPath.startsWith("/audit")) {
    sectionTitle = "Insights & Logs";
    groups = [
      {
        label: "Monitoring",
        items: [
          { label: "Overview", to: "/overview", icon: LayoutDashboard },
          { label: "Analytics", to: "/analytics", icon: BarChart3 },
          { label: "Audit Logs", to: "/audit", icon: History },
        ],
      },
    ];
  } else if (
    currentPath.startsWith("/users") ||
    currentPath.startsWith("/roles") ||
    currentPath.startsWith("/invites")
  ) {
    sectionTitle = "People & Access";
    groups = [
      {
        label: "Management",
        items: [
          { label: "Users List", to: "/users", icon: Users },
          { label: "Roles & Perms", to: "/roles", icon: Shield },
          { label: "Invites", to: "/invites", icon: Mail },
        ],
      },
    ];
  } else if (currentPath.startsWith("/courses")) {
    sectionTitle = "Learning LMS";
    groups = [
      {
        label: "Content Curation",
        items: [
          { label: "All Courses", to: "/courses", icon: BookOpen },
          { label: "Create Course", to: "/courses/new", icon: Plus },
        ],
      },
    ];
  } else if (currentPath.startsWith("/practice")) {
    sectionTitle = "Practice Room";
    groups = [
      {
        label: "Algorithms & DSA",
        to: "/practice/dsa",
        icon: Code2,
      },
      {
        label: "Interview Q&A",
        to: "/practice/interview-qa",
        icon: MessageSquare,
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
  } else if (currentPath.startsWith("/cms")) {
    sectionTitle = "Content CMS";
    groups = [
      {
        label: "Editorial",
        items: [
          { label: "Blog Posts", to: "/cms/blog", icon: FileText },
          { label: "Newsletter", to: "/cms/newsletter", icon: Mail },
        ],
      },
      {
        label: "Scheduling",
        items: [
          { label: "Live Events", to: "/cms/events", icon: Calendar },
        ],
      },
    ];
  } else if (
    currentPath.startsWith("/roadmaps") ||
    currentPath.startsWith("/research") ||
    currentPath.startsWith("/ai")
  ) {
    sectionTitle = "Platform & AI";
    groups = [
      {
        label: "Curation Workspace",
        items: [
          { label: "Roadmaps", to: "/roadmaps", icon: Map },
          { label: "Research", to: "/research", icon: Rocket },
        ],
      },
      {
        label: "Intelligence",
        items: [
          { label: "Models & Prompts", to: "/ai", icon: BrainCircuit },
        ],
      },
    ];
  } else if (currentPath.startsWith("/media") || currentPath.startsWith("/settings")) {
    sectionTitle = "System Options";
    groups = [
      {
        label: "Administration",
        items: [
          { label: "Media Library", to: "/media", icon: Image },
          { label: "Settings", to: "/settings", icon: Settings },
        ],
      },
    ];
  } else {
    // Hide secondary sidebar on pages that do not match
    return null;
  }

  const isItemActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

  return (
    <aside
      className="shrink-0 border-r flex flex-col h-screen overflow-hidden select-none transition-all duration-250 ease-in-out z-10"
      style={{
        width: collapsed ? 60 : 220,
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
            className="text-[10px] font-bold tracking-wider uppercase truncate"
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
            <PanelLeftOpen size={14} />
          ) : (
            <PanelLeftClose size={14} />
          )}
        </button>
      </div>

      {/* Group listings */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
        {groups.map((group) => {
          if (group.to) {
            // Render group itself as a navigation trigger
            const active = isItemActive(group.to);
            const Icon = group.icon;

            return collapsed ? (
              <Tooltip key={group.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link
                      to={group.to}
                      className={cn(
                        "group/sec-nav flex items-center gap-2 px-2 py-1.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative uppercase",
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
                              : "text-[var(--sb-ink-muted)] group-hover/sec-nav:text-[var(--sb-ink)]",
                          )}
                        />
                      )}
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <span className="text-xs font-medium">{group.label}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={group.label}>
                <Link
                  to={group.to}
                  className={cn(
                    "group/sec-nav flex items-center gap-2 px-2 py-1.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative uppercase",
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
                          : "text-[var(--sb-ink-muted)] group-hover/sec-nav:text-[var(--sb-ink)]",
                      )}
                    />
                  )}
                  <span className="flex-1 truncate">{group.label}</span>
                </Link>
              </div>
            );
          }

          // Otherwise, render standard group with nested items
          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <span className="px-2 text-[9px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 block uppercase">
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
                              "group/sec-nav flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative",
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
                                  : "text-[var(--sb-ink-muted)] group-hover/sec-nav:text-[var(--sb-ink)]",
                              )}
                            />
                          </Link>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.label}>
                      <Link
                        to={item.to}
                        className={cn(
                          "group/sec-nav flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] relative",
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
                              : "text-[var(--sb-ink-muted)] group-hover/sec-nav:text-[var(--sb-ink)]",
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
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
