import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProblemFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  subtopic: string;
  onSubtopicChange: (value: string) => void;
  company: string;
  onCompanyChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  availableSubtopics: string[];
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  icon?: React.ElementType;
}

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 active:scale-[0.98] transition-all cursor-pointer select-none"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--sb-border)",
          color: "var(--sb-ink)",
        }}
      >
        {Icon && <Icon size={13} className="text-[var(--sb-accent)]" />}
        <span style={{ color: "var(--sb-ink-dim)" }}>{label}:</span>
        <span style={{ color: "var(--sb-ink)" }}>{activeOption.label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1.5 z-45 rounded-xl border p-1 shadow-lg min-w-[160px] flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
            boxShadow: "var(--sb-shadow)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/40 cursor-pointer select-none"
              style={{
                color:
                  opt.value === value
                    ? "var(--sb-accent)"
                    : "var(--sb-ink-muted)",
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <Check size={13} className="text-[var(--sb-accent)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProblemFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  subtopic,
  onSubtopicChange,
  company,
  onCompanyChange,
  sortBy,
  onSortByChange,
  availableSubtopics,
}: ProblemFiltersProps) {
  const isAnyFilterActive =
    difficulty !== "All" ||
    status !== "All" ||
    subtopic !== "All" ||
    company !== "All" ||
    search !== "";

  const handleClearFilters = () => {
    onSearchChange("");
    onDifficultyChange("All");
    onStatusChange("All");
    onSubtopicChange("All");
    onCompanyChange("All");
  };

  const difficultyOptions = [
    { label: "All", value: "All" },
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ];

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Solved", value: "completed" },
    { label: "Attempted", value: "in_progress" },
    { label: "Unsolved", value: "not_started" },
  ];

  const subtopicOptions = [
    { label: "All", value: "All" },
    ...availableSubtopics.map((sub) => ({ label: sub, value: sub })),
  ];

  const companyOptions = [
    { label: "All Companies", value: "All" },
    { label: "Google", value: "Google" },
    { label: "Amazon", value: "Amazon" },
    { label: "Meta", value: "Meta" },
    { label: "Microsoft", value: "Microsoft" },
    { label: "Uber", value: "Uber" },
    { label: "Atlassian", value: "Atlassian" },
  ];

  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Difficulty", value: "difficulty" },
    { label: "Acceptance", value: "acceptance" },
    { label: "Status", value: "status" },
  ];

  return (
    <div
      className="flex flex-col gap-4 border-b pb-5 sticky top-[18px] z-40 bg-[var(--background)]/95 backdrop-blur-md pt-[24px] -mt-[24px]"
      style={{ borderColor: "var(--sb-border)" }}
    >
      {/* Upper row: Search and Sorting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--sb-ink-dim)" }}
          />
          <input
            type="text"
            placeholder="Search problems by name or tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-8 py-2.5 text-xs outline-none transition-all focus:border-[var(--sb-accent)] focus:ring-1 focus:ring-[var(--sb-accent)]/20"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X size={12} style={{ color: "var(--sb-ink-dim)" }} />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="self-end sm:self-auto">
          <CustomDropdown
            label="Sort by"
            value={sortBy}
            options={sortOptions}
            onChange={onSortByChange}
            icon={ArrowUpDown}
          />
        </div>
      </div>

      {/* Lower row: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          <Filter size={13} />
          <span>Filters:</span>
        </div>

        {/* Difficulty Filter */}
        <CustomDropdown
          label="Difficulty"
          value={difficulty}
          options={difficultyOptions}
          onChange={onDifficultyChange}
        />

        {/* Status Filter */}
        <CustomDropdown
          label="Status"
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
        />

        {/* Subtopic Category Filter */}
        <CustomDropdown
          label="Subcategory"
          value={subtopic}
          options={subtopicOptions}
          onChange={onSubtopicChange}
        />

        {/* Company Filter */}
        <CustomDropdown
          label="Company"
          value={company}
          options={companyOptions}
          onChange={onCompanyChange}
        />

        {/* Clear Filters Button */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs font-bold text-[var(--sb-accent)] hover:opacity-80 active:scale-95 transition-all cursor-pointer pl-1.5"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
