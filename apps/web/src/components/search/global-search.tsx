"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  Search,
  BookOpen,
  ScrollText,
  GraduationCap,
  StickyNote,
  Code2,
  MessageSquare,
  Briefcase,
  TestTube,
  Calendar,
  BookMarked,
  FlaskConical,
  User,
  History,
  CornerDownLeft,
  X,
} from "lucide-react"

import { cn } from "#/lib/utils.ts"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "#/components/ui/command"
import { searchDatabase, type SearchItem } from "#/lib/search-db"

const categoryIcons: Record<SearchItem["category"], any> = {
  Courses: BookOpen,
  Tutorials: ScrollText,
  Lessons: GraduationCap,
  Topics: StickyNote,
  "DSA Problems": Code2,
  "Q/A": MessageSquare,
  "Case Studies": Briefcase,
  "Test Cases": TestTube,
  Events: Calendar,
  Documentation: BookMarked,
  Research: FlaskConical,
  "User Profiles": User,
}

// Custom fuzzy matching & scoring algorithm
const getMatchScore = (item: SearchItem, query: string): number => {
  const q = query.toLowerCase().trim()
  if (!q) return 0

  const title = item.title.toLowerCase()
  const subtitle = (item.subtitle || "").toLowerCase()
  const tags = (item.tags || []).map((t) => t.toLowerCase())

  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (subtitle.includes(q)) return 40
  if (tags.some((t) => t.includes(q) || q.includes(t))) return 20

  // Fallback fuzzy: check if characters appear in sequence
  let queryIdx = 0
  for (let i = 0; i < title.length && queryIdx < q.length; i++) {
    if (title[i] === q[queryIdx]) {
      queryIdx++
    }
  }
  if (queryIdx === q.length) return 10

  return 0
}

// Highlight matched search queries
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return <span>{text}</span>
  const q = query.trim()

  const regex = new RegExp(`(${q.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded-[4px] bg-[oklch(0.646_0.222_41.116_/_0.2)] px-0.5 font-medium text-[oklch(0.646_0.222_41.116)] dark:bg-[oklch(0.769_0.188_70.08_/_0.25)] dark:text-[oklch(0.769_0.188_70.08)]"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

export function GlobalSearchTrigger() {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [isMac, setIsMac] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [recentSearches, setRecentSearches] = React.useState<SearchItem[]>([])

  const navigate = useNavigate()

  React.useEffect(() => {
    setMounted(true)
    setIsMac(/Mac/.test(navigator.platform))

    // Load recent searches
    const stored = localStorage.getItem("quild-recent-searches")
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        // ignore
      }
    }

    // Keyboard shortcut handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (item: SearchItem) => {
    // Save to recents
    const updated = [item, ...recentSearches.filter((x) => x.id !== item.id)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("quild-recent-searches", JSON.stringify(updated))

    // Parse queries if any
    if (item.path.includes("?")) {
      const [pathname, searchStr] = item.path.split("?")
      const searchParams: Record<string, string> = {}
      if (searchStr) {
        const pairs = searchStr.split("&")
        for (const pair of pairs) {
          const [k, v] = pair.split("=")
          if (k && v) {
            searchParams[k] = decodeURIComponent(v)
          }
        }
      }
      navigate({ to: pathname, search: searchParams })
    } else {
      navigate({ to: item.path })
    }

    setOpen(false)
    setQuery("")
  }

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.removeItem("quild-recent-searches")
  }

  const removeRecentItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = recentSearches.filter((x) => x.id !== id)
    setRecentSearches(updated)
    localStorage.setItem("quild-recent-searches", JSON.stringify(updated))
  }

  // Filter and score matching search database items
  const filteredItems = React.useMemo(() => {
    if (!query) return []
    return searchDatabase
      .map((item) => ({ item, score: getMatchScore(item, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item)
  }, [query])

  // Grouped search results
  const groupedResults = React.useMemo(() => {
    const groups: Record<SearchItem["category"], SearchItem[]> = {} as any
    for (const item of filteredItems) {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    }
    return groups
  }, [filteredItems])

  const categories = Object.keys(groupedResults) as SearchItem["category"][]

  return (
    <>
      {/* Visual Header Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-3 py-1.5 text-xs transition-all shadow-sm outline-none cursor-pointer",
          "border-[var(--sb-border)] bg-[var(--card-bg)] text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60"
        )}
      >
        <div className="flex items-center gap-2">
          <Search size={14} className="opacity-70" />
          <span>Search dashboard...</span>
        </div>
        {mounted && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[var(--sb-border)] bg-[var(--sb-bg-active)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--sb-ink-dim)]">
            {isMac ? "⌘" : "Ctrl "}K
          </kbd>
        )}
      </button>

      {/* Command Palette Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen} title="Global Search" description="Search dashboard routes, articles, problems, profiles, etc.">
        <CommandInput
          placeholder="Type to search courses, events, DSA, docs..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="border-t border-[var(--sb-border)]">
          <CommandEmpty>No results found for "{query}"</CommandEmpty>

          {/* ── Search History / Recent Searches ─────────────────────── */}
          {!query && recentSearches.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center justify-between">
                  <span>RECENT SEARCHES</span>
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-[9px] uppercase tracking-wider text-[oklch(0.577_0.245_27.325)] hover:underline outline-none cursor-pointer"
                  >
                    Clear history
                  </button>
                </div>
              }
            >
              {recentSearches.map((item) => {
                const IconComp = categoryIcons[item.category] || Search
                return (
                  <CommandItem
                    key={`recent-${item.id}`}
                    value={`recent-${item.title}-${item.category}`}
                    onSelect={() => handleSelect(item)}
                    className="group flex items-center justify-between px-3 py-2 cursor-pointer rounded-lg hover:bg-[var(--sb-bg-hover)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <History size={14} className="text-[var(--sb-ink-dim)]" />
                      <IconComp size={15} className="text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)]" />
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--sb-ink)]">{item.title}</span>
                        {item.subtitle && (
                          <span className="text-[11px] text-[var(--sb-ink-muted)] line-clamp-1">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-[var(--sb-border)] bg-[var(--sb-bg-active)] px-1.5 py-0.5 text-[10px] text-[var(--sb-ink-dim)]">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentItem(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded text-[var(--sb-ink-dim)] transition-opacity outline-none cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {/* ── Suggestions / Quick Links ────────────────────────────── */}
          {!query && (
            <CommandGroup heading="SUGGESTED CHANNELS">
              <CommandItem
                value="suggest-courses"
                onSelect={() => handleSelect(searchDatabase.find((x) => x.id === "course-dsa")!)}
                className="group flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg hover:bg-[var(--sb-bg-hover)]"
              >
                <BookOpen size={15} className="text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)]" />
                <span className="font-medium text-[var(--sb-ink)]">Browse Courses</span>
              </CommandItem>
              <CommandItem
                value="suggest-practice"
                onSelect={() => handleSelect(searchDatabase.find((x) => x.id === "dsa-two-sum")!)}
                className="group flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg hover:bg-[var(--sb-bg-hover)]"
              >
                <Code2 size={15} className="text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)]" />
                <span className="font-medium text-[var(--sb-ink)]">DSA Practice Problems</span>
              </CommandItem>
              <CommandItem
                value="suggest-docs"
                onSelect={() => handleSelect(searchDatabase.find((x) => x.id === "doc-tanstack-start")!)}
                className="group flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg hover:bg-[var(--sb-bg-hover)]"
              >
                <BookMarked size={15} className="text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)]" />
                <span className="font-medium text-[var(--sb-ink)]">Read Documentation</span>
              </CommandItem>
            </CommandGroup>
          )}

          {/* ── Category-wise Results ────────────────────────────────── */}
          {query &&
            categories.map((category) => (
              <CommandGroup key={category} heading={category.toUpperCase()}>
                {groupedResults[category].map((item) => {
                  const IconComp = categoryIcons[item.category] || Search
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.title}-${item.subtitle || ""}-${item.category}`}
                      onSelect={() => handleSelect(item)}
                      className="group flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-lg hover:bg-[var(--sb-bg-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp
                          size={16}
                          className="text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)] transition-colors"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--sb-ink)]">
                            {highlightText(item.title, query)}
                          </span>
                          {item.subtitle && (
                            <span className="text-[11px] text-[var(--sb-ink-muted)] line-clamp-1">
                              {highlightText(item.subtitle, query)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.tags && item.tags.length > 0 && (
                          <div className="hidden md:flex gap-1">
                            {item.tags.slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="rounded-md border border-[var(--sb-border)]/60 bg-[var(--sb-bg-active)]/50 px-1 py-0.5 text-[9px] text-[var(--sb-ink-dim)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="rounded-md border border-[var(--sb-border)] bg-[var(--sb-bg-active)] px-1.5 py-0.5 text-[10px] text-[var(--sb-ink-dim)] font-medium">
                          {category}
                        </span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
        </CommandList>

        {/* Command Palette Helper Footer */}
        <div className="flex items-center justify-between border-t border-[var(--sb-border)] px-4 py-2 text-[10px] text-[var(--sb-ink-dim)] bg-[var(--sb-bg-active)]/30">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--sb-border)] bg-[var(--sb-bg)] px-1 py-0.5 font-mono text-[9px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--sb-border)] bg-[var(--sb-bg)] px-1 py-0.5 font-mono text-[9px]">
                <CornerDownLeft size={8} className="inline" />
              </kbd>{" "}
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--sb-border)] bg-[var(--sb-bg)] px-1 py-0.5 font-mono text-[9px]">
                Esc
              </kbd>{" "}
              Close
            </span>
          </div>
          <span>Quild Engine Search</span>
        </div>
      </CommandDialog>
    </>
  )
}
