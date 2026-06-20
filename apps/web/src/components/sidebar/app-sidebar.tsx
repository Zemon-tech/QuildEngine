import { useState } from "react";
import { motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Bookmark,
  PlayCircle,
  FileText,
  Map,
  StickyNote,
  Code2,
  MessageSquare,
  Briefcase,
  Server,
  ClipboardList,
  Calendar,
  Video,
  Wrench,
  Zap,
  Sparkles,
  BookMarked,
  FlaskConical,
  FileSearch,
  Trophy,
  ScrollText,
  BarChart3,
  Activity,
  Binary,
  Link2,
  GitBranch,
  Network,
  Sigma,
  Users,
  Brain,
  TestTube,
  Menu,
  GraduationCap as LearnIcon,
} from "lucide-react";
import { ScrollArea } from "#/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "#/components/ui/sheet";
import { cn } from "#/lib/utils";

import { SidebarHeader } from "./sidebar-header";
import { NavSection } from "./nav-section";
import { NavItem } from "./nav-item";
import { NavAccordion } from "./nav-accordion";
import { UserNav } from "./user-nav";
import { AIAssistant } from "./ai-assistant";
import { ThemeToggle } from "./theme-toggle";

const SIDEBAR_EXPANDED_WIDTH = 272;
const SIDEBAR_COLLAPSED_WIDTH = 60;

// ── Helpers ──────────────────────────────────────────────────────────────────

function useActiveCheck() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  function isActive(path: string) {
    return currentPath === path || currentPath.startsWith(path + "/");
  }

  function anyActive(...paths: string[]) {
    return paths.some((p) => isActive(p));
  }

  return { currentPath, isActive, anyActive };
}

// ── Sidebar nav content (shared between desktop + mobile Sheet) ───────────

interface SidebarNavProps {
  collapsed?: boolean;
}

function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const { currentPath, isActive, anyActive } = useActiveCheck();

  return (
    <nav className="flex flex-col gap-0.5 py-2" aria-label="Main navigation">
      {/* ── Dashboard ─────────────────────────────── */}
      <NavSection
        id="dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        collapsed={collapsed}
        hasActiveChild={anyActive("/dashboard")}
      >
        <NavItem
          icon={LayoutDashboard}
          label="Overview"
          to="/dashboard"
          collapsed={collapsed}
          isActive={isActive("/dashboard")}
        />
        <NavItem
          icon={BarChart3}
          label="Analytics"
          to="/dashboard/analytics"
          collapsed={collapsed}
          isActive={isActive("/dashboard/analytics")}
        />
        <NavItem
          icon={Activity}
          label="Activity Feed"
          to="/dashboard/activity"
          collapsed={collapsed}
          isActive={isActive("/dashboard/activity")}
        />
      </NavSection>

      {/* ── Courses ───────────────────────────────── */}
      <NavSection
        id="courses"
        icon={BookOpen}
        label="Courses"
        collapsed={collapsed}
        hasActiveChild={anyActive("/courses")}
        showSeparatorAbove
      >
        <NavItem
          icon={BookOpen}
          label="All Courses"
          to="/courses"
          collapsed={collapsed}
          isActive={isActive("/courses")}
        />
        <NavItem
          icon={GraduationCap}
          label="My Courses"
          to="/courses/my"
          collapsed={collapsed}
          isActive={isActive("/courses/my")}
        />
        <NavItem
          icon={PlayCircle}
          label="Continue Learning"
          to="/courses/continue"
          collapsed={collapsed}
          isActive={isActive("/courses/continue")}
          badge={1}
        />
        <NavItem
          icon={Bookmark}
          label="Bookmarks"
          to="/courses/bookmarks"
          collapsed={collapsed}
          isActive={isActive("/courses/bookmarks")}
        />
      </NavSection>

      {/* ── Learn ─────────────────────────────────── */}
      <NavSection
        id="learn"
        icon={LearnIcon}
        label="Learn"
        collapsed={collapsed}
        hasActiveChild={anyActive("/learn")}
        showSeparatorAbove
      >
        <NavItem
          icon={ScrollText}
          label="Tutorials"
          to="/learn/tutorials"
          collapsed={collapsed}
          isActive={isActive("/learn/tutorials")}
        />
        <NavItem
          icon={FileText}
          label="Articles"
          to="/learn/articles"
          collapsed={collapsed}
          isActive={isActive("/learn/articles")}
        />
        <NavItem
          icon={Map}
          label="Roadmaps"
          to="/learn/roadmaps"
          collapsed={collapsed}
          isActive={isActive("/learn/roadmaps")}
        />
        <NavItem
          icon={StickyNote}
          label="Notes"
          to="/learn/notes"
          collapsed={collapsed}
          isActive={isActive("/learn/notes")}
        />
      </NavSection>

      {/* ── Practice ──────────────────────────────── */}
      <NavSection
        id="practice"
        icon={Code2}
        label="Practice"
        collapsed={collapsed}
        hasActiveChild={anyActive("/practice")}
        showSeparatorAbove
      >
        <NavAccordion
          icon={Code2}
          label="DSA"
          collapsed={collapsed}
          defaultOpen={currentPath.startsWith("/practice/dsa")}
          items={[
            { icon: Binary, label: "Arrays", to: "/practice/dsa/arrays" },
            { icon: FileText, label: "Strings", to: "/practice/dsa/strings" },
            { icon: Link2, label: "Linked List", to: "/practice/dsa/linked-list" },
            { icon: GitBranch, label: "Trees", to: "/practice/dsa/trees" },
            { icon: Network, label: "Graphs", to: "/practice/dsa/graphs" },
            { icon: Sigma, label: "Dynamic Programming", to: "/practice/dsa/dp" },
          ]}
        />
        <NavAccordion
          icon={MessageSquare}
          label="Q&A"
          collapsed={collapsed}
          defaultOpen={currentPath.startsWith("/practice/qa")}
          items={[
            { icon: Code2, label: "Technical Interview", to: "/practice/qa/technical" },
            { icon: Users, label: "Behavioral", to: "/practice/qa/behavioral" },
            { icon: Brain, label: "AI Generated", to: "/practice/qa/ai", badge: "New" },
          ]}
        />
        <NavAccordion
          icon={Briefcase}
          label="Case Studies"
          collapsed={collapsed}
          defaultOpen={currentPath.startsWith("/practice/case-study")}
          items={[
            { icon: Briefcase, label: "Product", to: "/practice/case-study/product" },
            { icon: Server, label: "System Design", to: "/practice/case-study/system-design" },
            { icon: BarChart3, label: "Business", to: "/practice/case-study/business" },
          ]}
        />
        <NavAccordion
          icon={TestTube}
          label="Test Cases"
          collapsed={collapsed}
          defaultOpen={currentPath.startsWith("/practice/test-cases")}
          items={[
            { icon: ClipboardList, label: "Mock Tests", to: "/practice/test-cases/mock" },
            { icon: FileSearch, label: "Assessments", to: "/practice/test-cases/assessments" },
            { icon: Zap, label: "Weekly Challenges", to: "/practice/test-cases/weekly", badge: "Live" },
          ]}
        />
      </NavSection>

      {/* ── Events ────────────────────────────────── */}
      <NavSection
        id="events"
        icon={Calendar}
        label="Events"
        collapsed={collapsed}
        hasActiveChild={anyActive("/events")}
        showSeparatorAbove
        badge={3}
      >
        <NavItem
          icon={Calendar}
          label="Upcoming Events"
          to="/events"
          collapsed={collapsed}
          isActive={isActive("/events")}
          badge={3}
        />
        <NavItem
          icon={Video}
          label="Webinars"
          to="/events/webinars"
          collapsed={collapsed}
          isActive={isActive("/events/webinars")}
        />
        <NavItem
          icon={Wrench}
          label="Workshops"
          to="/events/workshops"
          collapsed={collapsed}
          isActive={isActive("/events/workshops")}
        />
        <NavItem
          icon={Zap}
          label="Hackathons"
          to="/events/hackathons"
          collapsed={collapsed}
          isActive={isActive("/events/hackathons")}
        />
      </NavSection>

      {/* ── Knowledge ─────────────────────────────── */}
      <NavSection
        id="knowledge"
        icon={BookMarked}
        label="Knowledge"
        collapsed={collapsed}
        hasActiveChild={anyActive("/documentation", "/research")}
        showSeparatorAbove
      >
        <NavItem
          icon={BookMarked}
          label="Documentation"
          to="/documentation"
          collapsed={collapsed}
          isActive={isActive("/documentation")}
        />
        <NavItem
          icon={FlaskConical}
          label="Research"
          to="/research"
          collapsed={collapsed}
          isActive={isActive("/research")}
        />
      </NavSection>

      {/* ── Profile ───────────────────────────────── */}
      <NavSection
        id="profile"
        icon={Trophy}
        label="Profile"
        collapsed={collapsed}
        hasActiveChild={anyActive("/profile")}
        showSeparatorAbove
      >
        <NavItem
          icon={Trophy}
          label="Achievements"
          to="/profile/achievements"
          collapsed={collapsed}
          isActive={isActive("/profile/achievements")}
        />
        <NavItem
          icon={ScrollText}
          label="Certificates"
          to="/profile/certificates"
          collapsed={collapsed}
          isActive={isActive("/profile/certificates")}
        />
      </NavSection>
    </nav>
  );
}

// ── Sidebar footer (AI + User) ────────────────────────────────────────────

interface SidebarFooterProps {
  collapsed: boolean;
  aiOpen: boolean;
  onAiToggle: () => void;
}

function SidebarFooter({ collapsed, aiOpen, onAiToggle }: SidebarFooterProps) {
  return (
    <div className="shrink-0" style={{ borderTop: "1px solid var(--sb-border)" }}>
      {/* AI Assistant toggle */}
      <div className={cn("px-2 pt-2", collapsed && "px-1.5")}>
        <button
          type="button"
          onClick={onAiToggle}
          aria-pressed={aiOpen}
          className={cn(
            "group relative flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-sm font-medium outline-none",
            "transition-all duration-150",
            "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
            collapsed && "justify-center px-2",
            aiOpen && "ring-1 ring-[var(--sb-accent)]/30",
          )}
          style={{ color: aiOpen ? "var(--sb-accent)" : "var(--sb-ink-muted)" }}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[10px] transition-opacity duration-150",
              aiOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
            style={{ background: aiOpen ? "var(--sb-pill)" : "var(--sb-bg-hover)" }}
          />

          <motion.span
            className="relative z-10 shrink-0"
            animate={aiOpen ? { rotate: [0, 15, -10, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Sparkles size={16} />
          </motion.span>

          {!collapsed && (
            <span className="relative z-10 flex-1 truncate text-left">
              AI Assistant
            </span>
          )}

          {!collapsed && aiOpen && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex h-4 items-center rounded-full px-1.5 text-[9px] font-semibold uppercase tracking-wider"
              style={{
                background: "var(--sb-accent)",
                color: "var(--sb-accent-foreground)",
              }}
            >
              Live
            </motion.span>
          )}
        </button>
      </div>

      {/* Theme Toggle */}
      <div className={cn("px-2 pt-1", collapsed && "px-1.5")}>
        <ThemeToggle collapsed={collapsed} />
      </div>

      {/* User nav */}
      <div className={cn("px-2 py-2", collapsed && "px-1.5")}>
        <UserNav collapsed={collapsed} />
      </div>
    </div>
  );
}

// ── Desktop sidebar ───────────────────────────────────────────────────────

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  aiOpen: boolean;
  onAiToggle: () => void;
}

function DesktopSidebar({ collapsed, onToggle, aiOpen, onAiToggle }: DesktopSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="relative hidden shrink-0 flex-col overflow-hidden md:flex"
      style={{
        background: "var(--sb-bg)",
        borderRight: "1px solid var(--sb-border)",
        minHeight: "100vh",
      }}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

      <ScrollArea className="flex-1 overflow-hidden">
        <SidebarNav collapsed={collapsed} />
      </ScrollArea>

      <SidebarFooter
        collapsed={collapsed}
        aiOpen={aiOpen}
        onAiToggle={onAiToggle}
      />
    </motion.aside>
  );
}

// ── Mobile sidebar (Sheet) ────────────────────────────────────────────────

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  aiOpen: boolean;
  onAiToggle: () => void;
}

function MobileSidebar({ open, onClose, aiOpen, onAiToggle }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="left"
        className="flex flex-col overflow-hidden p-0"
        style={{
          width: SIDEBAR_EXPANDED_WIDTH,
          background: "var(--sb-bg)",
          borderRight: "1px solid var(--sb-border)",
        }}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <SidebarHeader collapsed={false} onToggle={onClose} />

        <ScrollArea className="flex-1 overflow-hidden">
          <SidebarNav collapsed={false} />
        </ScrollArea>

        <SidebarFooter
          collapsed={false}
          aiOpen={aiOpen}
          onAiToggle={onAiToggle}
        />
      </SheetContent>
    </Sheet>
  );
}

// ── AppSidebar (exported) ─────────────────────────────────────────────────

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger (only visible on small screens) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className={cn(
          "fixed left-4 top-4 z-40 flex size-9 items-center justify-center rounded-[10px] md:hidden",
          "transition-opacity duration-150 hover:opacity-70",
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

      {/* Desktop sidebar */}
      <DesktopSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        aiOpen={aiOpen}
        onAiToggle={() => setAiOpen((o) => !o)}
      />

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        aiOpen={aiOpen}
        onAiToggle={() => setAiOpen((o) => !o)}
      />

      {/* AI Assistant floating panel */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
