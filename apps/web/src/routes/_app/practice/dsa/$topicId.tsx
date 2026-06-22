import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";
import {
  Award,
  Binary,
  Bot,
  BookOpen,
  Code2,
  Coins,
  Compass,
  Cpu,
  FileText,
  GitBranch,
  Hash,
  Key,
  Layers,
  LineChart,
  Link2,
  ListOrdered,
  Network,
  RotateCcw,
  Search,
  SearchCode,
  Split,
  Triangle,
  Type,
} from "lucide-react";
import type React from "react";
import { useDSACategory } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/dsa/$topicId")({
  component: TopicLayout,
});

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  arrays: Hash,
  strings: Type,
  "linked-list": Link2,
  stack: Layers,
  queue: ListOrdered,
  recursion: RotateCcw,
  hashing: Key,
  "binary-search": Search,
  trees: GitBranch,
  "binary-search-tree": Split,
  heap: Triangle,
  graph: Network,
  "dynamic-programming": Cpu,
  greedy: Coins,
  backtracking: Compass,
  tries: SearchCode,
  "segment-tree": LineChart,
  "bit-manipulation": Binary,
};

/**
 * Tabs definition for the topic detail workspace.
 * Each tab maps to a nested route under /practice/dsa/$topicId/*.
 * The index route (no suffix) is the Practice Board.
 */
const TABS = [
  { id: "practice", label: "Practice Board", icon: Code2, suffix: "" },
  { id: "roadmap", label: "Learning Roadmap", icon: GitBranch, suffix: "/roadmap" },
  { id: "resources", label: "Study Resources", icon: BookOpen, suffix: "/resources" },
  { id: "interview", label: "Interview Arena", icon: Award, suffix: "/interview" },
  { id: "ai_copilot", label: "AI Study Copilot", icon: Bot, suffix: "/copilot" },
  { id: "revision", label: "Revision Sheet", icon: FileText, suffix: "/revision" },
] as const;

/**
 * Topic layout — persistent header + TanStack Router Link-based tab navigation.
 * Child routes render in <Outlet />.
 * Active tab is derived from the current URL pathname — no local state needed.
 */
function TopicLayout() {
  const { topicId } = Route.useParams();
  const { data: category, isLoading } = useDSACategory(topicId);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const IconComponent = iconMap[topicId] || Code2;

  /**
   * Determine which tab is active by matching the current pathname.
   * The index tab (/practice/dsa/$topicId) matches when no suffix is present.
   */
  const getIsTabActive = (suffix: string) => {
    const basePath = `/practice/dsa/${topicId}`;
    if (suffix === "") {
      // Practice Board is active when on the exact base path or with search params only
      return (
        currentPath === basePath ||
        currentPath === `${basePath}/`
      );
    }
    return (
      currentPath === `${basePath}${suffix}` ||
      currentPath.startsWith(`${basePath}${suffix}/`)
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--sb-accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-6 w-full">
      {/* Back button & Page Title */}
      <div className="flex flex-col gap-4">
        <Link
          to="/practice/dsa"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to DSA Dashboard
        </Link>

        {/* Dashboard Header */}
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--sb-accent)]/5 text-[var(--sb-accent)] border border-[var(--sb-accent)]/10">
            <IconComponent size={24} />
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--sb-ink)" }}
            >
              {category?.name ?? topicId} Learning Dashboard
            </h1>
            <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
              {category?.description ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs — TanStack Router <Link> based */}
      <div
        className="flex items-center gap-1 border-b pb-1 select-none overflow-x-auto"
        style={{ borderColor: "var(--sb-border)" }}
      >
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = getIsTabActive(tab.suffix);
          return (
            <Link
              key={tab.id}
              to={`/practice/dsa/$topicId${tab.suffix === "" ? "/" : tab.suffix}` as any}
              params={tab.suffix === "" ? { topicId } : ({ topicId } as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 -mb-[6px] transition-all relative cursor-pointer select-none ${
                isActive
                  ? "border-[var(--sb-accent)] text-[var(--sb-accent)]"
                  : "border-transparent text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
              }`}
            >
              <TabIcon size={13} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Content — rendered by child routes */}
      <div className="w-full min-h-[450px]">
        <Outlet />
      </div>
    </div>
  );
}
