import type { RoadmapCategory } from "../../types/roadmaps";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

interface FeaturedRoadmapCardProps {
  category: RoadmapCategory;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function FeaturedRoadmapCard({ category, isFavorite, onToggleFavorite }: FeaturedRoadmapCardProps) {
  const IconComponent = (Icons as any)[category.iconName] || Icons.Map;

  const difficultyColors = {
    beginner: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    advanced: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  const hasProgress = category.progress > 0;
  const isCompleted = category.progress === 100;

  return (
    <div
      className={cn(
        "group relative flex flex-col md:flex-row justify-between gap-6 rounded-2xl p-6 md:p-8 transition-all duration-300",
        "bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--sb-accent)]/40 hover:shadow-xl",
        "overflow-hidden"
      )}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleFavorite(e);
          }}
          className={cn(
            "absolute top-4 right-4 z-20 p-2 rounded-xl border transition-all cursor-pointer",
            "bg-[var(--card-bg)] hover:bg-[var(--sb-bg-hover)]",
            isFavorite 
              ? "border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10" 
              : "border-[var(--card-border)] text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
          )}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Icons.Star className={cn("size-4", isFavorite && "fill-amber-500")} />
        </button>
      )}

      {/* Vercel-style hover radial glow effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_var(--x,0px)_var(--y,0px),rgba(var(--sb-accent-rgb),0.035),transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background decoration gradient blur */}
      <div className="absolute -right-12 -bottom-12 size-48 rounded-full bg-[var(--sb-accent)]/5 blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-500" />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Tag + Icon */}
          <div className="flex items-center gap-3 mb-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--sb-accent)]/10 text-[var(--sb-accent)]">
              <IconComponent className="size-4" />
            </span>
            <Badge className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border-0 bg-amber-500/10 text-amber-500 rounded-full">
              ★ FEATURED PATH
            </Badge>
          </div>

          {/* Title & Desc */}
          <h2
            className="text-lg md:text-xl font-bold tracking-tight mb-2.5 group-hover:text-[var(--sb-accent)] transition-colors duration-200"
            style={{ color: "var(--sb-ink)" }}
          >
            {category.title}
          </h2>
          <p
            className="text-xs md:text-sm leading-relaxed max-w-xl mb-6"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            {category.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-sm text-xs border-t border-[var(--card-border)]/50 pt-5 mt-auto">
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[var(--sb-ink-dim)]">Duration</p>
            <p className="mt-1 font-semibold text-[var(--sb-ink)]">{category.duration}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[var(--sb-ink-dim)]">Topics</p>
            <p className="mt-1 font-semibold text-[var(--sb-ink)]">{category.topicsCount} Chapters</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[var(--sb-ink-dim)]">Difficulty</p>
            <span className={cn(
              "inline-block mt-0.5 text-[10px] font-semibold border capitalize px-2 py-0.5 rounded-full",
              difficultyColors[category.difficulty]
            )}>
              {category.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Sync Bar & Button */}
      <div className="md:w-64 flex flex-col justify-end gap-6 md:border-l md:border-[var(--card-border)]/50 md:pl-6">
        {hasProgress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span style={{ color: "var(--sb-ink-dim)" }}>Path Completion</span>
              <span className="text-[var(--sb-accent)]">{category.progress}%</span>
            </div>
            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ background: "var(--page-bg)" }}
            >
              <div
                className="h-full rounded-full bg-[var(--sb-accent)] transition-all duration-500"
                style={{ width: `${category.progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          asChild
          className={cn(
            "w-full h-11 rounded-xl text-xs font-semibold transition-all active:scale-97 select-none cursor-pointer",
            isCompleted
              ? "bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20"
              : hasProgress
              ? "bg-[var(--sb-accent)] text-white hover:opacity-90 border-0"
              : "bg-[var(--sb-accent)] text-white hover:opacity-90 border-0"
          )}
        >
          <Link to="/learn/roadmaps" search={{ id: category.id }}>
            {isCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <Icons.CheckCircle2 size={15} />
                Roadmap Completed
              </span>
            ) : hasProgress ? (
              "Continue Learning"
            ) : (
              "Explore Path"
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
