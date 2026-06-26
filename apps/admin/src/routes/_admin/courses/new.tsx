import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  Plus,
  Save,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/courses/new")({
  component: NewCoursePage,
});

function NewCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [hours, setHours] = useState("");
  const [lessons, setLessons] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mimic backend delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate({ to: "/courses" });
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Create Course"
        description="Design a new learning curriculum and add it to the platform."
        icon={Plus}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Courses", to: "/courses" },
          { label: "New" },
        ]}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
      >
        {/* Main fields (Left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="island-shell rounded-xl p-6 flex flex-col gap-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Course Details
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Course Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Master Object Oriented Design Patterns"
                className={cn(
                  "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                )}
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="slug"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                URL Slug
              </label>
              <div className="relative flex items-center">
                <span
                  className="absolute left-3 text-[10px]"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  quild.in/courses/
                </span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="master-design-patterns"
                  className={cn(
                    "w-full rounded-[10px] pl-[92px] pr-3 py-2 text-xs outline-none transition-all duration-150",
                    "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                  )}
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                    border: "1px solid var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="headline"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Short Subtitle / Headline
              </label>
              <input
                id="headline"
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                placeholder="e.g. A comprehensive guide to building extensible, clean software."
                className={cn(
                  "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                )}
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="description"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Detailed Description
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe what students will learn, target audience, prerequisites, etc."
                className={cn(
                  "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150 resize-none",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                )}
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right 1 col) */}
        <div className="flex flex-col gap-5">
          <div className="island-shell rounded-xl p-5 flex flex-col gap-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Publishing Options
            </h2>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="category"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[10px] px-2.5 py-2 text-xs outline-none cursor-pointer"
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="System Design">System Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Systems Programming">Systems Programming</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="difficulty"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-[10px] px-2.5 py-2 text-xs outline-none cursor-pointer"
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Instructor */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="instructor"
                className="text-xs font-semibold"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                Instructor Name
              </label>
              <input
                id="instructor"
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                required
                placeholder="e.g. Dr. Emily Smith"
                className={cn(
                  "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                )}
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            {/* Hours and Lessons (Grid) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="hours"
                  className="text-xs font-semibold"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  Est. Hours
                </label>
                <input
                  id="hours"
                  type="number"
                  min="1"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                  placeholder="30"
                  className={cn(
                    "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                    "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                  )}
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                    border: "1px solid var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="lessons"
                  className="text-xs font-semibold"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  Lessons
                </label>
                <input
                  id="lessons"
                  type="number"
                  min="1"
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  required
                  placeholder="24"
                  className={cn(
                    "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                    "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                  )}
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                    border: "1px solid var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 active:scale-95"
              onClick={() => navigate({ to: "/courses" })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 active:scale-95"
            >
              {loading ? "Creating..." : "Save Course"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
