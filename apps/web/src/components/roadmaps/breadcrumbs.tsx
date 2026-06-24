import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";

interface BreadcrumbsProps {
  roadmapTitle?: string;
  topicTitle?: string;
  onExit?: () => void;
}

export function Breadcrumbs({ roadmapTitle, topicTitle, onExit }: BreadcrumbsProps) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--card-border)]/40 pb-4 mb-6 select-none">
      <nav className="flex items-center gap-2 text-xs font-semibold">
        <Link
          to="/learn/roadmaps"
          className="flex items-center gap-1.5 text-[var(--sb-ink-muted)] hover:text-[var(--sb-accent)] transition-colors duration-150"
        >
          <Icons.Map size={13} />
          <span>Roadmaps</span>
        </Link>

        {roadmapTitle && (
          <>
            <Icons.ChevronRight size={12} className="text-[var(--sb-ink-dim)]" />
            <Link
              to="/learn/roadmaps"
              search={{ id: roadmapTitle.toLowerCase().replace(/ developer| engineer/g, "") }}
              className="text-[var(--sb-ink-muted)] hover:text-[var(--sb-accent)] transition-colors duration-150 truncate max-w-[120px] sm:max-w-none"
            >
              {roadmapTitle}
            </Link>
          </>
        )}

        {topicTitle && (
          <>
            <Icons.ChevronRight size={12} className="text-[var(--sb-ink-dim)]" />
            <span className="text-[var(--sb-ink)] font-bold truncate max-w-[150px] sm:max-w-none">
              {topicTitle}
            </span>
          </>
        )}
      </nav>

      {onExit && (
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all cursor-pointer active:scale-95 select-none"
        >
          <Icons.LogOut size={13} />
          <span>Exit Roadmap</span>
        </button>
      )}
    </div>
  );
}
export default Breadcrumbs;
