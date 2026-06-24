import { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { Input } from "../ui/input";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  onSelectCategory?: (id: string) => void;
}

interface SuggestionItem {
  id: string;
  title: string;
  type: "roadmap" | "topic" | "resource";
  categoryName: string;
  urlParams?: { id: string };
  nodeId?: string;
}

// Global Static search dictionary of topics/resources from MOCK data
const SEARCH_DATABASE: SuggestionItem[] = [
  { id: "frontend", title: "Frontend Developer Roadmap", type: "roadmap", categoryName: "Frontend", urlParams: { id: "frontend" } },
  { id: "backend", title: "Backend Developer Roadmap", type: "roadmap", categoryName: "Backend", urlParams: { id: "backend" } },
  { id: "ai-ml", title: "AI / ML Engineer Roadmap", type: "roadmap", categoryName: "AI / ML", urlParams: { id: "ai-ml" } },
  
  // Topics & chapters
  { id: "fe-html-css", title: "HTML & CSS Basics", type: "topic", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-html-css" },
  { id: "fe-javascript", title: "JavaScript ES6+ and Async Core", type: "topic", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-javascript" },
  { id: "fe-react", title: "React Fundamentals & Hooks", type: "topic", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-react" },
  { id: "fe-nextjs", title: "Next.js SSR/SSG App Router", type: "topic", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-nextjs" },
  { id: "be-db", title: "Databases, Schema Design, and Indexing", type: "topic", categoryName: "Backend", urlParams: { id: "backend" }, nodeId: "be-db" },
  { id: "be-cache", title: "Caching Layers & Redis Architecture", type: "topic", categoryName: "Backend", urlParams: { id: "backend" }, nodeId: "be-cache" },
  { id: "ai-pytorch", title: "PyTorch & Deep Neural Networks", type: "topic", categoryName: "AI / ML", urlParams: { id: "ai-ml" }, nodeId: "ai-pytorch" },
  { id: "ai-transformers", title: "Transformers, Self-Attention & LLMs", type: "topic", categoryName: "AI / ML", urlParams: { id: "ai-ml" }, nodeId: "ai-transformers" },
  
  // Resources
  { id: "res-1", title: "Official React Hooks Documentation", type: "resource", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-react" },
  { id: "res-2", title: "Next.js Server Actions Guide", type: "resource", categoryName: "Frontend", urlParams: { id: "frontend" }, nodeId: "fe-nextjs" },
  { id: "res-3", title: "Redis Pub/Sub & Memory Structures Guide", type: "resource", categoryName: "Backend", urlParams: { id: "backend" }, nodeId: "be-cache" },
  { id: "res-4", title: "LLM Fine-Tuning with LoRA & QLoRA Lab", type: "resource", categoryName: "AI / ML", urlParams: { id: "ai-ml" }, nodeId: "ai-finetune" },
];

export function SearchBar({ onSelectCategory }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quild_roadmap_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (_) {}
      }
    }
  }, []);

  // Debounce search updates
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const lower = query.toLowerCase();
      const filtered = SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.categoryName.toLowerCase().includes(lower)
      ).slice(0, 5); // limit to 5 matches
      setSuggestions(filtered);
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close search
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const addRecentSearch = (searchText: string) => {
    if (!searchText.trim()) return;
    const filtered = [searchText, ...recentSearches.filter((s) => s !== searchText)].slice(0, 3);
    setRecentSearches(filtered);
    localStorage.setItem("quild_roadmap_recent_searches", JSON.stringify(filtered));
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
    addRecentSearch(item.title);
    setQuery("");
    setShowSuggestions(false);
    if (onSelectCategory && item.urlParams?.id) {
      onSelectCategory(item.urlParams.id);
    }
  };

  const highlightMatch = (text: string, sub: string) => {
    if (!sub) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${sub})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === sub.toLowerCase() ? (
            <span key={i} className="text-[var(--sb-accent)] font-bold bg-[var(--sb-accent)]/10 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-40">
      <div className="relative flex items-center">
        <Icons.Search className="absolute left-3.5 size-4 text-[var(--sb-ink-dim)] pointer-events-none" />
        <Input
          type="text"
          placeholder="Search roadmaps, topics, or resources..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className={cn(
            "w-full h-11 pl-10 pr-4 text-sm rounded-xl transition-all duration-200 bg-[var(--card-bg)] border border-[var(--card-border)]",
            "focus-visible:ring-1 focus-visible:ring-[var(--sb-accent)] focus-visible:border-[var(--sb-accent)] focus-visible:outline-none"
          )}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 p-1 rounded-full text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]"
          >
            <Icons.X size={14} />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {showSuggestions && (query || recentSearches.length > 0) && (
        <div
          className="absolute w-full mt-2 rounded-xl p-2 shadow-2xl border border-[var(--card-border)] backdrop-blur-md flex flex-col gap-1 page-enter"
          style={{
            background: "rgba(var(--card-bg-rgb), 0.95)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="px-3 py-1.5 border-b border-[var(--card-border)]/50 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] flex items-center gap-1.5">
                <Icons.History size={11} />
                Recent Searches
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(s);
                      setShowSuggestions(true);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-[var(--card-border)] bg-[var(--page-bg)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] hover:border-[var(--sb-accent)]/30 active:scale-95 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions List */}
          {query && suggestions.length === 0 && (
            <div className="px-4 py-3 text-center text-xs text-[var(--sb-ink-dim)]">
              No matching topics or guides found.
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="py-1">
              <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[var(--sb-ink-dim)] block mb-1">
                Suggested Matches
              </span>
              {suggestions.map((item) => {
                const linkSearch = item.nodeId ? { id: item.id, node: item.nodeId } : { id: item.id };
                
                return (
                  <Link
                    key={item.id}
                    to="/learn/roadmaps"
                    search={linkSearch}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--sb-bg-hover)] text-left transition-colors duration-150 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--page-bg)] border border-[var(--card-border)] text-[var(--sb-ink-muted)] group-hover:text-[var(--sb-accent)] transition-colors">
                        {item.type === "roadmap" && <Icons.Map size={13} />}
                        {item.type === "topic" && <Icons.Layers size={13} />}
                        {item.type === "resource" && <Icons.ExternalLink size={13} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-[var(--sb-ink)] group-hover:text-[var(--sb-accent)] transition-colors">
                          {highlightMatch(item.title, query)}
                        </p>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] truncate mt-0.5">
                          {item.categoryName} · {item.type}
                        </p>
                      </div>
                    </div>
                    <Icons.ChevronRight size={13} className="text-[var(--sb-ink-dim)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
