import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Clock,
  Copy,
  Edit2,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
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
  type LmsTutorial,
  useDeleteLmsTutorial,
  useLmsTutorials,
  useSaveLmsTutorial,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

const searchSchema = z.object({
  tab: z.enum(["list", "editor"]).optional().catch("list"),
});

export const Route = createFileRoute("/_admin/learning/tutorials/")({
  validateSearch: (s) => searchSchema.parse(s),
  component: TutorialsPage,
});

const BLANK: LmsTutorial = {
  id: "",
  title: "",
  slug: "",
  content: "# New Tutorial\n\nStart writing your content here…",
  category: "Web Development",
  tags: [],
  difficulty: "Beginner",
  readingTime: 5,
  author: "",
  status: "draft",
  aiSummary: "",
  aiObjectives: [],
  aiSeoDescription: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function StatusChip({ status }: { status: string }) {
  const m: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-500",
    draft: "bg-zinc-500/10 text-zinc-400",
    archived: "bg-orange-500/10 text-orange-500",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
        m[status] ?? m.draft,
      )}
    >
      {status}
    </span>
  );
}

function DiffBadge({ d }: { d: Difficulty }) {
  const m: Record<Difficulty, string> = {
    Beginner: "text-green-500",
    Intermediate: "text-amber-500",
    Advanced: "text-red-500",
    Expert: "text-purple-500",
  };
  return <span className={cn("text-[10px] font-semibold", m[d])}>{d}</span>;
}

function renderMarkdownPreview(md: string) {
  return md.split("\n").map((line, idx) => {
    if (line.startsWith("# "))
      return (
        <h1
          key={idx}
          className="text-lg font-bold mb-2 mt-4"
          style={{ color: "var(--sb-ink)" }}
        >
          {line.slice(2)}
        </h1>
      );
    if (line.startsWith("## "))
      return (
        <h2
          key={idx}
          className="text-base font-semibold mb-1.5 mt-3"
          style={{ color: "var(--sb-ink)" }}
        >
          {line.slice(3)}
        </h2>
      );
    if (line.startsWith("### "))
      return (
        <h3
          key={idx}
          className="text-sm font-semibold mb-1 mt-2"
          style={{ color: "var(--sb-ink)" }}
        >
          {line.slice(4)}
        </h3>
      );
    if (line.startsWith("- "))
      return (
        <li
          key={idx}
          className="ml-4 text-xs list-disc mb-0.5"
          style={{ color: "var(--sb-ink-muted)" }}
        >
          {line.slice(2)}
        </li>
      );
    if (line.trim() === "") return <br key={idx} />;
    return (
      <p
        key={idx}
        className="text-xs mb-1.5 leading-relaxed"
        style={{ color: "var(--sb-ink-muted)" }}
      >
        {line}
      </p>
    );
  });
}

function TutorialsPage() {
  const { data: tutorials = [], isLoading } = useLmsTutorials();
  const saveTutorial = useSaveLmsTutorial();
  const deleteTutorial = useDeleteLmsTutorial();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [edit, setEdit] = useState<LmsTutorial>(BLANK);

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formContent, setFormContent] = useState(BLANK.content);
  const [formCategory, setFormCategory] = useState("Web Development");
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>("Beginner");
  const [formReadingTime, setFormReadingTime] = useState(5);
  const [formAuthor, setFormAuthor] = useState("");
  const [formStatus, setFormStatus] = useState<
    "published" | "draft" | "archived"
  >("draft");
  const [formTagsRaw, setFormTagsRaw] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiObjectives, setAiObjectives] = useState<string[]>([]);
  const [aiSeo, setAiSeo] = useState("");
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const filtered = tutorials.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(q) ||
      t.author.toLowerCase().includes(q);
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEdit(BLANK);
    setFormTitle("");
    setFormSlug("");
    setFormContent(BLANK.content);
    setFormCategory("Web Development");
    setFormDifficulty("Beginner");
    setFormReadingTime(5);
    setFormAuthor("");
    setFormStatus("draft");
    setFormTagsRaw("");
    setAiSummary("");
    setAiObjectives([]);
    setAiSeo("");
    setPreviewMode(false);
    setDrawerOpen(true);
  };

  const openEdit = (t: LmsTutorial) => {
    setEdit(t);
    setFormTitle(t.title);
    setFormSlug(t.slug);
    setFormContent(t.content);
    setFormCategory(t.category);
    setFormDifficulty(t.difficulty);
    setFormReadingTime(t.readingTime);
    setFormAuthor(t.author);
    setFormStatus(t.status);
    setFormTagsRaw(t.tags.join(", "));
    setAiSummary(t.aiSummary);
    setAiObjectives(t.aiObjectives);
    setAiSeo(t.aiSeoDescription);
    setPreviewMode(false);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const tutorial: LmsTutorial = {
      ...edit,
      id: edit.id || `tu${Date.now()}`,
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/\s+/g, "-"),
      content: formContent,
      category: formCategory,
      difficulty: formDifficulty,
      readingTime: formReadingTime,
      author: formAuthor,
      status: formStatus,
      tags: formTagsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      aiSummary,
      aiObjectives,
      aiSeoDescription: aiSeo,
      updatedAt: new Date().toISOString(),
    };
    saveTutorial.mutate(tutorial, { onSuccess: () => setDrawerOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this tutorial?")) deleteTutorial.mutate(id);
  };

  const simulateAi = (type: "summary" | "objectives" | "seo" | "tags") => {
    setAiLoading(type);
    setTimeout(() => {
      if (type === "summary")
        setAiSummary(
          `An in-depth exploration of ${formTitle || "this topic"}, covering key concepts and practical applications for developers.`,
        );
      if (type === "objectives")
        setAiObjectives([
          `Understand core concepts of ${formTitle || "the topic"}`,
          "Apply knowledge in real-world projects",
          "Identify best practices and common pitfalls",
        ]);
      if (type === "seo")
        setAiSeo(
          `Learn ${formTitle || "this topic"} with comprehensive examples. Perfect for ${formDifficulty.toLowerCase()} developers looking to level up their skills.`,
        );
      if (type === "tags")
        setFormTagsRaw(
          `${formCategory.toLowerCase().replace(" ", "-")}, tutorial, ${formDifficulty.toLowerCase()}`,
        );
      setAiLoading(null);
    }, 1200);
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Tutorials"
        description={`${tutorials.length} tutorials — ${tutorials.filter((t) => t.status === "published").length} published.`}
        icon={Video}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Tutorials" },
        ]}
        actions={[
          {
            label: "New Tutorial",
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
            placeholder="Search tutorials…"
            className="pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {([null, "published", "draft", "archived"] as const).map((s) => (
            <button
              key={s ?? "all"}
              type="button"
              onClick={() => setStatusFilter(s)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all cursor-pointer active:scale-95"
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
              {s ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          className="island-shell rounded-xl p-8 text-center text-xs"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No tutorials found"
          description="Create your first tutorial."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
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
                  "Tutorial",
                  "Author",
                  "Category",
                  "Difficulty",
                  "Reading Time",
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
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors duration-100"
                  style={{ borderBottom: "1px solid var(--sb-border)" }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-7 items-center justify-center rounded-lg shrink-0"
                        style={{
                          background:
                            "color-mix(in oklab, var(--sb-ink) 5%, transparent)",
                          color: "var(--sb-ink-muted)",
                        }}
                      >
                        <FileText size={12} />
                      </span>
                      <div>
                        <div
                          className="font-semibold"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {t.title}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          /{t.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3.5"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    {t.author}
                  </td>
                  <td
                    className="px-4 py-3.5"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    {t.category}
                  </td>
                  <td className="px-4 py-3.5">
                    <DiffBadge d={t.difficulty} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div
                      className="flex items-center gap-1"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      <Clock size={11} />
                      <span>{t.readingTime} min</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusChip status={t.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer hover:bg-[var(--sb-bg-hover)] active:scale-95 mx-auto"
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
                          onClick={() => openEdit(t)}
                        >
                          <Edit2 size={12} /> Edit
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
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
          />
          <div
            className="w-[640px] h-full flex flex-col border-l overflow-hidden"
            style={{
              background: "var(--sb-bg)",
              borderColor: "var(--sb-border)",
            }}
          >
            {/* Header */}
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
                  <Video size={14} style={{ color: "var(--sb-ink-muted)" }} />
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {edit.id ? "Edit Tutorial" : "New Tutorial"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer hover:bg-[var(--sb-bg-hover)] active:scale-95 transition-all"
                  style={{
                    color: "var(--sb-ink-muted)",
                    border: "1px solid var(--sb-border)",
                  }}
                >
                  <Eye size={12} /> {previewMode ? "Editor" : "Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="size-7 flex items-center justify-center rounded-lg hover:bg-[var(--sb-bg-hover)] cursor-pointer active:scale-95 transition-all"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {previewMode ? (
                <div className="p-6 prose prose-sm max-w-none">
                  {renderMarkdownPreview(formContent)}
                </div>
              ) : (
                <div className="p-5 space-y-4 text-xs">
                  <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                    <span>Title</span>
                    <input
                      value={formTitle}
                      onChange={(e) => {
                        setFormTitle(e.target.value);
                        if (!edit.id)
                          setFormSlug(
                            e.target.value.toLowerCase().replace(/\s+/g, "-"),
                          );
                      }}
                      placeholder="Tutorial title…"
                      className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Category</span>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="mt-1 block w-full border rounded-lg px-2 py-2 bg-background focus:outline-none font-normal"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      >
                        {[
                          "Web Development",
                          "Data Science",
                          "DevOps",
                          "Computer Science",
                          "Mobile",
                          "AI & ML",
                          "Other",
                        ].map((c) => (
                          <option key={c}>{c}</option>
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
                        className="mt-1 block w-full border rounded-lg px-2 py-2 bg-background focus:outline-none font-normal"
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
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Reading Time (min)</span>
                      <input
                        type="number"
                        value={formReadingTime}
                        onChange={(e) =>
                          setFormReadingTime(Number(e.target.value))
                        }
                        min={1}
                        className="mt-1 block w-full border rounded-lg px-2 py-2 focus:outline-none font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Author</span>
                      <input
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="Author name"
                        className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                        style={{
                          background: "transparent",
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      />
                    </label>
                    <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Status</span>
                      <select
                        value={formStatus}
                        onChange={(e) =>
                          setFormStatus(
                            e.target.value as
                              | "published"
                              | "draft"
                              | "archived",
                          )
                        }
                        className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none font-normal"
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
                  </div>

                  <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                    <span>Tags (comma-separated)</span>
                    <input
                      value={formTagsRaw}
                      onChange={(e) => setFormTagsRaw(e.target.value)}
                      placeholder="react, hooks, performance"
                      className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </label>

                  {/* Markdown Editor */}
                  <div>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground block mb-1">
                      Content (Markdown)
                    </span>
                    <textarea
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      rows={10}
                      className="w-full border rounded-lg p-3 focus:outline-none resize-y font-mono text-[11px] leading-relaxed"
                      style={{
                        background:
                          "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </div>

                  {/* AI Panel */}
                  <div
                    className="border rounded-xl p-4 space-y-3"
                    style={{
                      borderColor: "var(--sb-border)",
                      background:
                        "color-mix(in oklab, #6366f1 3%, transparent)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Bot size={13} className="text-indigo-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">
                        AI Assistant
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Generate Summary", key: "summary" as const },
                        {
                          label: "Learning Objectives",
                          key: "objectives" as const,
                        },
                        { label: "SEO Description", key: "seo" as const },
                        { label: "Suggest Tags", key: "tags" as const },
                      ].map(({ label, key }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => simulateAi(key)}
                          disabled={aiLoading !== null}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                          style={{
                            background:
                              "color-mix(in oklab, #6366f1 12%, transparent)",
                            color: "#a5b4fc",
                            border:
                              "1px solid color-mix(in oklab, #6366f1 20%, transparent)",
                          }}
                        >
                          {aiLoading === key ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Sparkles size={10} />
                          )}
                          {label}
                        </button>
                      ))}
                    </div>
                    {aiSummary && (
                      <div
                        className="text-[10px] p-2.5 rounded-lg leading-relaxed"
                        style={{
                          background:
                            "color-mix(in oklab, var(--sb-ink) 3%, transparent)",
                          color: "var(--sb-ink-muted)",
                        }}
                      >
                        <span className="font-bold text-indigo-400 block mb-1">
                          Summary
                        </span>
                        {aiSummary}
                      </div>
                    )}
                    {aiObjectives.length > 0 && (
                      <div
                        className="text-[10px] p-2.5 rounded-lg"
                        style={{
                          background:
                            "color-mix(in oklab, var(--sb-ink) 3%, transparent)",
                        }}
                      >
                        <span className="font-bold text-indigo-400 block mb-1">
                          Objectives
                        </span>
                        {aiObjectives.map((o, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 mb-0.5"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            <span className="shrink-0 mt-0.5">•</span>
                            {o}
                          </div>
                        ))}
                      </div>
                    )}
                    {aiSeo && (
                      <div
                        className="text-[10px] p-2.5 rounded-lg leading-relaxed"
                        style={{
                          background:
                            "color-mix(in oklab, var(--sb-ink) 3%, transparent)",
                          color: "var(--sb-ink-muted)",
                        }}
                      >
                        <span className="font-bold text-indigo-400 block mb-1">
                          SEO Description
                        </span>
                        {aiSeo}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              className="px-5 py-4 border-t flex items-center gap-3 shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleSave}
                disabled={!formTitle.trim() || saveTutorial.isPending}
                className="flex-1 active:scale-[0.98]"
              >
                {saveTutorial.isPending
                  ? "Saving…"
                  : edit.id
                    ? "Update Tutorial"
                    : "Create Tutorial"}
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
