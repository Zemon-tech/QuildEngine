import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { AchievementCard } from "#/components/roadmaps/achievement-card";
import { Breadcrumbs } from "#/components/roadmaps/breadcrumbs";
import { CategoryCard } from "#/components/roadmaps/category-card";
import {
  FilterPanel,
  type FilterState,
} from "#/components/roadmaps/filter-panel";
import {
  CanvasSkeleton,
  LoadingSkeleton,
} from "#/components/roadmaps/loading-skeleton";
import { ProgressSidebar } from "#/components/roadmaps/progress-sidebar";
import { ResourcePanel } from "#/components/roadmaps/resource-panel";
import { RoadmapCanvas } from "#/components/roadmaps/roadmap-canvas";
import { FeaturedRoadmapCard } from "#/components/roadmaps/roadmap-card";
import { SearchBar } from "#/components/roadmaps/search-bar";
import { StatsCard } from "#/components/roadmaps/stats-card";
import { Badge } from "#/components/ui/badge";
import { useRoadmapDetail, useRoadmaps } from "#/hooks/use-roadmaps";
import type {
  Achievement,
  RoadmapCategory,
  RoadmapNode,
} from "#/types/roadmaps";

// Define search query parameters
interface RoadmapSearch {
  id?: string;
  node?: string;
}

export const Route = createFileRoute("/_app/learn/roadmaps")({
  validateSearch: (search: Record<string, unknown>): RoadmapSearch => {
    return {
      id: search.id as string | undefined,
      node: search.node as string | undefined,
    };
  },
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const { id: activeRoadmapId, node: activeNodeSearch } = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    isLoading,
    isError,
    categories,
    achievements,
    progress,
    toggleNodeCompletion,
    toggleNodeBookmark,
    toggleRoadmapFavorite,
  } = useRoadmaps();

  const { data: activeRoadmap, isLoading: isRoadmapLoading } =
    useRoadmapDetail(activeRoadmapId);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Synchronize deep-linked node search param with local selection state
  useEffect(() => {
    if (activeNodeSearch) {
      setSelectedNodeId(activeNodeSearch);
    } else {
      setSelectedNodeId(null);
    }
  }, [activeNodeSearch]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    status: [],
    duration: [],
  });

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    navigate({
      search: (prev) => ({ ...prev, node: nodeId }),
    });
  };

  const handleClosePanel = () => {
    setSelectedNodeId(null);
    navigate({
      search: (prev) => ({ id: prev.id }), // strip node query parameter
    });
  };

  // Filter Categories
  const filteredCategories = categories.filter((cat: RoadmapCategory) => {
    // 1. Difficulty filter
    if (
      filters.difficulty.length > 0 &&
      !filters.difficulty.includes(cat.difficulty)
    ) {
      return false;
    }

    // 2. Duration filter
    if (
      filters.duration.length > 0 &&
      !filters.duration.includes(cat.duration)
    ) {
      return false;
    }

    // 3. Status filter
    if (filters.status.length > 0) {
      const isCompleted = cat.progress === 100;
      const isInProgress = cat.progress > 0 && cat.progress < 100;
      const isNotStarted = cat.progress === 0;

      const hasMatch = filters.status.some((s: string) => {
        if (s === "completed" && isCompleted) return true;
        if (s === "in_progress" && isInProgress) return true;
        if (s === "not_started" && isNotStarted) return true;
        return false;
      });

      if (!hasMatch) return false;
    }

    return true;
  });

  // Separate featured paths (Frontend, Backend, AI/ML)
  const featuredIds = ["frontend", "backend", "ai-ml"];
  const featuredCategories = categories.filter((cat: RoadmapCategory) =>
    featuredIds.includes(cat.id),
  );

  // Error boundary fallback
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Icons.AlertTriangle className="size-12 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-lg font-bold text-[var(--sb-ink)]">
          Failed to load Learning Roadmaps
        </h2>
        <p className="text-sm text-[var(--sb-ink-dim)] mt-2 max-w-md">
          There was an error communicating with the server functions. Please
          check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-[var(--sb-accent)] hover:opacity-90 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-95 transition-all"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Loading indicator states
  if (isLoading || (activeRoadmapId && isRoadmapLoading)) {
    return activeRoadmapId ? <CanvasSkeleton /> : <LoadingSkeleton />;
  }

  // Render Detailed Active Roadmap View (React Flow Canvas)
  if (activeRoadmapId && activeRoadmap) {
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] min-h-[550px] overflow-hidden page-enter px-1">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          roadmapTitle={activeRoadmap.title}
          topicTitle={
            selectedNodeId
              ? activeRoadmap.nodes.find(
                  (n: RoadmapNode) => n.id === selectedNodeId,
                )?.data.title
              : undefined
          }
          onExit={() => navigate({ search: {} })}
        />

        {/* Content Shell */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
          {/* Main Flow Canvas */}
          <div className="flex-1 h-full min-h-0">
            <RoadmapCanvas
              roadmap={activeRoadmap}
              progress={progress}
              onSelectNode={handleSelectNode}
            />
          </div>

          {/* Sticky Progress sidebar */}
          <div className="shrink-0 h-full overflow-y-auto hidden md:block">
            <ProgressSidebar
              roadmap={activeRoadmap}
              progress={progress}
              onSelectNode={handleSelectNode}
            />
          </div>
        </div>

        {/* Right drawer slide-out resources panel */}
        {selectedNodeId && (
          <ResourcePanel
            roadmap={activeRoadmap}
            nodeId={selectedNodeId}
            progress={progress}
            onClose={handleClosePanel}
            onToggleCompletion={toggleNodeCompletion}
            onToggleBookmark={toggleNodeBookmark}
            onSelectNode={handleSelectNode}
          />
        )}
      </div>
    );
  }

  // Render Main Hub Dashboard (Categories list, search, metrics, achievements)
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 space-y-10 page-enter select-none">
      {/* 1. Hero Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{
            color: "var(--sb-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          Learning Roadmaps
        </h1>
        <p className="text-sm md:text-base leading-relaxed text-[var(--sb-ink-muted)]">
          Follow guided, step-by-step learning paths to master key engineering
          domains. Track your progress, earn XP points, and unlock achievements.
        </p>
      </div>

      {/* 2. Global Search bar */}
      <div className="max-w-xl mx-auto">
        <SearchBar
          onSelectCategory={(id: string) => navigate({ search: { id } })}
        />
      </div>

      {/* 3. Progress Metrics statistics cards */}
      <StatsCard progress={progress} />

      {/* 4. Category filter pills panel */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* 5. Featured Roadmap Cards List */}
      {filteredCategories.length > 0 && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2
            className="text-xs uppercase font-extrabold tracking-widest"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            Signature Paths
          </h2>
          <div className="flex flex-col gap-4">
            {featuredCategories
              .filter((cat: RoadmapCategory) =>
                filteredCategories.some(
                  (fc: RoadmapCategory) => fc.id === cat.id,
                ),
              )
              .map((cat: RoadmapCategory) => (
                <FeaturedRoadmapCard
                  key={cat.id}
                  category={cat}
                  isFavorite={progress.favorites?.includes(cat.id) ?? false}
                  onToggleFavorite={() => toggleRoadmapFavorite(cat.id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* 6. Remaining Categories Grid */}
      <div className="space-y-4">
        <h2
          className="text-xs uppercase font-extrabold tracking-widest"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          Explore All Categories
        </h2>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--card-border)] rounded-2xl p-6">
            <Icons.Layers3
              size={32}
              className="text-[var(--sb-ink-dim)] mx-auto mb-3"
            />
            <p className="text-sm font-bold text-[var(--sb-ink-muted)]">
              No matching paths found
            </p>
            <p className="text-xs text-[var(--sb-ink-dim)] mt-1">
              Try adjusting your difficulty or duration filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredCategories.map((cat: RoadmapCategory) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isFavorite={progress.favorites?.includes(cat.id) ?? false}
                onToggleFavorite={() => toggleRoadmapFavorite(cat.id)}
                onClick={() => navigate({ search: { id: cat.id } })}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7. Achievements section */}
      <div className="space-y-4 border-t border-[var(--card-border)]/50 pt-8">
        <div className="flex items-center gap-2">
          <h2
            className="text-xs uppercase font-extrabold tracking-widest"
            style={{ color: "var(--sb-ink-dim)" }}
          >
            My Learning Achievements
          </h2>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/15 border-0 text-[10px] rounded-full">
            {
              achievements.filter((a: Achievement) => a.status === "unlocked")
                .length
            }{" "}
            Unlocked
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach: Achievement) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RoadmapsPage;
