import type { RoadmapCategory } from "../../types/roadmaps";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

interface CategoryCardProps {
  category: RoadmapCategory;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function CategoryCard({ category, onClick, isFavorite, onToggleFavorite }: CategoryCardProps) {
  // Dynamically resolve icon from name
  const IconComponent = (Icons as any)[category.iconName] || Icons.Map;

  // Map difficulty levels to colors
  const difficultyColors = {
    beginner: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    advanced: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  const isCompleted = category.progress === 100;
  const hasProgress = category.progress > 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300",
        "bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--sb-accent)]/40 hover:shadow-xl",
        "cursor-pointer overflow-hidden transform hover:-translate-y-1"
      )}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Vercel-style hover radial glow effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(400px_circle_at_var(--x,0px)_var(--y,0px),rgba(var(--sb-accent-rgb),0.03),transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: "var(--page-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <IconComponent className="size-5 text-[var(--sb-accent)]" />
          </div>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleFavorite(e);
                }}
                className={cn(
                  "p-1.5 rounded-lg border transition-all cursor-pointer z-10",
                  "bg-[var(--card-bg)] hover:bg-[var(--sb-bg-hover)]",
                  isFavorite 
                    ? "border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10" 
                    : "border-[var(--card-border)] text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                )}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Icons.Star className={cn("size-3.5", isFavorite && "fill-amber-500")} />
              </button>
            )}
            <Badge
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold border capitalize rounded-full",
                difficultyColors[category.difficulty]
              )}
              variant="outline"
            >
              {category.difficulty}
            </Badge>
          </div>
        </div>

        {/* Title & Desc */}
        <h3
          className="text-base font-bold tracking-tight mb-2 group-hover:text-[var(--sb-accent)] transition-colors duration-200"
          style={{ color: "var(--sb-ink)" }}
        >
          {category.title}
        </h3>
        <p
          className="text-xs leading-relaxed line-clamp-3 mb-5"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {category.description}
        </p>
      </div>

      {/* Progress & Actions */}
      <div className="mt-auto space-y-4">
        {/* Topic & Duration Info */}
        <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>
          <div className="flex items-center gap-1.5">
            <Icons.BookOpen size={12} />
            <span>{category.topicsCount} Topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icons.Clock size={12} />
            <span>{category.duration}</span>
          </div>
        </div>

        {/* Progress Bar (Visible if progress > 0) */}
        {hasProgress && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-medium">
              <span style={{ color: "var(--sb-ink-dim)" }}>Path Progress</span>
              <span className="text-[var(--sb-accent)]">{category.progress}%</span>
            </div>
            <div
              className="h-1 w-full rounded-full overflow-hidden"
              style={{ background: "var(--page-bg)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 bg-[var(--sb-accent)]"
                style={{ width: `${category.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Button Action */}
        <Button
          asChild
          variant={isCompleted ? "outline" : hasProgress ? "default" : "outline"}
          className={cn(
            "w-full h-9 rounded-lg font-medium text-xs border cursor-pointer select-none active:scale-97 transition-all",
            hasProgress && !isCompleted
              ? "bg-[var(--sb-accent)] text-white hover:opacity-90 border-0"
              : "border-[var(--card-border)] hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink)]"
          )}
        >
          <Link to="/learn/roadmaps" search={{ id: category.id }}>
            {isCompleted ? (
              <span className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={13} className="text-emerald-500" />
                Completed
              </span>
            ) : hasProgress ? (
              "Continue Learning"
            ) : (
              "Start Roadmap"
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
