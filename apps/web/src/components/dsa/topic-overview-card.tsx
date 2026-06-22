import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

interface TopicOverviewCardProps {
  name: string;
  description: string;
  totalProblems: number;
  solvedProblems: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  lastUpdated?: string;
  onStartLearning?: () => void;
  onPracticeProblems?: () => void;
}

export function TopicOverviewCard({
  name,
  description,
  totalProblems,
  solvedProblems,
  icon: IconComponent,
  lastUpdated = "Today",
  onStartLearning,
  onPracticeProblems,
}: TopicOverviewCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL to clipboard: ", err);
    }
  };

  const progress =
    totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Decorative top background gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--sb-accent)]/80 via-indigo-500/80 to-cyan-500/80" />

      <div className="flex flex-col gap-5">
        {/* Topic Icon & Name Row */}
        <div className="flex items-start gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br from-[var(--sb-accent)]/10 to-indigo-500/5"
            style={{ borderColor: "var(--sb-border)" }}
          >
            {IconComponent ? (
              <IconComponent size={28} className="text-[var(--sb-accent)]" />
            ) : (
              <Sparkles size={28} className="text-[var(--sb-accent)]" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: "var(--sb-ink)",
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                {name}
              </h1>
              {progress === 100 && (
                <CheckCircle size={18} className="text-emerald-500" />
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
              Data Structures & Algorithms Module
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {description}
        </p>

        {/* Mini stats row */}
        <div
          className="grid grid-cols-2 gap-4 border-y py-4"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <div className="space-y-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Syllabus Coverage
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-base font-bold"
                style={{ color: "var(--sb-ink)" }}
              >
                {solvedProblems} / {totalProblems}
              </span>
              <span className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
                problems
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Last Studied
            </span>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--sb-ink)" }}
            >
              <Calendar size={13} className="text-[var(--sb-accent)]" />
              {lastUpdated}
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onStartLearning}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[var(--sb-accent)] hover:opacity-90 active:scale-[0.98] transition-all rounded-xl"
            >
              <Play size={13} fill="white" />
              Start Learning
            </Button>
            <Button
              onClick={onPracticeProblems}
              variant="outline"
              className="flex items-center justify-center gap-1.5 text-xs font-bold border rounded-xl hover:bg-[var(--sb-accent)]/5 active:scale-[0.98] transition-all"
              style={{
                color: "var(--sb-ink)",
                borderColor: "var(--sb-border)",
              }}
            >
              <Award size={13} />
              Practice Mode
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold border rounded-xl transition-all hover:bg-[var(--sb-accent)]/5"
              style={{
                color: isBookmarked
                  ? "var(--sb-accent)"
                  : "var(--sb-ink-muted)",
                borderColor: "var(--sb-border)",
              }}
            >
              {isBookmarked ? (
                <BookmarkCheck size={14} className="animate-bounce" />
              ) : (
                <Bookmark size={14} />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold border rounded-xl transition-all hover:bg-[var(--sb-accent)]/5"
                style={{
                  color: "var(--sb-ink-muted)",
                  borderColor: "var(--sb-border)",
                }}
              >
                <Share2 size={14} />
                Share
              </Button>

              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 z-50 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white shadow-md select-none pointer-events-none whitespace-nowrap bg-emerald-500"
                  >
                    Link copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
