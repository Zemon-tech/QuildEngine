import * as Icons from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export interface FilterState {
  difficulty: string[];
  status: string[];
  duration: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDifficulty = (diff: string) => {
    const nextDiff = filters.difficulty.includes(diff)
      ? filters.difficulty.filter((d) => d !== diff)
      : [...filters.difficulty, diff];
    onChange({ ...filters, difficulty: nextDiff });
  };

  const toggleStatus = (stat: string) => {
    const nextStat = filters.status.includes(stat)
      ? filters.status.filter((s) => s !== stat)
      : [...filters.status, stat];
    onChange({ ...filters, status: nextStat });
  };

  const toggleDuration = (dur: string) => {
    const nextDur = filters.duration.includes(dur)
      ? filters.duration.filter((d) => d !== dur)
      : [...filters.duration, dur];
    onChange({ ...filters, duration: nextDur });
  };

  const clearAll = () => {
    onChange({
      difficulty: [],
      status: [],
      duration: [],
    });
  };

  const activeCount =
    filters.difficulty.length + filters.status.length + filters.duration.length;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)]/50 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold select-none cursor-pointer transition-all active:scale-95",
              isOpen
                ? "bg-[var(--sb-accent)]/10 border-[var(--sb-accent)]/30 text-[var(--sb-accent)]"
                : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]",
            )}
          >
            <Icons.SlidersHorizontal size={13} />
            Filters
            {activeCount > 0 && (
              <Badge className="ml-1 bg-[var(--sb-accent)] hover:bg-[var(--sb-accent)]/90 text-white rounded-full size-4 flex items-center justify-center p-0 text-[9px] font-bold">
                {activeCount}
              </Badge>
            )}
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-[var(--sb-accent)] hover:underline flex items-center gap-1 px-2 py-1 select-none cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Selected Filter Tags */}
        <div className="flex flex-wrap gap-1.5">
          {filters.difficulty.map((d) => (
            <Badge
              key={d}
              className="px-2 py-0.5 text-[10px] bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] border border-[var(--card-border)] capitalize rounded-full flex items-center gap-1 cursor-pointer"
              onClick={() => toggleDifficulty(d)}
            >
              Diff: {d}
              <Icons.X size={10} className="text-[var(--sb-ink-dim)]" />
            </Badge>
          ))}
          {filters.status.map((s) => (
            <Badge
              key={s}
              className="px-2 py-0.5 text-[10px] bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] border border-[var(--card-border)] capitalize rounded-full flex items-center gap-1 cursor-pointer"
              onClick={() => toggleStatus(s)}
            >
              Status: {s.replace("_", " ")}
              <Icons.X size={10} className="text-[var(--sb-ink-dim)]" />
            </Badge>
          ))}
          {filters.duration.map((d) => (
            <Badge
              key={d}
              className="px-2 py-0.5 text-[10px] bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] border border-[var(--card-border)] rounded-full flex items-center gap-1 cursor-pointer"
              onClick={() => toggleDuration(d)}
            >
              Dur: {d}
              <Icons.X size={10} className="text-[var(--sb-ink-dim)]" />
            </Badge>
          ))}
        </div>
      </div>

      {/* Expandable Filter Details Grid */}
      {isOpen && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 rounded-xl border border-[var(--card-border)] page-enter"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* Difficulty Group */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] block mb-1">
              Difficulty
            </span>
            <div className="flex flex-col gap-1.5">
              {["beginner", "intermediate", "advanced"].map((diff) => {
                const isSelected = filters.difficulty.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => toggleDifficulty(diff)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all active:scale-97 select-none cursor-pointer",
                      isSelected
                        ? "bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] font-semibold"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        diff === "beginner"
                          ? "bg-emerald-500"
                          : diff === "intermediate"
                            ? "bg-blue-500"
                            : "bg-purple-500",
                      )}
                    />
                    <span className="capitalize">{diff}</span>
                    {isSelected && (
                      <Icons.Check size={12} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Group */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] block mb-1">
              My Progress
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { key: "not_started", label: "Not Started" },
                { key: "in_progress", label: "In Progress" },
                { key: "completed", label: "Completed" },
              ].map((stat) => {
                const isSelected = filters.status.includes(stat.key);
                return (
                  <button
                    key={stat.key}
                    onClick={() => toggleStatus(stat.key)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all active:scale-97 select-none cursor-pointer",
                      isSelected
                        ? "bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] font-semibold"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]",
                    )}
                  >
                    {stat.key === "completed" && (
                      <Icons.CheckCircle2
                        size={12}
                        className="text-emerald-500"
                      />
                    )}
                    {stat.key === "in_progress" && (
                      <Icons.Flame size={12} className="text-amber-500" />
                    )}
                    {stat.key === "not_started" && (
                      <Icons.Circle
                        size={12}
                        className="text-[var(--sb-ink-dim)]"
                      />
                    )}
                    <span>{stat.label}</span>
                    {isSelected && (
                      <Icons.Check size={12} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Group */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] block mb-1">
              Estimated Duration
            </span>
            <div className="flex flex-col gap-1.5">
              {["1-2 months", "2-3 months", "3-4 months", "4-6 months"].map(
                (dur) => {
                  const isSelected = filters.duration.includes(dur);
                  return (
                    <button
                      key={dur}
                      onClick={() => toggleDuration(dur)}
                      className={cn(
                        "flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all active:scale-97 select-none cursor-pointer",
                        isSelected
                          ? "bg-[var(--sb-accent)]/10 text-[var(--sb-accent)] font-semibold"
                          : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]",
                      )}
                    >
                      <Icons.Clock
                        size={12}
                        className="text-[var(--sb-ink-muted)]"
                      />
                      <span>{dur}</span>
                      {isSelected && (
                        <Icons.Check size={12} className="ml-auto" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
