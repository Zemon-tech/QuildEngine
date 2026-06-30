import { Skeleton } from "../ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-pulse">
      {/* Search Skeleton */}
      <div className="max-w-xl mx-auto">
        <Skeleton className="h-11 w-full rounded-xl bg-[var(--card-border)]/40" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
        <Skeleton className="h-24 rounded-xl bg-[var(--card-border)]/40" />
        <Skeleton className="h-24 rounded-xl bg-[var(--card-border)]/40" />
        <Skeleton className="h-24 rounded-xl bg-[var(--card-border)]/40" />
      </div>

      {/* Featured Card Skeleton */}
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-44 w-full rounded-2xl bg-[var(--card-border)]/40" />
      </div>

      {/* Categories Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-44 bg-[var(--card-border)]/40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-64 rounded-2xl bg-[var(--card-border)]/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CanvasSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--page-bg)] animate-pulse">
      {/* Left sidebar skeleton */}
      <div className="w-80 h-full border-r border-[var(--card-border)]/40 bg-[var(--card-bg)]/30 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32 bg-[var(--card-border)]/40" />
          <Skeleton className="h-16 w-full rounded-xl bg-[var(--card-border)]/40" />
          <Skeleton className="h-44 w-full rounded-xl bg-[var(--card-border)]/40" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl bg-[var(--card-border)]/40" />
      </div>

      {/* Canvas viewport skeleton */}
      <div className="flex-1 h-full p-6 relative">
        <div className="absolute top-6 left-6">
          <Skeleton className="h-6 w-48 bg-[var(--card-border)]/40" />
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-8 flex flex-col items-center">
            <Skeleton className="h-14 w-44 rounded-xl bg-[var(--card-border)]/40" />
            <Skeleton className="h-14 w-44 rounded-xl bg-[var(--card-border)]/40" />
            <div className="flex gap-16">
              <Skeleton className="h-14 w-44 rounded-xl bg-[var(--card-border)]/40" />
              <Skeleton className="h-14 w-44 rounded-xl bg-[var(--card-border)]/40" />
            </div>
            <Skeleton className="h-14 w-44 rounded-xl bg-[var(--card-border)]/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
