import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Copy,
  Edit2,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  type Difficulty,
  type LmsCourse,
  useDeleteLmsCourse,
  useLmsCourses,
  useLmsInstructors,
  useSaveLmsCourse,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

const searchSchema = z.object({
  tab: z.enum(["list", "roadmap"]).optional().catch("list"),
});

export const Route = createFileRoute("/_admin/learning/courses/")({
  validateSearch: (s) => searchSchema.parse(s),
  component: LmsCoursesPage,
});

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const colors: Record<Difficulty, string> = {
    Beginner: "bg-green-500/10 text-green-500",
    Intermediate: "bg-amber-500/10 text-amber-500",
    Advanced: "bg-red-500/10 text-red-500",
    Expert: "bg-purple-500/10 text-purple-500",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        colors[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-500",
    draft: "bg-zinc-500/10 text-zinc-400",
    archived: "bg-orange-500/10 text-orange-500",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        colors[status] ?? colors.draft,
      )}
    >
      {status}
    </span>
  );
}

const BLANK_COURSE: LmsCourse = {
  id: "",
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  thumbnail: "",
  banner: "",
  category: "Web Development",
  difficulty: "Beginner",
  durationWeeks: 4,
  estimatedHours: 16,
  outcomes: [],
  prerequisites: [],
  skillsGained: [],
  tags: [],
  status: "draft",
  instructorIds: [],
  certificateEnabled: false,
  studentsCount: 0,
  rating: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function LmsCoursesPage() {
  const { data: courses = [], isLoading } = useLmsCourses();
  const { data: instructors = [] } = useLmsInstructors();
  const saveCourse = useSaveLmsCourse();
  const deleteCourse = useDeleteLmsCourse();

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<LmsCourse>(BLANK_COURSE);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("Web Development");
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>("Beginner");
  const [formWeeks, setFormWeeks] = useState(4);
  const [formHours, setFormHours] = useState(16);
  const [formStatus, setFormStatus] = useState<
    "published" | "draft" | "archived"
  >("draft");
  const [formCertEnabled, setFormCertEnabled] = useState(false);
  const [formOutcomesRaw, setFormOutcomesRaw] = useState("");
  const [formPrereqsRaw, setFormPrereqsRaw] = useState("");
  const [formSkillsRaw, setFormSkillsRaw] = useState("");
  const [formTagsRaw, setFormTagsRaw] = useState("");
  const [formInstructorIds, setFormInstructorIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchDiff = !diffFilter || c.difficulty === diffFilter;
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchDiff && matchStatus;
    });
  }, [courses, search, diffFilter, statusFilter]);

  const openCreate = () => {
    setEditCourse(BLANK_COURSE);
    setFormTitle("");
    setFormSlug("");
    setFormSubtitle("");
    setFormDesc("");
    setFormCategory("Web Development");
    setFormDifficulty("Beginner");
    setFormWeeks(4);
    setFormHours(16);
    setFormStatus("draft");
    setFormCertEnabled(false);
    setFormOutcomesRaw("");
    setFormPrereqsRaw("");
    setFormSkillsRaw("");
    setFormTagsRaw("");
    setFormInstructorIds([]);
    setDrawerOpen(true);
  };

  const openEdit = (c: LmsCourse) => {
    setEditCourse(c);
    setFormTitle(c.title);
    setFormSlug(c.slug);
    setFormSubtitle(c.subtitle);
    setFormDesc(c.description);
    setFormCategory(c.category);
    setFormDifficulty(c.difficulty);
    setFormWeeks(c.durationWeeks);
    setFormHours(c.estimatedHours);
    setFormStatus(c.status);
    setFormCertEnabled(c.certificateEnabled);
    setFormOutcomesRaw(c.outcomes.join("\n"));
    setFormPrereqsRaw(c.prerequisites.join("\n"));
    setFormSkillsRaw(c.skillsGained.join("\n"));
    setFormTagsRaw(c.tags.join(", "));
    setFormInstructorIds(c.instructorIds);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const course: LmsCourse = {
      ...editCourse,
      id: editCourse.id || `c${Date.now()}`,
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/\s+/g, "-"),
      subtitle: formSubtitle,
      description: formDesc,
      category: formCategory,
      difficulty: formDifficulty,
      durationWeeks: formWeeks,
      estimatedHours: formHours,
      status: formStatus,
      certificateEnabled: formCertEnabled,
      outcomes: formOutcomesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      prerequisites: formPrereqsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      skillsGained: formSkillsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: formTagsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      instructorIds: formInstructorIds,
      updatedAt: new Date().toISOString(),
    };
    saveCourse.mutate(course, { onSuccess: () => setDrawerOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this course? This cannot be undone.")) {
      deleteCourse.mutate(id);
    }
  };

  const toggleInstructor = (id: string) => {
    setFormInstructorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Courses"
        description={`${courses.length} courses across ${new Set(courses.map((c) => c.category)).size} categories.`}
        icon={BookOpen}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Courses" },
        ]}
        actions={[
          {
            label: "New Course",
            onClick: openCreate,
            icon: Plus,
            variant: "default",
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--sb-ink-dim)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56 transition-all duration-150"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(
            [null, "Beginner", "Intermediate", "Advanced", "Expert"] as const
          ).map((d) => (
            <button
              key={d ?? "all"}
              type="button"
              onClick={() => setDiffFilter(d)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer active:scale-95"
              style={{
                background:
                  diffFilter === d
                    ? "color-mix(in oklab, var(--sb-ink) 10%, transparent)"
                    : "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color:
                  diffFilter === d ? "var(--sb-ink)" : "var(--sb-ink-muted)",
              }}
            >
              {d ?? "All"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {([null, "published", "draft", "archived"] as const).map((s) => (
            <button
              key={s ?? "all"}
              type="button"
              onClick={() => setStatusFilter(s)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all duration-150 cursor-pointer active:scale-95"
              style={{
                background:
                  statusFilter === s
                    ? "color-mix(in oklab, var(--sb-ink) 10%, transparent)"
                    : "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color:
                  statusFilter === s ? "var(--sb-ink)" : "var(--sb-ink-muted)",
              }}
            >
              {s ?? "All Statuses"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          className="island-shell rounded-xl p-8 text-center text-xs"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          Loading courses…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search or filters."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setDiffFilter(null);
              setStatusFilter(null);
            },
          }}
        />
      ) : (
        <div className="island-shell rounded-xl overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--sb-border)",
                  background:
                    "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                }}
              >
                {[
                  "Course",
                  "Category",
                  "Difficulty",
                  "Instructors",
                  "Students",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const courseInstructors = instructors.filter((i) =>
                  course.instructorIds.includes(i.id),
                );
                return (
                  <tr
                    key={course.id}
                    className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors duration-100"
                    style={{ borderBottom: "1px solid var(--sb-border)" }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-8 items-center justify-center rounded-lg border text-sm shrink-0"
                          style={{
                            background:
                              "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                            borderColor: "var(--sb-border)",
                            color: "var(--sb-ink-muted)",
                          }}
                        >
                          <BookOpen size={14} />
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span
                            className="font-semibold truncate max-w-[200px]"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {course.title}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            /{course.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {course.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <DifficultyBadge difficulty={course.difficulty} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        {courseInstructors.length === 0 ? (
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            Unassigned
                          </span>
                        ) : (
                          courseInstructors.map((i) => (
                            <span
                              key={i.id}
                              className="text-[10px] font-medium"
                              style={{ color: "var(--sb-ink-muted)" }}
                            >
                              {i.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        <Users size={11} />
                        <span>{course.studentsCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusChip status={course.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer transition-all duration-100 hover:bg-(--sb-bg-hover) active:scale-95 mx-auto"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44"
                          style={{
                            background: "var(--sb-bg)",
                            border: "1px solid var(--sb-border)",
                          }}
                        >
                          <DropdownMenuItem
                            className="text-xs cursor-pointer gap-2"
                            onClick={() => openEdit(course)}
                          >
                            <Edit2 size={12} /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer gap-2">
                            <Eye size={12} /> Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer gap-2">
                            <Copy size={12} /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs cursor-pointer gap-2 text-red-500"
                            onClick={() => handleDelete(course.id)}
                          >
                            <Trash2 size={12} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close drawer"
          />
          <div
            className="w-[520px] h-full flex flex-col overflow-hidden border-l"
            style={{
              background: "var(--sb-bg)",
              borderColor: "var(--sb-border)",
            }}
          >
            {/* Drawer Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-7 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
                  }}
                >
                  <BookOpen
                    size={14}
                    style={{ color: "var(--sb-ink-muted)" }}
                  />
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {editCourse.id ? "Edit Course" : "New Course"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-(--sb-bg-hover) cursor-pointer active:scale-95 transition-all"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
              {/* Title & Slug */}
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Course Title</span>
                <input
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editCourse.id)
                      setFormSlug(
                        e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      );
                  }}
                  placeholder="E.g. Complete JavaScript Mastery"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Slug</span>
                <input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="js-mastery"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Subtitle</span>
                <input
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Short tagline"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Description</span>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Full course description…"
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Category</span>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    {[
                      "Web Development",
                      "Data Science",
                      "Software Engineering",
                      "Mobile Development",
                      "AI & ML",
                      "DevOps",
                      "Systems",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Difficulty</span>
                  <select
                    value={formDifficulty}
                    onChange={(e) =>
                      setFormDifficulty(e.target.value as Difficulty)
                    }
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    {(
                      [
                        "Beginner",
                        "Intermediate",
                        "Advanced",
                        "Expert",
                      ] as Difficulty[]
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Duration (weeks)</span>
                  <input
                    type="number"
                    value={formWeeks}
                    onChange={(e) => setFormWeeks(Number(e.target.value))}
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Estimated Hours</span>
                  <input
                    type="number"
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
              </div>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Status</span>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(
                      e.target.value as "published" | "draft" | "archived",
                    )
                  }
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Learning Outcomes (one per line)</span>
                <textarea
                  value={formOutcomesRaw}
                  onChange={(e) => setFormOutcomesRaw(e.target.value)}
                  placeholder={
                    "Build full-stack apps\nUnderstand async patterns"
                  }
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Prerequisites (one per line)</span>
                <textarea
                  value={formPrereqsRaw}
                  onChange={(e) => setFormPrereqsRaw(e.target.value)}
                  placeholder={"Basic HTML/CSS\nJavaScript fundamentals"}
                  rows={2}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Skills Gained (one per line)</span>
                <textarea
                  value={formSkillsRaw}
                  onChange={(e) => setFormSkillsRaw(e.target.value)}
                  placeholder={"JavaScript\nTypeScript\nReact"}
                  rows={2}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Tags (comma-separated)</span>
                <input
                  value={formTagsRaw}
                  onChange={(e) => setFormTagsRaw(e.target.value)}
                  placeholder="javascript, web, beginner"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              {/* Instructor Assignment */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                  Assign Instructors
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {instructors.map((ins) => {
                    const selected = formInstructorIds.includes(ins.id);
                    return (
                      <button
                        key={ins.id}
                        type="button"
                        onClick={() => toggleInstructor(ins.id)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border text-left transition-all active:scale-[0.98] cursor-pointer",
                          selected
                            ? "border-indigo-500 bg-indigo-500/[0.03] text-indigo-500"
                            : "hover:border-(--sb-ink-dim)",
                        )}
                        style={{
                          borderColor: selected
                            ? undefined
                            : "var(--sb-border)",
                        }}
                      >
                        <span className="size-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-[9px] shrink-0">
                          {ins.name.charAt(0)}
                        </span>
                        <span
                          className="text-[10px] font-medium truncate"
                          style={{
                            color: selected ? undefined : "var(--sb-ink)",
                          }}
                        >
                          {ins.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certificate Toggle */}
              <label
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <input
                  type="checkbox"
                  checked={formCertEnabled}
                  onChange={(e) => setFormCertEnabled(e.target.checked)}
                  className="rounded"
                />
                <div>
                  <div
                    className="text-[11px] font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <Award size={12} />
                    Enable Completion Certificate
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    Auto-issue certificates when students complete this course
                  </div>
                </div>
              </label>
            </div>

            {/* Drawer Footer */}
            <div
              className="px-5 py-4 border-t flex items-center gap-3 shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleSave}
                disabled={!formTitle.trim() || saveCourse.isPending}
                className="flex-1 active:scale-[0.98]"
              >
                {saveCourse.isPending
                  ? "Saving…"
                  : editCourse.id
                    ? "Update Course"
                    : "Create Course"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDrawerOpen(false)}
                className="active:scale-[0.98]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
