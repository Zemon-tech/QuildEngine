import { CheckCircle2, Circle, Clock, ExternalLink, Star } from "lucide-react";
import type { DSAProblem } from "#/lib/dsa-problems-db";

interface ProblemTableProps {
  problems: DSAProblem[];
  onToggleStatus: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProblem: (problem: DSAProblem) => void;
}

export function ProblemTable({
  problems,
  onToggleStatus,
  onToggleBookmark,
  onSelectProblem,
}: ProblemTableProps) {
  return (
    <div
      className="w-full overflow-clip rounded-2xl border shadow-sm transition-all"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full border-collapse text-left text-xs table-fixed">
          <thead>
            <tr
              className="border-b font-semibold uppercase tracking-wider"
              style={{
                borderColor: "var(--sb-border)",
                color: "var(--sb-ink-dim)",
                background: "var(--card-bg)",
              }}
            >
              <th className="py-4 pl-5 pr-2 text-center w-14 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Status</th>
              <th className="py-4 px-4 font-bold w-[40%] min-w-[200px] md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Problem Name</th>
              <th className="py-4 px-4 w-24 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Difficulty</th>
              <th className="py-4 px-4 w-28 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Acceptance</th>
              <th className="py-4 px-4 hidden lg:table-cell w-56 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">
                Companies
              </th>
              <th className="py-4 px-4 hidden md:table-cell w-40 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Tags</th>
              <th className="py-4 pr-5 pl-2 text-center w-14 md:sticky md:top-[152px] z-10 bg-[var(--card-bg)] whitespace-nowrap">Book</th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--sb-border)" }}
          >
            {problems.length === 0 ? (
               <tr>
                <td colSpan={7} className="py-12 text-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    No problems found matching the selected criteria.
                  </p>
                </td>
              </tr>
            ) : (
              problems.map((prob) => (
                <tr
                  key={prob.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group cursor-pointer"
                  onClick={() => onSelectProblem(prob)}
                >
                  {/* Status Toggle Column */}
                  <td className="py-4 pl-5 pr-2 text-center w-14 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering row click details
                        onToggleStatus(prob.id);
                      }}
                      className="inline-flex size-6 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Click to toggle status (Solved -> Attempted -> Unsolved)"
                    >
                      {prob.status === "completed" ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : prob.status === "in_progress" ? (
                        <Clock size={16} className="text-amber-500" />
                      ) : (
                        <Circle
                          size={16}
                          className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400"
                        />
                      )}
                    </button>
                  </td>

                  {/* Problem Name & Subcategory Column */}
                  <td className="py-4 px-4 w-[40%] min-w-[200px] overflow-hidden whitespace-nowrap">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <div
                        className="flex items-center gap-1.5 font-semibold text-xs group-hover:text-[var(--sb-accent)] transition-colors overflow-hidden"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        <span>{prob.name}</span>
                        <ExternalLink
                          size={11}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sb-accent)] shrink-0"
                        />
                      </div>
                      <span
                        className="text-[10px] truncate"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        {prob.subCategory}
                      </span>
                    </div>
                  </td>

                  {/* Difficulty Badge Column */}
                  <td className="py-4 px-4 w-24 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border whitespace-nowrap`}
                      style={{
                        backgroundColor:
                          prob.difficulty === "Easy"
                            ? "oklch(0.85 0.15 145 / 0.15)"
                            : prob.difficulty === "Medium"
                              ? "oklch(0.85 0.15 75 / 0.15)"
                              : "oklch(0.85 0.15 30 / 0.15)",
                        color:
                          prob.difficulty === "Easy"
                            ? "oklch(0.65 0.18 145)"
                            : prob.difficulty === "Medium"
                              ? "oklch(0.65 0.18 75)"
                              : "oklch(0.65 0.18 30)",
                        borderColor:
                          prob.difficulty === "Easy"
                            ? "oklch(0.65 0.18 145 / 0.25)"
                            : prob.difficulty === "Medium"
                              ? "oklch(0.65 0.18 75 / 0.25)"
                              : "oklch(0.65 0.18 30 / 0.25)",
                      }}
                    >
                      {prob.difficulty}
                    </span>
                  </td>

                  {/* Acceptance Rate Column */}
                  <td
                    className="py-4 px-4 w-28 font-medium whitespace-nowrap"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    {prob.acceptance}%
                  </td>

                  {/* Companies Column */}
                  <td className="py-4 px-4 hidden lg:table-cell w-56 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap max-w-[200px] pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                      {prob.companies?.map((comp) => {
                        const colors: Record<
                          string,
                          { bg: string; text: string; border: string }
                        > = {
                          Google: {
                            bg: "oklch(0.9 0.05 240 / 0.1)",
                            text: "oklch(0.65 0.15 240)",
                            border: "oklch(0.65 0.15 240 / 0.2)",
                          },
                          Amazon: {
                            bg: "oklch(0.9 0.05 70 / 0.1)",
                            text: "oklch(0.65 0.15 70)",
                            border: "oklch(0.65 0.15 70 / 0.2)",
                          },
                          Meta: {
                            bg: "oklch(0.9 0.05 250 / 0.1)",
                            text: "oklch(0.65 0.15 250)",
                            border: "oklch(0.65 0.15 250 / 0.2)",
                          },
                          Microsoft: {
                            bg: "oklch(0.9 0.05 180 / 0.1)",
                            text: "oklch(0.65 0.15 180)",
                            border: "oklch(0.65 0.15 180 / 0.2)",
                          },
                          Uber: {
                            bg: "oklch(0.9 0 0 / 0.1)",
                            text: "oklch(0.7 0 0)",
                            border: "oklch(0.7 0 0 / 0.2)",
                          },
                          Atlassian: {
                            bg: "oklch(0.9 0.05 220 / 0.1)",
                            text: "oklch(0.65 0.15 220)",
                            border: "oklch(0.65 0.15 220 / 0.2)",
                          },
                        };
                        const style = colors[comp] || {
                          bg: "oklch(1 0 0 / 0.04)",
                          text: "var(--sb-ink-dim)",
                          border: "oklch(1 0 0 / 0.08)",
                        };
                        return (
                          <span
                            key={comp}
                            className="rounded px-1.5 py-0.5 text-[10px] font-semibold border whitespace-nowrap"
                            style={{
                              backgroundColor: style.bg,
                              color: style.text,
                              borderColor: style.border,
                            }}
                          >
                            {comp}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Tags Badges Column (Hidden on mobile) */}
                  <td className="py-4 px-4 hidden md:table-cell w-40 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-0.5 overflow-x-auto whitespace-nowrap max-w-[150px] pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                      {prob.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded px-1.5 py-0.5 text-[9px] font-medium whitespace-nowrap"
                          style={{
                            background: "oklch(1 0 0 / 0.04)",
                            border: "1px solid oklch(1 0 0 / 0.08)",
                            color: "var(--sb-ink-dim)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Bookmark Toggle Column */}
                  <td className="py-4 pr-5 pl-2 text-center w-14 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering row click details
                        onToggleBookmark(prob.id);
                      }}
                      className="inline-flex size-6 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Click to bookmark/star problem"
                    >
                      <Star
                        size={14}
                        className={
                          prob.bookmarked
                            ? "fill-amber-400 stroke-amber-500"
                            : "text-zinc-300 dark:text-zinc-600 hover:text-amber-400 transition-colors"
                        }
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
