import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Bookmark,
  ScrollText,
  FileText,
  Map,
  StickyNote,
  Binary,
  Link2,
  GitBranch,
  Network,
  Sigma,
  Code2,
  Users,
  Brain,
  Briefcase,
  Server,
  ClipboardList,
  FileSearch,
  Zap,
  BookMarked,
  FlaskConical,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";

interface SubItem {
  label: string;
  to: string;
  icon: any;
  badge?: string | number;
}

interface SubGroup {
  label: string;
  items: SubItem[];
}

let isAiDashboardSidebarOpen = false;
const sidebarListeners = new Set<(val: boolean) => void>();

export function toggleAiDashboardSidebar() {
  isAiDashboardSidebarOpen = !isAiDashboardSidebarOpen;
  sidebarListeners.forEach((l) => l(isAiDashboardSidebarOpen));
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
  } else if (currentPath.startsWith("/learn") || currentPath.startsWith("/courses")) {
    sectionTitle = "Learning";
    groups = [
      {
        label: "Courses",
        items: [
          { label: "All Courses", to: "/courses", icon: BookOpen },
          { label: "My Courses", to: "/courses/my", icon: GraduationCap },
          { label: "Continue Learning", to: "/courses/continue", icon: PlayCircle, badge: 1 },
          { label: "Bookmarks", to: "/courses/bookmarks", icon: Bookmark },
        ],
      },
      {
        label: "Resources",
        items: [
          { label: "Tutorials", to: "/learn/tutorials", icon: ScrollText },
          { label: "Articles", to: "/learn/articles", icon: FileText },
          { label: "Roadmaps", to: "/learn/roadmaps", icon: Map },
          { label: "Notes", to: "/learn/notes", icon: StickyNote },
        ],
      },
    ];
  } else if (currentPath.startsWith("/practice")) {
    sectionTitle = "Practice Room";
    groups = [
      {
        label: "Algorithms & DSA",
        items: [
          { label: "Arrays", to: "/practice/dsa/arrays", icon: Binary },
          { label: "Strings", to: "/practice/dsa/strings", icon: FileText },
          { label: "Linked Lists", to: "/practice/dsa/linked-list", icon: Link2 },
          { label: "Trees", to: "/practice/dsa/trees", icon: GitBranch },
          { label: "Graphs", to: "/practice/dsa/graphs", icon: Network },
          { label: "Dynamic Prog.", to: "/practice/dsa/dp", icon: Sigma },
        ],
      },
      {
        label: "Interview Q&A",
        items: [
          { label: "Technical Interview", to: "/practice/qa/technical", icon: Code2 },
          { label: "Behavioral", to: "/practice/qa/behavioral", icon: Users },
          { label: "AI Generated", to: "/practice/qa/ai", icon: Brain, badge: "New" },
        ],
      },
      {
        label: "Case Studies",
        items: [
          { label: "Product", to: "/practice/case-study/product", icon: Briefcase },
          { label: "System Design", to: "/practice/case-study/system-design", icon: Server },
          { label: "Business", to: "/practice/case-study/business", icon: BarChart3 },
        ],
      },
      {
        label: "Assessments",
        items: [
          { label: "Mock Tests", to: "/practice/test-cases/mock", icon: ClipboardList },
          { label: "Assessments", to: "/practice/test-cases/assessments", icon: FileSearch },
          { label: "Weekly Challenges", to: "/practice/test-cases/weekly", icon: Zap, badge: "Live" },
        ],
      },
    ];
  } else if (currentPath.startsWith("/research") || currentPath.startsWith("/documentation")) {
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

  const isItemActive = (to: string) => currentPath === to;

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
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <span className="px-2.5 text-[10px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 block uppercase">
                {group.label}
              </span>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(item.to);
                const linkContent = (
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.98] relative",
                      collapsed && "justify-center px-1.5",
                      active
                        ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]"
                    )}
                  >
                    <item.icon size={14} className={active ? "text-[var(--sb-accent)]" : "text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-ink)]"} />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className="text-[9px] font-semibold px-1 py-0.2 rounded-md tracking-wide"
                        style={{
                          background: item.badge === "Live" ? "oklch(0.627 0.265 303.9 / 0.15)" : "var(--sb-pill)",
                          color: item.badge === "Live" ? "oklch(0.627 0.265 303.9)" : "var(--sb-ink-dim)",
                          border: "1px solid var(--sb-border)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );

                return collapsed ? (
                  <Tooltip key={item.label} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div>{linkContent}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      <span className="text-xs font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-1.5 text-[9px] font-semibold px-1 py-0.2 rounded bg-zinc-800 text-zinc-200">
                          {item.badge}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.label}>{linkContent}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
